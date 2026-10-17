# 🎓 ENSPD SHOP — Plateforme E-Commerce Officielle

Plateforme e-commerce moderne, ultra-rapide et responsive dédiée à la communauté universitaire de l'**École Nationale Supérieure Polytechnique de Douala (ENSPD)**.

Conçue avec **React (Vite) + Tailwind CSS** côté client et une **API REST modulaire en PHP + MySQL** avec intégration des passerelles de paiement mobile **MTN Mobile Money** et **Orange Money** (mode sandbox/simulation & live).

---

## 🚀 Fonctionnalités & Pages

1. **Accueil (`/`)** :
   - Hero banner dynamique aux couleurs du campus et de Polytechnique.
   - Micro-statistiques étudiantes (+1500 étudiants livrés, retrait gratuit au Campus de PK17).
   - Rayons par catégories avec compteurs d'articles.
   - Section **« Nouveautés »** et **« Meilleures ventes »**.
   - Bannière code promo interactif (`ENSPD2026` pour -10% immédiat).
   - Témoignages et avis réels d'étudiants (Génie Informatique, Prépa, Génie Mécanique).
   - Footer complet avec coordonnées du Campus de PK17 et hotline WhatsApp (+237 651 86 50 28).

2. **Connexion (`/login`)** :
   - Authentification sécurisée par email et mot de passe.
   - Bouton de test rapide avec compte démo étudiant (`etudiant@enspd.cm`).
   - Redirection automatique vers le panier ou le paiement direct si l'utilisateur avait sélectionné un article avant de se connecter.

3. **Inscription (`/register`)** :
   - Création de compte avec nom complet, email, numéro de téléphone, sélection de filière/département ENSPD, mot de passe et confirmation.
   - Validation en temps réel côté client et côté serveur.

4. **Produits (`/produits`)** :
   - Catégories filtrables dynamiques (Appareils électroniques, Friandises, Parfums, Accessoires).
   - **Barre de recherche interactive en temps réel** avec filtrage instantané sans rechargement.
   - Tri par prix croissant, décroissant, meilleure note ou nouveautés.
   - Carte produit avec deux boutons dédiés : **« Panier »** et **« Payer »**.
   - **Protection d'accès :** si l'utilisateur n'est pas connecté, le clic sur « Panier » ou « Payer » ne valide pas l'action mais le redirige vers la connexion/inscription avec message d'information.

5. **Panier (`/panier`)** :
   - Gestion des articles, ajustement des quantités (+/-) et suppression.
   - Calcul automatique du sous-total, application de code promotionnel étudiant.
   - Choix du mode de livraison : Retrait Foyer des Étudiants PK17 (0 FCFA) ou Livraison Résidence (500 FCFA).
   - Bouton d'action **« Passer au paiement »**.

6. **Paiement en Ligne (`/paiement`)** :
   - Récapitulatif détaillé de la commande en FCFA.
   - Sélection entre **MTN Mobile Money** (*126#) et **Orange Money** (#150#).
   - Détection automatique de l'opérateur en fonction des préfixes camerounais (67x, 68x, 69x, etc.).
   - Saisie du numéro et coordonnées de retrait au Campus de PK17.
   - **Simulation USSD interactive sur écran de smartphone** avec saisie du code PIN secret (Sandbox).
   - Écran de succès festif avec confettis, référence de transaction unique, impression de reçu et écran d'échec pour tester les cas d'erreur.

7. **Tableau de Bord & Audit des Activités (`/admin`)** :
   - Visualisation en temps réel :
     - 🔐 Qui s'est connecté (date/heure, nom, email, département)
     - 👤 Qui a créé un nouveau compte étudiant
     - 🛒 Qui a mis quoi dans son panier (avec nom du produit, prix, quantité)
     - 📦 Qui a commandé quoi (détail complet des articles et lieu de livraison)
     - 💳 Qui a payé quel montant par MTN MoMo ou Orange Money (avec référence de transaction)
   - Recherche instantanée et export JSON des logs d'audit.

---

## 📂 Structure du Projet

```
ENSPD SHOP/
├── backend/
│   ├── config/
│   │   ├── database.php            # Connexion PDO à MySQL
│   │   ├── cors.php                # Gestion des entêtes CORS
│   │   └── payment_gateways.php    # Config MTN MoMo & Orange Money
│   ├── models/
│   │   ├── Database.php            # Singleton PDO
│   │   ├── User.php                # Requêtes préparées Utilisateur
│   │   ├── Product.php             # Requêtes préparées Produits & Catégories
│   │   ├── Order.php               # Transactions commandes & stock
│   │   └── Payment.php             # Enregistrement & audit transactions
│   ├── controllers/
│   │   ├── AuthController.php      # Hachage BCRYPT & sessions
│   │   ├── ProductController.php   # Logique catalogue & filtres
│   │   ├── OrderController.php     # Validation & calculs commandes
│   │   └── PaymentController.php   # Moteur Sandbox & Live MTN/Orange
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.php
│   │   │   └── register.php
│   │   ├── products/
│   │   │   ├── index.php
│   │   │   └── categories.php
│   │   ├── orders/
│   │   │   └── create.php
│   │   └── payments/
│   │       ├── process.php
│   │       └── verify.php
│   ├── sql/
│   │   └── schema.sql              # Schéma BDD & données initiales ENSPD
│   └── .htaccess                   # Protection & réécriture d'URL Apache
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # En-tête avec badge panier et menu mobile
│   │   │   ├── Footer.jsx          # Pied de page institutionnel
│   │   │   ├── ProductCard.jsx     # Carte avec boutons « Panier » et « Payer »
│   │   │   ├── NotificationToast.jsx # Alertes flottantes
│   │   │   └── USSDPromptModal.jsx # Modale interactive de validation PIN USSD
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # État d'authentification
│   │   │   └── CartContext.jsx     # Gestion du panier et promos
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Accueil
│   │   │   ├── Products.jsx        # Catalogue filtrable en temps réel
│   │   │   ├── Cart.jsx            # Panier
│   │   │   ├── Checkout.jsx        # Paiement MTN MoMo & Orange Money
│   │   │   ├── Login.jsx           # Connexion
│   │   │   └── Register.jsx        # Inscription
│   │   ├── services/
│   │   │   └── api.js              # Couche API avec résilience Sandbox
│   │   ├── data/
│   │   │   └── mockData.js         # Données campus ENSPD
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🛠️ Instructions de Lancement en Local

### Prérequis
- **Node.js** (v18+) et **npm**
- **PHP** (v7.4 ou v8.x) avec extension `pdo_mysql` et `curl`
- **MySQL** / MariaDB (via XAMPP, WAMP, Laragon ou MySQL autonome)

---

### Étape 1 : Importer la Base de Données MySQL

1. Lancez **XAMPP** ou votre serveur MySQL et ouvrez **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Créez une nouvelle base de données nommée `enspd_shop` (encodage `utf8mb4_unicode_ci`).
3. Cliquez sur l'onglet **Importer** et sélectionnez le fichier :
```
d:/ENSPD SHOP/backend/sql/schema.sql
```
4. Cliquez sur **Exécuter**. Toutes les tables (`utilisateurs`, `categories`, `produits`, `commandes`, `lignes_commande`, `paiements`) et les données de test sont automatiquement créées !

---

### Étape 2 : Lancer le Backend PHP

#### Option A (Recommandée avec le serveur intégré PHP) :
Ouvrez un terminal dans le dossier du projet et exécutez :
```bash
cd "d:\ENSPD SHOP\backend"
php -S localhost:8000
```
L'API REST est accessible sur `http://localhost:8000/api`.

#### Option B (Avec XAMPP / WAMP) :
Copiez ou créez un lien symbolique du dossier `ENSPD SHOP` dans votre dossier `htdocs` (ex: `C:\xampp\htdocs\ENSPD_SHOP`).
L'API sera accessible sur `http://localhost/ENSPD_SHOP/backend/api`.

---

### Étape 3 : Lancer le Front-end React

Ouvrez un terminal dans le dossier `frontend` :
```bash
cd "d:\ENSPD SHOP\frontend"
npm install
npm run dev
```
Ouvrez votre navigateur sur l'adresse indiquée par Vite (généralement **`http://localhost:5173`**).

> **Note de résilience :** Le front-end dispose d'une détection automatique. Si vous testez l'interface avant de démarrer MySQL/PHP, le mode Sandbox local s'active automatiquement sans aucune erreur !

---

## 💳 Mode Test & Simulation Mobile Money (Sandbox)

- **MTN Mobile Money** : Sélectionnez MTN, entrez un numéro camerounais (ex: `677123456`). Cliquez sur Payer. Une invite USSD interactive s'affiche à l'écran. Tapez un code PIN fictif (ex: `1234`) pour valider !
- **Orange Money** : Sélectionnez Orange, entrez un numéro Orange (ex: `699887766`). Validez l'invite USSD.
- **Simuler un échec (Solde insuffisant)** : Entrez un numéro se terminant par `000` (ex: `677000000`), le système simulera un rejet pour solde insuffisant.

---

## 🔑 Comptes de Test Pré-configurés

| Profil | Email | Mot de Passe | Rôle |
|---|---|---|---|
| **Étudiant Polytech** | `etudiant@enspd.cm` | `Polytech2026!` | Client Étudiant |
| **Administrateur** | `admin@enspd.cm` | `AdminPolytech2026!` | Gestionnaire Campus |

---

## 🌐 Déploiement en Ligne (Mise en Production)

### 1. Hébergement Web Mutualisé / cPanel / Hostinger
1. **Base de données** : Créez une base MySQL sur cPanel, puis importez `schema.sql`.
2. **Backend PHP** : Téléversez le contenu du dossier `backend/` dans un sous-dossier de `public_html` (ou sous-domaine `api.enspd-shop.cm`).
   - Mettez à jour vos identifiants dans `backend/config/database.php`.
   - Passez `'sandbox_mode' => false` dans `backend/config/payment_gateways.php` une fois vos clés de production MTN/Orange obtenues.
3. **Frontend React** :
   - Exécutez `npm run build` dans `frontend/`.
   - Téléversez les fichiers générés dans `frontend/dist/` à la racine de votre domaine.

### 2. Déploiement Cloud (Vercel / Netlify + Render / VPS)
- **Frontend** : Connectez votre dépôt GitHub à **Vercel** ou **Netlify**, Build Command: `npm run build`, Output Directory: `dist`.
- **Backend API** : Déployez le dossier `backend` sur un VPS Apache/Nginx ou un service PHP (Render/Heroku/Railway).
