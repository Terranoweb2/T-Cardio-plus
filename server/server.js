const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || './database/t-cardio.db';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
    credentials: true
}));
app.use(express.json());

// Connexion à la base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Erreur connexion base de données:', err.message);
        process.exit(1);
    }
    console.log('✅ Connecté à la base de données SQLite');
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token d\'accès requis' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Erreur base de données:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        try {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Mot de passe incorrect' });
            }

            // Créer le token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retourner les données utilisateur (sans le mot de passe)
            const { password: _, ...userWithoutPassword } = user;
            res.json({
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            console.error('Erreur authentification:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
});

// Route pour obtenir l'utilisateur actuel
app.get('/api/auth/me', authenticateToken, (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) {
            console.error('Erreur base de données:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    });
});

// Routes pour les mesures de tension artérielle
app.get('/api/blood-pressure/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;
    
    // Vérifier que l'utilisateur peut accéder à ces données
    if (req.user.id !== userId && req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Accès non autorisé' });
    }

    db.all(`
        SELECT bp.*, u.name as patient_name
        FROM blood_pressure_readings bp
        LEFT JOIN users u ON bp.user_id = u.id
        WHERE bp.user_id = ?
        ORDER BY bp.timestamp DESC
    `, [userId], (err, readings) => {
        if (err) {
            console.error('Erreur récupération mesures:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(readings);
    });
});

app.post('/api/blood-pressure', authenticateToken, (req, res) => {
    const { userId, systolic, diastolic, pulse, interpretation } = req.body;

    // Vérifier que l'utilisateur peut ajouter des données
    if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const timestamp = Date.now();

    // Récupérer le médecin lié au patient pour le partage automatique
    db.get('SELECT linked_doctor_id FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Erreur récupération utilisateur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        const doctorId = user?.linked_doctor_id;
        const sharedWithDoctor = !!doctorId;

        db.run(`
            INSERT INTO blood_pressure_readings (
                user_id, systolic, diastolic, pulse, timestamp,
                classification, summary, risk_level,
                shared_with_doctor, doctor_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId, systolic, diastolic, pulse, timestamp,
            interpretation.classification,
            interpretation.summary,
            interpretation.riskLevel,
            sharedWithDoctor,
            doctorId
        ], function(err) {
            if (err) {
                console.error('Erreur insertion mesure:', err);
                return res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
            }

            // Retourner la mesure créée
            db.get('SELECT * FROM blood_pressure_readings WHERE id = ?', [this.lastID], (err, reading) => {
                if (err) {
                    console.error('Erreur récupération mesure:', err);
                    return res.status(500).json({ error: 'Erreur serveur' });
                }
                res.status(201).json(reading);
            });
        });
    });
});

// Routes pour le partage des mesures
app.get('/api/doctor/:doctorId/measurements', authenticateToken, (req, res) => {
    const { doctorId } = req.params;

    // Vérifier que l'utilisateur est le médecin ou un admin
    if (req.user.id !== doctorId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
    }

    db.all(`
        SELECT bp.*, u.name as patient_name, u.email as patient_email
        FROM blood_pressure_readings bp
        JOIN users u ON bp.user_id = u.id
        WHERE bp.doctor_id = ? AND bp.shared_with_doctor = 1
        ORDER BY bp.timestamp DESC
    `, [doctorId], (err, readings) => {
        if (err) {
            console.error('Erreur récupération mesures médecin:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(readings);
    });
});

// Route pour marquer une mesure comme lue par le médecin
app.put('/api/measurements/:readingId/mark-read', authenticateToken, (req, res) => {
    const { readingId } = req.params;

    // Vérifier que l'utilisateur est un médecin
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Seuls les médecins peuvent marquer les mesures comme lues' });
    }

    const readTimestamp = Date.now();

    db.run(`
        UPDATE blood_pressure_readings
        SET doctor_read_at = ?
        WHERE id = ? AND doctor_id = ?
    `, [readTimestamp, readingId, req.user.id], function(err) {
        if (err) {
            console.error('Erreur marquage lecture:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Mesure non trouvée ou accès non autorisé' });
        }

        res.json({
            success: true,
            readAt: readTimestamp,
            message: 'Mesure marquée comme lue'
        });
    });
});

// Route pour obtenir le nombre de mesures non lues pour un médecin
app.get('/api/doctor/:doctorId/unread-count', authenticateToken, (req, res) => {
    const { doctorId } = req.params;

    // Vérifier que l'utilisateur est le médecin
    if (req.user.id !== doctorId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
    }

    db.get(`
        SELECT COUNT(*) as count
        FROM blood_pressure_readings
        WHERE doctor_id = ? AND shared_with_doctor = 1 AND doctor_read_at IS NULL
    `, [doctorId], (err, result) => {
        if (err) {
            console.error('Erreur comptage mesures non lues:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json({ unreadCount: result.count });
    });
});

// Route racine pour information
app.get('/', (req, res) => {
    const acceptHeader = req.headers.accept || '';

    // Si le client préfère HTML, renvoyer une page HTML
    if (acceptHeader.includes('text/html')) {
        res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>T-Cardio Server</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden; }
        .header { background: #4f46e5; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .status { background: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 30px; font-weight: bold; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .endpoint { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #4f46e5; }
        .method { background: #4f46e5; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 10px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .info-card { background: #f3f4f6; padding: 20px; border-radius: 8px; }
        .info-card h3 { margin-top: 0; color: #374151; }
        .link { color: #4f46e5; text-decoration: none; }
        .link:hover { text-decoration: underline; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 T-Cardio Server</h1>
            <p>Backend API pour l'application de suivi cardiovasculaire</p>
        </div>

        <div class="content">
            <div class="status">
                ✅ Serveur opérationnel - ${new Date().toLocaleString('fr-FR')}
            </div>

            <div class="section">
                <h2>🔗 Endpoints API</h2>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <a href="/api/health" class="link">/api/health</a> - Santé du serveur
                </div>
                <div class="endpoint">
                    <span class="method">POST</span>
                    /api/auth/login - Connexion utilisateur
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    /api/auth/me - Profil utilisateur actuel
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    /api/blood-pressure/:userId - Mesures de tension
                </div>
                <div class="endpoint">
                    <span class="method">POST</span>
                    /api/blood-pressure - Ajouter une mesure
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    /api/doctor/:doctorId/measurements - Mesures partagées
                </div>
            </div>

            <div class="info-grid">
                <div class="info-card">
                    <h3>🗄️ Base de données</h3>
                    <p><strong>Type:</strong> SQLite</p>
                    <p><strong>Fichier:</strong> ./database/t-cardio.db</p>
                    <p><strong>Statut:</strong> ✅ Connecté</p>
                </div>

                <div class="info-card">
                    <h3>🌐 Frontend</h3>
                    <p><strong>URL:</strong> <a href="http://localhost:5173" class="link">http://localhost:5173</a></p>
                    <p><strong>CORS:</strong> ${process.env.CORS_ORIGIN || 'http://localhost:5173'}</p>
                </div>

                <div class="info-card">
                    <h3>👥 Comptes de test</h3>
                    <p><strong>👨‍⚕️ Médecin:</strong> medecin@app.com</p>
                    <p><strong>🧑‍🦱 Patient:</strong> patient@app.com</p>
                    <p><strong>Mot de passe:</strong> password</p>
                </div>
            </div>
        </div>

        <div class="footer">
            T-Cardio Server v1.0.0 - Port ${PORT} - Node.js + Express + SQLite
        </div>
    </div>
</body>
</html>
        `);
    } else {
        // Sinon, renvoyer du JSON
        res.json({
            name: 'T-Cardio Server',
            version: '1.0.0',
            description: 'Backend API pour l\'application T-Cardio',
            status: 'Opérationnel',
            timestamp: new Date().toISOString(),
            endpoints: {
                health: '/api/health',
                auth: {
                    login: 'POST /api/auth/login',
                    me: 'GET /api/auth/me'
                },
                bloodPressure: {
                    get: 'GET /api/blood-pressure/:userId',
                    add: 'POST /api/blood-pressure'
                },
                doctor: {
                    measurements: 'GET /api/doctor/:doctorId/measurements',
                    markRead: 'PUT /api/measurements/:readingId/mark-read',
                    unreadCount: 'GET /api/doctor/:doctorId/unread-count'
                }
            },
            database: {
                type: 'SQLite',
                path: './database/t-cardio.db',
                status: 'Connecté'
            },
            frontend: {
                url: 'http://localhost:5173',
                cors: process.env.CORS_ORIGIN || 'http://localhost:5173'
            }
        });
    }
});

// Route de documentation API
app.get('/api', (req, res) => {
    res.json({
        name: 'T-Cardio API',
        version: '1.0.0',
        description: 'API REST pour l\'application T-Cardio',
        baseUrl: `http://localhost:${PORT}/api`,
        endpoints: {
            health: {
                method: 'GET',
                path: '/api/health',
                description: 'Vérifier la santé du serveur',
                example: `curl http://localhost:${PORT}/api/health`
            },
            auth: {
                login: {
                    method: 'POST',
                    path: '/api/auth/login',
                    description: 'Connexion utilisateur',
                    body: { email: 'string', password: 'string' },
                    example: `curl -X POST -H "Content-Type: application/json" -d '{"email":"patient@app.com","password":"password"}' http://localhost:${PORT}/api/auth/login`
                },
                me: {
                    method: 'GET',
                    path: '/api/auth/me',
                    description: 'Obtenir le profil utilisateur actuel',
                    headers: { Authorization: 'Bearer <token>' },
                    example: `curl -H "Authorization: Bearer <token>" http://localhost:${PORT}/api/auth/me`
                }
            },
            bloodPressure: {
                get: {
                    method: 'GET',
                    path: '/api/blood-pressure/:userId',
                    description: 'Obtenir les mesures de tension d\'un utilisateur',
                    headers: { Authorization: 'Bearer <token>' },
                    example: `curl -H "Authorization: Bearer <token>" http://localhost:${PORT}/api/blood-pressure/user123`
                },
                add: {
                    method: 'POST',
                    path: '/api/blood-pressure',
                    description: 'Ajouter une nouvelle mesure de tension',
                    headers: { Authorization: 'Bearer <token>' },
                    body: {
                        userId: 'string',
                        systolic: 'number',
                        diastolic: 'number',
                        pulse: 'number',
                        interpretation: {
                            classification: 'string',
                            summary: 'string',
                            riskLevel: 'string'
                        }
                    }
                }
            },
            doctor: {
                measurements: {
                    method: 'GET',
                    path: '/api/doctor/:doctorId/measurements',
                    description: 'Obtenir les mesures partagées avec un médecin',
                    headers: { Authorization: 'Bearer <token>' }
                },
                markRead: {
                    method: 'PUT',
                    path: '/api/measurements/:readingId/mark-read',
                    description: 'Marquer une mesure comme lue par le médecin',
                    headers: { Authorization: 'Bearer <token>' }
                },
                unreadCount: {
                    method: 'GET',
                    path: '/api/doctor/:doctorId/unread-count',
                    description: 'Obtenir le nombre de mesures non lues',
                    headers: { Authorization: 'Bearer <token>' }
                }
            }
        },
        testAccounts: {
            doctor: {
                email: 'medecin@app.com',
                password: 'password',
                name: 'Dr Marie Curie',
                role: 'doctor'
            },
            patient: {
                email: 'patient@app.com',
                password: 'password',
                name: 'John Doe',
                role: 'patient'
            }
        },
        database: {
            type: 'SQLite',
            file: './database/t-cardio.db',
            tables: ['users', 'blood_pressure_readings', 'invitation_codes', 'messages', 'medical_notes', 'reminders', 'shared_files']
        }
    });
});

// Route de test
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Serveur T-Cardio opérationnel',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur T-Cardio démarré sur le port ${PORT}`);
    console.log(`📍 API disponible sur http://localhost:${PORT}/api`);
    console.log(`🔗 Frontend configuré pour ${process.env.CORS_ORIGIN}`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    db.close((err) => {
        if (err) {
            console.error('Erreur fermeture base:', err.message);
        } else {
            console.log('✅ Base de données fermée');
        }
        process.exit(0);
    });
});
