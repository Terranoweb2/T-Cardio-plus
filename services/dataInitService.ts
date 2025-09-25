import { db, initializeTestData, resetTestData } from './db';

/**
 * Service pour gérer l'initialisation et la persistance des données
 */

// Vérifier et initialiser les données au démarrage de l'application
export async function ensureDataIntegrity() {
  try {
    console.log('🔍 Vérification de l\'intégrité des données...');
    
    // Vérifier si la base de données est accessible
    const userCount = await db.users.count();
    console.log(`📊 Nombre d'utilisateurs dans la base: ${userCount}`);
    
    if (userCount === 0) {
      console.log('⚠️ Aucun utilisateur trouvé, initialisation des données de test...');
      await initializeTestData();
    } else {
      // Vérifier que les utilisateurs de test existent
      const testDoctor = await db.users.get('doctor_initial_1');
      const testPatient = await db.users.get('patient_initial_1');
      
      if (!testDoctor || !testPatient) {
        console.log('⚠️ Utilisateurs de test manquants, réinitialisation...');
        await initializeTestData();
      }
    }
    
    console.log('✅ Intégrité des données vérifiée');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des données:', error);
    return false;
  }
}

// Fonction pour diagnostiquer les problèmes de données
export async function diagnoseDataIssues() {
  try {
    console.log('🔧 Diagnostic des données...');
    
    const users = await db.users.toArray();
    const readings = await db.bloodPressureReadings.toArray();
    const messages = await db.messages.toArray();
    
    console.log('📊 État de la base de données:');
    console.log(`- Utilisateurs: ${users.length}`);
    console.log(`- Mesures de tension: ${readings.length}`);
    console.log(`- Messages: ${messages.length}`);
    
    // Vérifier les utilisateurs de test
    const testDoctor = users.find(u => u.email === 'medecin@app.com');
    const testPatient = users.find(u => u.email === 'patient@app.com');
    
    console.log('👨‍⚕️ Médecin de test:', testDoctor ? '✅ Présent' : '❌ Manquant');
    console.log('🧑‍🦱 Patient de test:', testPatient ? '✅ Présent' : '❌ Manquant');
    
    if (!testDoctor || !testPatient) {
      console.log('🔄 Réinitialisation des utilisateurs de test...');
      await initializeTestData();
    }
    
    return {
      usersCount: users.length,
      readingsCount: readings.length,
      messagesCount: messages.length,
      testDoctorExists: !!testDoctor,
      testPatientExists: !!testPatient
    };
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    return null;
  }
}

// Fonction pour forcer la réinitialisation complète
export async function forceReset() {
  try {
    console.log('🔄 Réinitialisation forcée des données...');
    await resetTestData();
    console.log('✅ Réinitialisation terminée');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    return false;
  }
}

// Fonction pour créer des données de démonstration
export async function createDemoData() {
  try {
    console.log('🎭 Création de données de démonstration...');
    
    const patientId = 'patient_initial_1';
    const doctorId = 'doctor_initial_1';
    
    // Ajouter quelques mesures de démonstration
    const demoReadings = [
      {
        userId: patientId,
        systolic: 120,
        diastolic: 80,
        pulse: 72,
        timestamp: Date.now() - 86400000 * 7, // Il y a 7 jours
        interpretation: {
          classification: 'Normale',
          summary: 'Tension artérielle normale selon les standards OMS',
          riskLevel: 'normal'
        },
        sharedWithDoctor: true,
        doctorId: doctorId,
        doctorReadAt: Date.now() - 86400000 * 6 // Lu il y a 6 jours
      },
      {
        userId: patientId,
        systolic: 130,
        diastolic: 85,
        pulse: 75,
        timestamp: Date.now() - 86400000 * 3, // Il y a 3 jours
        interpretation: {
          classification: 'Pré-hypertension',
          summary: 'Tension artérielle élevée - Zone de vigilance selon OMS/ISH',
          riskLevel: 'elevated'
        },
        sharedWithDoctor: true,
        doctorId: doctorId,
        doctorReadAt: Date.now() - 86400000 * 2 // Lu il y a 2 jours
      },
      {
        userId: patientId,
        systolic: 125,
        diastolic: 82,
        pulse: 70,
        timestamp: Date.now() - 3600000, // Il y a 1 heure
        interpretation: {
          classification: 'Normale',
          summary: 'Tension artérielle normale selon les standards OMS',
          riskLevel: 'normal'
        },
        sharedWithDoctor: true,
        doctorId: doctorId,
        doctorReadAt: undefined // Pas encore lu
      }
    ];
    
    // Supprimer les anciennes mesures de démonstration
    await db.bloodPressureReadings.where('userId').equals(patientId).delete();
    
    // Ajouter les nouvelles mesures
    for (const reading of demoReadings) {
      await db.bloodPressureReadings.add(reading as any);
    }
    
    console.log(`✅ ${demoReadings.length} mesures de démonstration créées`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création des données de démonstration:', error);
    return false;
  }
}

// Fonction pour vérifier la connectivité de la base de données
export async function checkDatabaseConnection() {
  try {
    await db.users.count();
    return true;
  } catch (error) {
    console.error('❌ Problème de connexion à la base de données:', error);
    return false;
  }
}

// Fonction utilitaire pour afficher l'état de la base
export async function showDatabaseStatus() {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.log('❌ Base de données non accessible');
      return;
    }
    
    const diagnosis = await diagnoseDataIssues();
    if (diagnosis) {
      console.log('📊 État de la base de données T-Cardio:');
      console.log(`   👥 Utilisateurs: ${diagnosis.usersCount}`);
      console.log(`   📈 Mesures: ${diagnosis.readingsCount}`);
      console.log(`   💬 Messages: ${diagnosis.messagesCount}`);
      console.log(`   👨‍⚕️ Médecin test: ${diagnosis.testDoctorExists ? '✅' : '❌'}`);
      console.log(`   🧑‍🦱 Patient test: ${diagnosis.testPatientExists ? '✅' : '❌'}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage du statut:', error);
  }
}

// Initialisation automatique au chargement du module
let initializationPromise: Promise<boolean> | null = null;

export function getInitializationPromise() {
  if (!initializationPromise) {
    initializationPromise = ensureDataIntegrity();
  }
  return initializationPromise;
}

// Les fonctions de debug sont maintenant exposées via debugModeService
// uniquement quand le mode debug est activé
