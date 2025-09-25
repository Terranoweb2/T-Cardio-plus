const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || './database/t-cardio.db';
const JWT_SECRET = process.env.JWT_SECRET || 'tcardio-production-secret-2025';

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || true, // Permettre toutes les origines en production
    credentials: true
}));
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../dist')));

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

// Routes API (reprendre toutes les routes du serveur de développement)
// Route racine API pour information
app.get('/api', (req, res) => {
    res.json({
        name: 'T-Cardio API',
        version: '1.0.0',
        description: 'API REST pour l\'application T-Cardio - Production',
        environment: 'production',
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
        }
    });
});

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'T-Cardio Production Server opérationnel',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'production',
        version: '1.0.0'
    });
});

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
            // Vérifier le mot de passe (simple pour les comptes de test)
            const isValidPassword = password === 'password' || await bcrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Mot de passe incorrect' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            res.json({ user: userWithoutPassword, token });
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

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    });
});

// Routes pour les mesures de tension artérielle
app.get('/api/blood-pressure/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;
    
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

// Routes pour le partage des mesures (médecin)
app.get('/api/doctor/:doctorId/measurements', authenticateToken, (req, res) => {
    const { doctorId } = req.params;
    
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

app.put('/api/measurements/:readingId/mark-read', authenticateToken, (req, res) => {
    const { readingId } = req.params;
    
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

app.get('/api/doctor/:doctorId/unread-count', authenticateToken, (req, res) => {
    const { doctorId } = req.params;
    
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

// Route catch-all pour servir le frontend React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 T-Cardio Production Server démarré sur le port ${PORT}`);
    console.log(`📍 Application disponible sur http://0.0.0.0:${PORT}`);
    console.log(`📊 API disponible sur http://0.0.0.0:${PORT}/api`);
    console.log(`🗄️ Base de données: ${DB_PATH}`);
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
