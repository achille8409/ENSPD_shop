-- ============================================================
-- SCRIPT SQL : BASE DE DONNÉES ENSPD SHOP
-- Plateforme E-Commerce de l'École Nationale Supérieure Polytechnique de Douala
-- ============================================================

CREATE DATABASE IF NOT EXISTS `enspd_shop`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `enspd_shop`;

-- Désactiver les contraintes pour permettre le nettoyage de la base
SET FOREIGN_KEY_CHECKS = 0;

-- Nettoyage préalable des tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS `paiements`;
DROP TABLE IF EXISTS `lignes_commande`;
DROP TABLE IF EXISTS `commandes`;
DROP TABLE IF EXISTS `produits`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `utilisateurs`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABLE : utilisateurs
CREATE TABLE `utilisateurs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telephone` VARCHAR(30) NOT NULL,
  `departement` VARCHAR(100) DEFAULT 'Campus ENSPD',
  `mot_de_passe` VARCHAR(255) NOT NULL,
  `role` ENUM('etudiant', 'admin') DEFAULT 'etudiant',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLE : categories
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `icone` VARCHAR(50) DEFAULT 'Sparkles',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLE : produits
CREATE TABLE `produits` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `categorie_id` INT UNSIGNED NOT NULL,
  `nom` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `prix` INT UNSIGNED NOT NULL,
  `prix_original` INT UNSIGNED DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `badge` VARCHAR(50) DEFAULT NULL,
  `badge_color` VARCHAR(50) DEFAULT 'bg-indigo-600',
  `rating` DECIMAL(2,1) DEFAULT 4.8,
  `reviews_count` INT UNSIGNED DEFAULT 12,
  `stock` INT NOT NULL DEFAULT 50,
  `is_new` TINYINT(1) DEFAULT 0,
  `is_bestseller` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_produits_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  INDEX `idx_categorie` (`categorie_id`),
  INDEX `idx_nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLE : commandes
CREATE TABLE `commandes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code_commande` VARCHAR(50) NOT NULL UNIQUE,
  `utilisateur_id` INT UNSIGNED NULL,
  `nom_client` VARCHAR(150) NOT NULL,
  `email_client` VARCHAR(150) NULL,
  `telephone_client` VARCHAR(30) NOT NULL,
  `adresse_livraison` VARCHAR(255) NOT NULL,
  `notes` TEXT NULL,
  `total_fcfa` INT UNSIGNED NOT NULL,
  `frais_livraison` INT UNSIGNED DEFAULT 0,
  `code_promo` VARCHAR(50) NULL,
  `statut` ENUM('en_attente', 'payee', 'livree', 'annulee') DEFAULT 'en_attente',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_commandes_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL,
  INDEX `idx_code_commande` (`code_commande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLE : lignes_commande
CREATE TABLE `lignes_commande` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `commande_id` INT UNSIGNED NOT NULL,
  `produit_id` INT UNSIGNED NULL,
  `nom_produit` VARCHAR(200) NOT NULL,
  `prix_unitaire` INT UNSIGNED NOT NULL,
  `quantite` INT UNSIGNED NOT NULL DEFAULT 1,
  `sous_total` INT UNSIGNED NOT NULL,
  CONSTRAINT `fk_lignes_commande_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lignes_commande_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLE : paiements
CREATE TABLE `paiements` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `commande_id` INT UNSIGNED NOT NULL,
  `reference_transaction` VARCHAR(100) NOT NULL UNIQUE,
  `operateur` ENUM('mtn', 'orange') NOT NULL,
  `telephone_payeur` VARCHAR(30) NOT NULL,
  `montant_fcfa` INT UNSIGNED NOT NULL,
  `statut` ENUM('EN_ATTENTE', 'SUCCES', 'ECHEC') DEFAULT 'EN_ATTENTE',
  `code_reponse` VARCHAR(50) NULL,
  `raw_response` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_paiements_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  INDEX `idx_ref_trans` (`reference_transaction`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INSERTION DES DONNÉES INITIALES (SEEDS)
-- ============================================================

-- Catégories
INSERT INTO `categories` (`id`, `nom`, `slug`, `icone`) VALUES
(1, 'Appareils électroniques', 'electronique', 'Cpu'),
(2, 'Friandises & Snacks', 'friandises', 'Cookie'),
(3, 'Parfums & Soins', 'parfums', 'Flame'),
(4, 'Accessoires & Goodies', 'accessoires', 'ShoppingBag');

-- Utilisateurs de démonstration
-- Les mots de passe sont enregistrés au format bcrypt pour une démonstration sécurisée.
INSERT INTO `utilisateurs` (`id`, `nom`, `email`, `telephone`, `departement`, `mot_de_passe`, `role`) VALUES
(1, 'Étudiant Polytech Démo', 'etudiant@enspd.cm', '677123456', 'Génie Informatique & Télécoms', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oMha3vvC8/7t0ZB5JY3rM2G1E3rpy', 'etudiant'),
(2, 'Administrateur Boutique', 'admin@enspd.cm', '699001122', 'Administration ENSPD', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oMha3vvC8/7t0ZB5JY3rM2G1E3rpy', 'admin');

-- Produits réalistes ENSPD
INSERT INTO `produits` (`id`, `categorie_id`, `nom`, `description`, `prix`, `prix_original`, `image_url`, `badge`, `badge_color`, `rating`, `reviews_count`, `stock`, `is_new`, `is_bestseller`) VALUES
(1, 1, 'Calculatrice Casio FX-991CW ClassWiz', 'Calculatrice scientifique avancée recommandée par les professeurs de l''ENSPD pour les examens et concours d''ingénieurs.', 18500, 22000, 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80', 'Must-Have Prépas', 'bg-indigo-600', 4.9, 38, 45, 0, 1),
(2, 4, 'Hoodie Officiel ENSPD ''Polytech Spirit''', 'Coton lourd 320g, coupe oversize ultra stylée avec blason brodé ENSPD Douala. Chaud et résistant.', 14000, 16500, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 'Bestseller Campus', 'bg-amber-500', 5.0, 52, 30, 1, 1),
(3, 1, 'Power Bank Oraimo Toast 20000mAh 22.5W', 'Charge ultra-rapide USB-C + USB-A. Parfait pour vos longues journées de TP et sessions en amphi.', 13500, 15500, 'https://images.unsplash.com/photo-1609592426815-3852cb7ec55c?auto=format&fit=crop&w=800&q=80', 'Anti-Délestage', 'bg-emerald-600', 4.8, 29, 60, 0, 1),
(4, 3, 'Eau de Parfum ''Polytech Fresh'' Intense 50ml', 'Notes boisées, agrumes et ambre. Sillage longue tenue 24h pour briller en présentation et sur le campus.', 9500, 12000, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80', 'Nouveauté', 'bg-purple-600', 4.7, 19, 25, 1, 0),
(5, 1, 'Écouteurs Sans Fil Lenovo LP40 Pro TWS', 'Bluetooth 5.3, basses profondes, réduction de bruit passive pour réviser à la bibliothèque universitaire.', 8000, 10000, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', 'Top Vente', 'bg-cyan-600', 4.6, 44, 40, 0, 1),
(6, 2, 'Box Friandises Campus Energy Pack', 'Assortiment étudiant : chocolats Mambo noir, biscuits gourmands, chips de plantain artisanales et bonbons menthe.', 4500, 5500, 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80', 'Anti-Fatigue', 'bg-rose-500', 4.9, 61, 80, 1, 1),
(7, 4, 'Gourde Isotherme Inox 750ml Campus PK17', 'Garde votre eau fraîche pendant 24h sous la chaleur de Douala. Double paroi inox anti-fuite avec logo ENSPD.', 6500, 8000, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80', 'Écolo', 'bg-teal-600', 4.8, 22, 50, 0, 0),
(8, 1, 'Kit Starter Robotique Arduino Uno R3 ENSPD', 'Kit complet pour TP de Génie Électrique & Informatique : carte Uno R3, capteurs, servomoteur, écran LCD.', 24500, 28000, 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80', 'Projets Génie', 'bg-blue-700', 5.0, 31, 20, 1, 0),
(9, 3, 'Brume Parfumée ''Campus Glow'' Vanille & Coco 100ml', 'Senteur douce, sucrée et rafraîchissante. Idéale après les cours ou le sport universitaire.', 6000, 7500, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80', 'Tendances', 'bg-pink-500', 4.8, 27, 35, 1, 1),
(10, 1, 'Clé USB SanDisk Ultra Flair 64GB USB 3.0', 'Corps métallique ultra résistant. Indispensable pour vos codes sources, rapports de stage et logiciels.', 5500, 7000, 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80', 'Transfert 150MB/s', 'bg-slate-700', 4.7, 33, 75, 0, 0),
(11, 4, 'Sac à Dos Tech Antivol ENSPD avec Port USB', 'Compartiment PC 15.6 rembourré, tissu imperméable contre les pluies de Douala, fermeture éclair antivol.', 17500, 21000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 'Bestseller', 'bg-indigo-700', 4.9, 46, 25, 0, 1),
(12, 2, 'Lot Chocolats & Barres Protéinées Défi Examen', '6 barres riches en magnésium et cacao pour maintenir la concentration pendant les nuits de révision.', 3500, 4200, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80', 'Nouveau', 'bg-amber-600', 4.5, 18, 55, 1, 0);
