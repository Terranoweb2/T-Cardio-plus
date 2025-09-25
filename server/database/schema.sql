-- Schema de base de données T-Cardio
-- SQLite Database Schema

-- Table des utilisateurs (patients et médecins)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Champs spécifiques aux patients
    dob TEXT,
    gender TEXT,
    blood_type TEXT,
    allergies TEXT,
    linked_doctor_id TEXT,
    
    -- Champs spécifiques aux médecins
    specialty TEXT,
    clinic TEXT,
    phone TEXT,
    address TEXT,
    
    FOREIGN KEY (linked_doctor_id) REFERENCES users(id)
);

-- Table des mesures de tension artérielle
CREATE TABLE IF NOT EXISTS blood_pressure_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    systolic INTEGER NOT NULL,
    diastolic INTEGER NOT NULL,
    pulse INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    classification TEXT,
    summary TEXT,
    risk_level TEXT CHECK (risk_level IN ('low', 'normal', 'elevated', 'warning', 'danger', 'critical')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Champs pour le partage automatique des mesures
    shared_with_doctor BOOLEAN DEFAULT FALSE,
    doctor_id TEXT,
    doctor_read_at INTEGER,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- Table des codes d'invitation
CREATE TABLE IF NOT EXISTS invitation_codes (
    code TEXT PRIMARY KEY,
    doctor_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    used_by TEXT,
    used_at DATETIME,
    
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (used_by) REFERENCES users(id)
);

-- Table des messages (chat)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
    timestamp INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Table des rappels
CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    reminder_time DATETIME NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- Table des notes médicales
CREATE TABLE IF NOT EXISTS medical_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    UNIQUE(patient_id, doctor_id)
);

-- Table des fichiers partagés
CREATE TABLE IF NOT EXISTS shared_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_blood_pressure_user_timestamp ON blood_pressure_readings(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_blood_pressure_doctor ON blood_pressure_readings(doctor_id, doctor_read_at);
CREATE INDEX IF NOT EXISTS idx_blood_pressure_shared ON blood_pressure_readings(shared_with_doctor, doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_reminders_patient ON reminders(patient_id, reminder_time);
CREATE INDEX IF NOT EXISTS idx_medical_notes_patient_doctor ON medical_notes(patient_id, doctor_id);
