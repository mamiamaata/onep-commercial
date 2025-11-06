# 🚀 ONEP Commercial - Setup Guide

## 📋 Fichiers à télécharger

1. **index.html** - Page principale
2. **styles.css** - Styles CSS  
3. **script.js** - Logique principale
4. **firebase-config.js** - Configuration Firebase ⚠️
5. **README.md** - Ce guide

## 🔥 Configuration Firebase (ÉTAPE CRUCIALE)

### Étape 1: Créer un projet Firebase
1. Allez sur [https://firebase.google.com](https://firebase.google.com)
2. Cliquez sur "Commencer"
3. Créez un nouveau projet: `onep-commercial`
4. Notez l'**ID du projet**

### Étape 2: Activer Firestore Database
1. Dans Firebase Console → Build → Firestore Database
2. Cliquez "Create Database" 
3. Choisir "Start in test mode"
4. Choisir une location (europe-west1 pour Maroc)

### Étape 3: Activer Authentication
1. Dans Firebase Console → Build → Authentication  
2. Cliquez "Get started"
3. Allez dans "Sign-in method"
4. Activez "Email/Password"

### Étape 4: Obtenir la configuration
1. Dans Firebase Console → Project Settings (engrenage)
2. Descendez à "Your apps"
3. Cliquez "</>" pour ajouter une app web
4. Nom: "ONEP Commercial"
5. Copiez la configuration

### Étape 5: Mettre à jour firebase-config.js
**REMPLACEZ** les valeurs dans `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_CLE_API",
    authDomain: "VOTRE_PROJET.firebaseapp.com",
    projectId: "VOTRE_ID_PROJET",  // ⚠️ IMPORTANT
    storageBucket: "VOTRE_PROJET.appspot.com",
    messagingSenderId: "123456789",
    appId: "VOTRE_APP_ID"
};
