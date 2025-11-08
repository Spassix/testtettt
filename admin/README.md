# Panel Admin - Mexicain59

Panel d'administration complet pour la gestion de la boutique en ligne.

## Accès

Ouvrir `admin/index.html` dans votre navigateur.

## Identifiants par défaut

Lors du premier lancement, un compte administrateur est automatiquement créé :
- **Nom d'utilisateur**: `admin`
- **Mot de passe**: `admin123`

**⚠️ IMPORTANT**: Changez le mot de passe après la première connexion!

## Fonctionnalités

### 1. Authentification
- Login/Logout sécurisé
- Hashage SHA-256 avec sel unique par utilisateur
- 3 rôles: `founder`, `chef`, `admin`
- Protection des comptes fondateurs

### 2. Dashboard
- Statistiques en temps réel
- Graphiques sparklines
- Bouton pour créer des données de test

### 3. Gestion des Produits
- Ajout/Modification/Suppression
- Catégories et Farms
- Prix et grammages multiples
- Upload de médias (images/vidéos)
- Mise en avant

### 4. Configuration Panier
- Modes de paiement
- Services (livraison, envoi, rencontre)
- Options d'envoi
- Créneaux horaires
- Image d'en-tête
- Frais de livraison
- URL de redirection

### 5. Codes Promo
- Création (pourcentage ou montant fixe)
- Activation/Désactivation
- Modification/Suppression

### 6. Banderole Défilante
- Texte personnalisable
- Activation/Désactivation

### 7. Écran de Chargement
- Configuration complète (couleurs, animation, médias)
- Upload de fond et logo

### 8. Catégories
- Gestion complète CRUD

### 9. Farms (Marques)
- Gestion complète CRUD

### 10. Réseaux Sociaux
- Ajout avec normalisation automatique des URLs
- Support: Instagram, TikTok, Snapchat, Telegram, WhatsApp

### 11. Typographie
- Sélection de police (10 Google Fonts)
- Police personnalisée
- Taille de base
- Aperçu en temps réel

### 12. Utilisateurs Admin
- Ajout/Modification/Suppression
- Gestion des rôles
- Protection des fondateurs

### 13. Mode Maintenance
- Activation/Désactivation
- Message personnalisé

### 14. Configuration Générale
- Informations boutique
- Image de fond
- Textes page d'accueil
- Sections page d'accueil (avec réordonnancement)
- Configuration backend API

## Backend API

Le panel peut se connecter à un backend via API REST:

### Endpoints attendus

- `GET /api/:key` - Récupération des données
- `PUT /api/:key` - Sauvegarde des données
- `POST /upload` - Upload de fichiers médias
- `GET /health` - Vérification de connexion (optionnel)

### Fichiers JSON gérés

- `products.json`
- `categories.json`
- `farms.json`
- `payments.json`
- `promos.json`
- `banner.json`
- `loadingscreen.json`
- `config.json`
- `socials.json`
- `maintenance.json`
- `typography.json`
- `cart_services.json`
- `cart_options.json`
- `cart_slots.json`
- `admin_users.json`

### Fallback localStorage

Si le backend n'est pas configuré ou indisponible, les données sont automatiquement sauvegardées dans le localStorage du navigateur.

## Sécurité

- Mots de passe hashés en SHA-256 avec sel unique
- Échappement HTML pour prévention XSS
- Protection des comptes fondateurs
- Permissions par rôle

## Navigation

- **Desktop**: Sidebar à gauche
- **Mobile**: Tabbar en bas + menu hamburger

## Support Formats Médias

- **Images**: JPG, PNG, WebP, GIF
- **Vidéos**: MP4, MOV, WebM, OGG, M4V
- **Limite**: 500 MB par fichier
- **Fallback**: DataURL si upload échoue

## Notifications

Système de notifications avec badge de compte non lues. Notifications de démo au premier lancement.

