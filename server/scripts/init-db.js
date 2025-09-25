const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Créer le dossier database s'il n'existe pas
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 't-cardio.db');
const schemaPath = path.join(__dirname, '../database/schema.sql');

console.log('🗄️ Initialisation de la base de données T-Cardio...');

// Supprimer la base existante si elle existe
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('📝 Ancienne base de données supprimée');
}

// Créer une nouvelle base de données
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erreur lors de la création de la base:', err.message);
        process.exit(1);
    }
    console.log('✅ Base de données créée avec succès');
});

// Lire et exécuter le schéma
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, async (err) => {
    if (err) {
        console.error('❌ Erreur lors de la création du schéma:', err.message);
        process.exit(1);
    }
    console.log('✅ Schéma de base de données créé');

    // Insérer des données de test
    await insertTestData(db);
});

async function insertTestData(db) {
    console.log('📊 Insertion des données de test...');

    const doctorId = uuidv4();
    const patientId = uuidv4();
    
    // Hash des mots de passe
    const doctorPassword = await bcrypt.hash('password', 10);
    const patientPassword = await bcrypt.hash('password', 10);

    // Insérer le médecin
    db.run(`
        INSERT INTO users (
            id, email, password, name, role, specialty, clinic, phone, address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        doctorId,
        'medecin@app.com',
        doctorPassword,
        'Dr. Marie Curie',
        'doctor',
        'Cardiologie',
        'Hôpital de la Pitié-Salpêtrière',
        '01 23 45 67 89',
        '47-83 Boulevard de l\'Hôpital, 75013 Paris'
    ], function(err) {
        if (err) {
            console.error('❌ Erreur insertion médecin:', err.message);
        } else {
            console.log('✅ Médecin inséré avec ID:', doctorId);
        }
    });

    // Insérer le patient
    db.run(`
        INSERT INTO users (
            id, email, password, name, role, dob, gender, blood_type, allergies, linked_doctor_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        patientId,
        'patient@app.com',
        patientPassword,
        'John Doe',
        'patient',
        '1985-05-20',
        'Homme',
        'O+',
        'Pollen',
        doctorId
    ], function(err) {
        if (err) {
            console.error('❌ Erreur insertion patient:', err.message);
        } else {
            console.log('✅ Patient inséré avec ID:', patientId);
        }
    });

    // Insérer quelques mesures de tension de test
    const readings = [
        { systolic: 120, diastolic: 80, pulse: 72, classification: 'Normale', risk_level: 'normal' },
        { systolic: 135, diastolic: 85, pulse: 78, classification: 'Hypertension Stade 1', risk_level: 'warning' },
        { systolic: 118, diastolic: 76, pulse: 68, classification: 'Normale', risk_level: 'normal' }
    ];

    readings.forEach((reading, index) => {
        const timestamp = Date.now() - (index * 24 * 60 * 60 * 1000); // Espacer d'un jour
        db.run(`
            INSERT INTO blood_pressure_readings (
                user_id, systolic, diastolic, pulse, timestamp, classification,
                summary, risk_level, shared_with_doctor, doctor_id, doctor_read_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            patientId,
            reading.systolic,
            reading.diastolic,
            reading.pulse,
            timestamp,
            reading.classification,
            `Mesure de tension: ${reading.systolic}/${reading.diastolic} mmHg`,
            reading.risk_level,
            true, // shared_with_doctor
            doctorId, // doctor_id
            index === 0 ? Date.now() - 3600000 : null // doctor_read_at (première mesure lue il y a 1h)
        ]);
    });

    console.log('✅ Données de test insérées');

    // Fermer la base de données
    db.close((err) => {
        if (err) {
            console.error('❌ Erreur fermeture base:', err.message);
        } else {
            console.log('🎉 Base de données T-Cardio initialisée avec succès !');
            console.log('📍 Emplacement:', dbPath);
            console.log('👨‍⚕️ Médecin: medecin@app.com / password');
            console.log('🧑‍🦱 Patient: patient@app.com / password');
        }
        process.exit(0);
    });
}
