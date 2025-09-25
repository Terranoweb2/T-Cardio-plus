# 🔶 Pré-hypertension selon OMS/ISH - T-Cardio

## 🎯 Définition officielle intégrée

T-Cardio intègre maintenant la **définition précise de la pré-hypertension** selon les critères de l'**OMS (Organisation Mondiale de la Santé)** et de la **Société Internationale d'Hypertension (ISH)** !

## 📊 Seuils officiels de la pré-hypertension

### Critères OMS/ISH

| **Paramètre** | **Seuils officiels** | **Exemple** |
|---------------|---------------------|-------------|
| **Pression systolique (PAS)** | **120 – 139 mmHg** | 130 mmHg |
| **Pression diastolique (PAD)** | **80 – 89 mmHg** | 85 mmHg |

👉 **Exemple concret** : Une tension de **130/85 mmHg** est classée **pré-hypertension**.

### 🔍 Signification médicale

#### **Ce que c'est :**
- ❌ **Ce n'est pas encore de l'hypertension confirmée**
- ⚠️ **Zone intermédiaire** entre la normale et l'hypertension
- 📈 **Augmente le risque** de développer une hypertension véritable
- 🚨 **Signal d'alerte** pour corriger les habitudes de vie

#### **Ce que ce n'est pas :**
- ❌ **Pas une maladie** en soi
- ❌ **Pas une urgence médicale**
- ❌ **Pas besoin de médicaments** (en général)

## 🩺 Prise en charge selon OMS/ISH

### 1. **Traitement médicamenteux**

#### **Règle générale :**
- ✅ **Pas de médicament en général**
- ⚠️ **Sauf cas particuliers** :
  - Diabète
  - Maladie rénale
  - Antécédents cardiovasculaires

### 2. **Mesures hygiéno-diététiques (prioritaires)**

#### **Actions recommandées :**
1. **Diminuer le sel** : < 5g/jour
2. **Activité physique régulière** : 30 min/jour
3. **Perdre du poids** si IMC élevé
4. **Éviter tabac et excès d'alcool**
5. **Favoriser** : Fruits, légumes, fibres

### 3. **Surveillance régulière**

#### **Fréquence recommandée :**
- 📅 **Mesurer la tension au moins 1 fois par mois**
- 📊 **Suivi de l'évolution** vers l'hypertension
- 🔍 **Contrôle de l'efficacité** des mesures hygiéno-diététiques

## 📋 Exemple d'interprétation pré-hypertension

### Tension 130/85 mmHg (pré-hypertension)

```
🎯 Résultats affichés (Standards officiels OMS)
• Pression systolique (PAS) : 130 mmHg → pré-hypertension (120-139 mmHg - zone de vigilance OMS/ISH)
• Pression diastolique (PAD) : 85 mmHg → pré-hypertension (80-89 mmHg - zone de vigilance OMS/ISH)
• Pouls (PUL) : 72 battements/min → normal et régulier

🔍 Classification médicale officielle OMS
• Catégorie OMS : Pré-hypertension (OMS/ISH)
• Évaluation du risque : Zone de vigilance - Signal d'alerte pour corriger les habitudes de vie
• Contexte : Le pouls de 72 bpm est normal (60-100)

📌 Conclusion selon standards OMS
⚠️ PRÉ-HYPERTENSION selon l'OMS et la Société Internationale d'Hypertension (ISH) - (120-139/80-89 mmHg). 
Ce n'est pas encore de l'hypertension confirmée, mais cela augmente le risque de développer une hypertension véritable. 
C'est un signal d'alerte pour corriger vos habitudes de vie.

✅ Plan d'action OMS
1. Repos préalable OMS : Restez assis calmement au moins 5 minutes avant la mesure
2. Position correcte : Assis, dos et bras soutenus, pieds au sol, manchette au niveau du cœur
3. Évitez 30 min avant : Café, thé, alcool, tabac, effort physique selon protocole OMS
4. Nombre de mesures : Au moins 2 mesures à 1-2 minutes d'intervalle...
5. Zone de vigilance OMS/ISH : Pré-hypertension = 120-139/80-89 mmHg. Ce n'est pas encore une maladie, mais un avertissement
6. Pas de médicament en général (sauf cas particuliers : diabète, maladie rénale, antécédents cardiovasculaires)
7. Mesures hygiéno-diététiques : Diminuer le sel (< 5g/jour), activité physique (30 min/jour), perdre du poids si IMC élevé
8. Éviter : Tabac et excès d'alcool. Favoriser fruits, légumes, fibres
9. Surveillance régulière : Mesurer la tension au moins 1 fois par mois
```

## 🔧 Implémentation technique

### Fonctions mises à jour

#### 1. **Classification précise**
```typescript
// Pré-hypertension selon OMS/ISH - 120-139/80-89 mmHg
if ((systolic >= 120 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
  return {
    classification: 'Pré-hypertension (OMS/ISH)',
    riskLevel: 'elevated',
    grade: 'Zone de vigilance'
  };
}
```

#### 2. **Messages spécifiques**
- **Terminologie exacte** : "Pré-hypertension (OMS/ISH)"
- **Explication claire** : "Ce n'est pas encore de l'hypertension confirmée"
- **Conseils adaptés** : Mesures hygiéno-diététiques prioritaires

#### 3. **Évaluation du risque**
- **Zone de vigilance** : Signal d'alerte pour corriger les habitudes
- **Pas d'urgence** : Mais surveillance nécessaire
- **Prévention active** : Éviter l'évolution vers l'hypertension

## 🎯 Objectifs de prise en charge

### Résumé pratique OMS/ISH

#### **Objectif principal :**
- 🎯 **Ramener la tension sous 120/80 mmHg**
- 🛡️ **Prévenir l'évolution vers l'hypertension**
- 📉 **Réduire le risque cardiovasculaire futur**

#### **Moyens d'action :**
1. **Hygiène de vie** (priorité absolue)
2. **Surveillance régulière** (mensuelle)
3. **Éducation du patient** (compréhension des enjeux)
4. **Suivi médical** (si facteurs de risque associés)

### Plan d'action structuré

#### **Phase 1 : Évaluation (1er mois)**
- Confirmer la pré-hypertension par plusieurs mesures
- Identifier les facteurs de risque associés
- Évaluer la motivation du patient

#### **Phase 2 : Intervention (3-6 mois)**
- Mise en place des mesures hygiéno-diététiques
- Surveillance mensuelle de la tension
- Ajustements selon les résultats

#### **Phase 3 : Suivi (6-12 mois)**
- Évaluation de l'efficacité des mesures
- Maintien des bonnes habitudes
- Prévention de l'évolution vers l'hypertension

## 🚀 Disponibilité dans T-Cardio

### Fonctionnalités intégrées

#### **Classification automatique :**
- ✅ **Détection précise** des seuils 120-139/80-89 mmHg
- ✅ **Terminologie officielle** OMS/ISH
- ✅ **Messages éducatifs** adaptés à la pré-hypertension

#### **Conseils spécialisés :**
- ✅ **Mesures hygiéno-diététiques** détaillées
- ✅ **Pas de panique** : Explication rassurante
- ✅ **Plan d'action concret** : 5 étapes claires
- ✅ **Surveillance recommandée** : Fréquence mensuelle

#### **Interface utilisateur :**
- 🔶 **Badge orange** : Couleur de vigilance (ni vert ni rouge)
- ⚠️ **Icône d'alerte** : Signal d'attention sans urgence
- 📋 **Messages structurés** : Information claire et complète

## 🎯 Test de la pré-hypertension

### Valeurs à tester dans l'application

1. **Limite basse** : `120/80` → Pré-hypertension
2. **Milieu de zone** : `130/85` → Pré-hypertension typique
3. **Limite haute** : `139/89` → Pré-hypertension maximale
4. **Juste au-dessus** : `140/90` → Hypertension Grade 1

### Vérifications attendues

#### **Pour 130/85 mmHg :**
- ✅ **Classification** : "Pré-hypertension (OMS/ISH)"
- ✅ **Niveau de risque** : "Zone de vigilance"
- ✅ **Message** : "Ce n'est pas encore de l'hypertension confirmée"
- ✅ **Conseils** : Mesures hygiéno-diététiques prioritaires
- ✅ **Surveillance** : Mensuelle recommandée

## 🎉 Résultat

T-Cardio respecte maintenant **exactement la définition de la pré-hypertension selon les critères OMS/ISH** !

### Conformité OMS/ISH complète

✅ **Seuils exacts** : 120-139/80-89 mmHg  
✅ **Terminologie officielle** : "Pré-hypertension (OMS/ISH)"  
✅ **Signification claire** : Zone de vigilance, pas encore maladie  
✅ **Prise en charge adaptée** : Mesures hygiéno-diététiques prioritaires  
✅ **Pas de médicament** : Sauf cas particuliers  
✅ **Surveillance mensuelle** : Recommandation intégrée  
✅ **Messages éducatifs** : Explication rassurante et motivante  

### Impact pour les patients

- 🧠 **Compréhension** : Distinction claire entre pré-hypertension et hypertension
- 💪 **Motivation** : Signal d'alerte pour agir sur le mode de vie
- 🎯 **Action concrète** : Plan en 5 étapes pour prévenir l'hypertension
- 📊 **Suivi** : Surveillance régulière pour mesurer les progrès

---

**T-Cardio intègre parfaitement la pré-hypertension selon les standards OMS/ISH !** 🔶✨

La pré-hypertension = **120-139/80-89 mmHg** = **Zone de vigilance**, pas encore une maladie, mais un avertissement pour agir !
