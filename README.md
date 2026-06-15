# Ymmo Web, Plateforme web moderne de gestion immobilière

Ymmo est une application web fullstack dédiée à la gestion et à la consultation de propriétés immobilières. Elle offre
une interface intuitive pour les utilisateurs, les agents et les administrateurs.

## Fonctionnalités

### Pour les utilisateurs

- **Authentification sécurisée** - Système de login/signup avec tokens JWT
- **Consultation de propriétés** - Parcourir et visualiser les annonces immobilières
- **Gestion de portefeuille** - Suivi des propriétés et transactions
- **Profil utilisateur** - Gestion du compte et des préférences

### Pour les agents et administrateurs

- **Tableau de bord analytique** - Statistiques et rapports détaillés
- **Panel d'administration** - Gestion des propriétés, utilisateurs et contenu
- **Outils de gestion** - Création et modification d'annonces

## Stack Technologique

- **Frontend Framework** : React 19.2
- **Bundler** : Vite 8
- **Routing** : React Router 7.17
- **Styling** : TailwindCSS 4.3
- **HTTP Client** : Axios 1.17
- **Code Quality** : ESLint 10
- **Build Tool** : Node.js & npm

## Prérequis

- Node.js (v16 ou plus)
- npm ou yarn

## Installation et démarrage

### 1. Cloner le projet

```bash
git clone <repository-url>
cd Ymmo_Web
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer un fichier `.env`

La forme des variables d'environnement à mettre se trouve dans le .env.example

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible à `http://localhost:5173`

## Scripts disponibles

| Commande          | Description                               |
|-------------------|-------------------------------------------|
| `npm run dev`     | Lance le serveur de développement Vite    |
| `npm run build`   | Compile l'application pour la production  |
| `npm run preview` | Prévisualise la build production en local |
| `npm run lint`    | Analyse le code avec ESLint               |

## Structure du projet

```
src/
├── api/                 # Appels API et clients HTTP
├── assets/             # Images, icônes et ressources
├── components/         # Composants réutilisables
│   └── layout/        # Composants de mise en page
├── context/           # Contextes React (AuthContext, etc.)
├── pages/             # Pages principales
│   ├── Auth/          # Authentification
│   ├── Home/          # Accueil et listing des propriétés
│   ├── PropertyDetail/ # Détail d'une propriété
│   ├── Profile/       # Profil utilisateur
│   ├── Wallet/        # Portefeuille/transactions
│   ├── Admin/         # Panel administrateur
│   └── Analytics/     # Tableau de bord analytique
├── main.jsx           # Point d'entrée
├── router.jsx         # Configuration du routage
├── index.css          # Styles globaux
└── App.css           # Styles de l'application
```

## Système d'authentification

L'application utilise un système d'authentification basé sur les tokens JWT :

- **AuthContext** : Gère l'état d'authentification global
- **Tokens** : Access token et refresh token stockés en mémoire
- **Routes protégées** : PrivateRoute pour les utilisateurs connectés, AdminRoute pour les administrateurs

## Docker

Un fichier `Dockerfile` est disponible pour containeriser l'application.

```bash
docker build -t ymmo-web .
docker run -p 5173:5173 ymmo-web
```

## Conventions de code

- Utilisation de **ESLint** pour la qualité du code
- **TailwindCSS** pour le styling (pas de CSS personnalisé si possible)
- **Composants fonctionnels** avec React Hooks
- **Nommage** : PascalCase pour les composants, camelCase pour les variables/fonctions

## Auteurs

- Léna RICARD
- Emma DE OLIVEIRA
- Noah CHARRIN--BOURRAT