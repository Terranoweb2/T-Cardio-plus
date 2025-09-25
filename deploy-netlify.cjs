#!/usr/bin/env node

/**
 * Script de déploiement automatique pour Netlify - Version corrigée
 * Usage: node deploy-netlify.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement T-Cardio sur Netlify (Version corrigée)\n');

// Vérifications préliminaires
function checkPrerequisites() {
    console.log('🔍 Vérification des prérequis...');
    
    // Vérifier que nous sommes dans le bon dossier
    if (!fs.existsSync('package.json')) {
        console.error('❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet.');
        process.exit(1);
    }
    
    // Vérifier que netlify.toml existe
    if (!fs.existsSync('netlify.toml')) {
        console.error('❌ Erreur: netlify.toml non trouvé. Configuration Netlify manquante.');
        process.exit(1);
    }
    
    console.log('✅ Prérequis vérifiés\n');
}

// Build du projet
function buildProject() {
    console.log('🔨 Build du projet...');
    
    try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ Build réussi\n');
    } catch (error) {
        console.error('❌ Erreur lors du build:', error.message);
        process.exit(1);
    }
}

// Vérifier le dossier dist
function checkDistFolder() {
    console.log('📁 Vérification du dossier dist...');
    
    if (!fs.existsSync('dist')) {
        console.error('❌ Erreur: Dossier dist non trouvé après le build.');
        process.exit(1);
    }
    
    if (!fs.existsSync('dist/index.html')) {
        console.error('❌ Erreur: index.html non trouvé dans dist/.');
        process.exit(1);
    }
    
    // Afficher la taille du build
    const stats = fs.statSync('dist');
    console.log('✅ Dossier dist prêt');
    
    // Lister les fichiers principaux
    const files = fs.readdirSync('dist');
    console.log('📄 Fichiers générés:', files.join(', '));
    console.log('');
}

// Instructions de déploiement
function showDeploymentInstructions() {
    console.log('📋 Instructions de déploiement:\n');
    
    console.log('🔗 Option 1 - Déploiement manuel:');
    console.log('   1. Aller sur https://netlify.com');
    console.log('   2. Glisser-déposer le dossier "dist" sur Netlify');
    console.log('   3. Votre site sera disponible sur une URL .netlify.app\n');
    
    console.log('🔗 Option 2 - Déploiement via Git (recommandé):');
    console.log('   1. git add .');
    console.log('   2. git commit -m "Deploy to Netlify"');
    console.log('   3. git push origin main');
    console.log('   4. Connecter le repo sur Netlify\n');
    
    console.log('🔗 Option 3 - Netlify CLI:');
    console.log('   1. npm install -g netlify-cli');
    console.log('   2. netlify login');
    console.log('   3. netlify deploy --prod --dir=dist\n');
    
    console.log('⚙️  Variables d\'environnement à configurer sur Netlify:');
    console.log('   VITE_ENVIRONMENT=production');
    console.log('   VITE_API_ENABLED=false');
    console.log('   VITE_API_KEY=your-gemini-key (optionnel)\n');
}

// Créer un fichier de configuration pour Netlify
function createNetlifyConfig() {
    console.log('⚙️  Création de la configuration Netlify...');
    
    const config = {
        build: {
            command: 'npm run build',
            publish: 'dist'
        },
        environment: {
            VITE_ENVIRONMENT: 'production',
            VITE_API_ENABLED: 'false'
        },
        redirects: [
            {
                from: '/*',
                to: '/index.html',
                status: 200
            }
        ]
    };
    
    // Le fichier netlify.toml existe déjà, on affiche juste la config
    console.log('✅ Configuration netlify.toml déjà présente\n');
}

// Fonction principale
function main() {
    try {
        checkPrerequisites();
        buildProject();
        checkDistFolder();
        createNetlifyConfig();
        showDeploymentInstructions();
        
        console.log('🎉 Préparation terminée ! Votre application T-Cardio est prête pour Netlify.');
        console.log('📍 Dossier à déployer: ./dist/');
        console.log('🌐 L\'application utilisera IndexedDB en production.');
        
    } catch (error) {
        console.error('❌ Erreur lors de la préparation:', error.message);
        process.exit(1);
    }
}

// Exécuter le script
if (require.main === module) {
    main();
}

module.exports = { main };
