# 📘 HINI MADAGASCAR — Application de Gestion & Facturation Officielle

> Solution sur mesure pour la création, l'édition, le chiffrage en Ariary (Ar) et l'exportation PDF/Impression immédiate de **Factures Proformas** et **Factures Définitives**, conforme à la charte commerciale et aux obligations fiscales de **HINI MADAGASCAR**.

---

## 🚀 1. LIENS D'ACCÈS EN LIGNE DIRECTS (Prêts à l'emploi)

L'application est **hébergée en ligne avec certificat SSL (HTTPS)** et accessible immédiatement depuis n'importe quel navigateur, ordinateur, tablette ou smartphone.

Deux modes d'accès distincts sont pré-configurés :

### 📱 1. Mode Utilisateur / Commercial (Ventes & Terrain)
* **URL Directe :**  
  👉 **`https://ais-pre-jmynd2cl7cb5pjhh4ulsgx-247394849695.europe-west3.run.app/?mode=commercial`**
* **Public cible :** Commerciaux en déplacement, chargés de clientèle, technico-commerciaux sur tablette/smartphone.
* **Fonctionnalités autorisées :**
  - Établissement et chiffrage rapide de Factures Proformas et devis chez le client.
  - Consultation immédiate du catalogue de produits et prestations avec prix en Ariary (Ar).
  - Création et gestion de la fiche client / prospect.
  - Calcul automatique des totaux et de la somme en toutes lettres.
  - Génération de documents avec cachet commercial et impression/PDF immédiat.
* **Sécurité & Protection :** Les paramètres financiers sensibles (NIF, STAT, CIS, coordonnées bancaires BNI, réinitialisation de la base) sont masqués pour éviter toute altération accidentelle.

---

### 🔑 2. Mode Administrateur / Gestion (Direction & Comptabilité)
* **URL Directe :**  
  👉 **`https://ais-pre-jmynd2cl7cb5pjhh4ulsgx-247394849695.europe-west3.run.app/?mode=admin`**
* **Public cible :** Direction Générale, Responsable Financier, Comptabilité.
* **Fonctionnalités complètes :**
  - **Gestion intégrale de la facturation :** Création, modification, validation des règlements, duplication et conversion instantanée Proforma ➔ Facture Définitive (avec attribution automatique du numéro `FA`).
  - **Configuration officielle de l'entreprise :** Mentions légales (NIF, STAT, CIS), RIB Bancaire (BNI Madagascar), ordre des chèques, coordonnées téléphoniques et signataire officiel.
  - **Catalogue & Tarification :** Ajout, modification des prix de revient et prix de vente de tous les articles.
  - **Sauvegarde & Portabilité :** Export d'une sauvegarde complète au format JSON et restauration sur un autre poste de travail.

> 💡 **Basculement instantané :** Dans l'application, un bouton dédié **« Accès & Déploiement »** ou le sélecteur de mode dans la barre latérale permet de basculer d'un mode à l'autre en un seul clic.

---

## 🏢 2. IDENTIFIANTS & CONFIGURATION PAR DÉFAUT

| Paramètre | Valeur Officielle Pré-remplie |
| :--- | :--- |
| **Raison Sociale** | **HINI MADAGASCAR** |
| **Slogan / Métier** | Sérigraphie — Impression numérique — Banderoles — Enseignes — PLV — Événementiel |
| **Adresse / Ville** | Antananarivo, Madagascar |
| **Téléphone GSM** | `+261 34 00 123 45` / `+261 32 00 123 45` |
| **Email Officiel** | `contact@hinimadagascar.mg` |
| **NIF (Numéro d'Identification Fiscale)** | `4001234567` |
| **STAT (Numéro Statistique)** | `74201 11 2018 0 10234` |
| **CIS (Centre d'Immatriculation)** | `N° 00234/18` |
| **Établissement Bancaire** | **BNI MADAGASCAR** |
| **RIB Officiel** | `00005 02000 12345678901 25` |
| **Ordre des Chèques** | **HINI MADAGASCAR** |
| **Conditions de règlement par défaut** | *50% à la commande, solde à la livraison* |
| **Signataire / Direction** | **Hasina Razafy**, Gérant & Direction Générale |

---

## 🛠️ 3. PROCÉDURES DE DÉPLOIEMENT EN 1 CLIC

### Option A : Utiliser le lien en direct (Recommandé - Aucun setup requis)
L'application est d'ores et déjà opérationnelle et hébergée sur **Google Cloud Run** sous l'URL partagée :  
`https://ais-pre-jmynd2cl7cb5pjhh4ulsgx-247394849695.europe-west3.run.app/`

---

### Option B : Déploiement en 1 Clic sur Vercel
1. Téléchargez le code source ou exportez-le vers votre compte GitHub (via le menu `Settings > Export to GitHub` dans AI Studio).
2. Rendez-vous sur [vercel.com](https://vercel.com) et connectez votre dépôt.
3. Les paramètres de build sont détectés automatiquement :
   - **Framework Preset :** `Vite`
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
4. Cliquez sur **Deploy**. Votre URL de production personnalisée (ex: `hini-facturation.vercel.app`) sera en ligne en 45 secondes.

---

### Option C : Déploiement en 1 Clic sur Netlify (Netlify Drop)
1. Téléchargez le ZIP du projet via AI Studio.
2. Décompressez et lancez `npm run build` dans le dossier, ou connectez directement le dépôt GitHub à [Netlify](https://www.netlify.com).
3. Sur [app.netlify.com/drop](https://app.netlify.com/drop), glissez-déposez simplement le dossier `dist/`.
4. L'application est immédiatement disponible avec un certificat HTTPS gratuit.

---

### Option D : Installation Mobile & Tablette (PWA / Application Écran d'accueil)
Pour les commerciaux sur le terrain :
1. Sur smartphone/tablette (Android via Chrome ou iPhone/iPad via Safari), ouvrez l'URL Commerciale :  
   `https://ais-pre-jmynd2cl7cb5pjhh4ulsgx-247394849695.europe-west3.run.app/?mode=commercial`
2. Cliquez sur le bouton de partage ou le menu du navigateur (les 3 points verticaux).
3. Sélectionnez **« Ajouter à l'écran d'accueil »** (ou *« Installer l'application »*).
4. Une icône **HINI MADAGASCAR** apparaît sur l'écran d'accueil. L'application s'ouvre alors en plein écran sans barre d'adresse, comme une application native.

---

## 💾 4. PERSISTANCE & SAUVEGARDE DES DONNÉES

1. **Sauvegarde locale automatique :**  
   Toutes les créations (clients, articles, devis et factures) sont enregistrées automatiquement en temps réel dans le `LocalStorage` de votre navigateur. Aucune perte de données lors du rechargement de page ou de la fermeture du navigateur.

2. **Export / Restauration de Sauvegarde (JSON) :**  
   - Accédez à l'onglet **« Paramètres »** (en Mode Administrateur).
   - Cliquez sur **« Exporter la Sauvegarde (JSON) »** pour télécharger un fichier contenant l'intégralité de vos données.
   - Sur un nouvel ordinateur, cliquez sur **« Restaurer depuis un fichier JSON »** pour réimporter instantanément toutes vos factures et clients.

3. **Évolution Cloud / Supabase :**  
   La structure des modèles TypeScript (`Invoice`, `Client`, `Product`) est standardisée et prête pour une synchronisation vers une base PostgreSQL / Supabase pour le travail multi-utilisateurs en temps réel si souhaité.

---

## 🖨️ 5. GUIDE D'IMPRESSION & EXPORT PDF OFFICIEL

Pour imprimer ou envoyer une facture par email au client :
1. Cliquez sur l'icône œil **« Voir le document »** ou le bouton **« Imprimer »** sur la facture ou proforma souhaitée.
2. Cliquez sur le bouton **« Imprimer / PDF »**.
3. **Nommage automatique du PDF :**
   - Le système pré-remplit et applique automatiquement comme nom de fichier le numéro exact de votre facture ou proforma en remplaçant les barres obliques par des tirets bas.
   - Exemple : pour la facture `020926/FP/20264901`, le fichier téléchargé portera exactement le nom **`020926_FP_20264901.pdf`**.
4. **Chartes et signatures officielles intégrées :**
   - En-tête officiel : visuel vectoriel officiel haute fidélité **« HINI Make Your Mark »** avec slogan de l'entreprise.
   - Section « Le Prestataire » : cachet ovale officiel **« HiNi Madagascar »** avec signature manuscrite à l'encre bleue.
5. Dans la boîte de dialogue d'impression :
   - **Destination :** Choisir votre imprimante papier ou *« Enregistrer au format PDF »*.
   - **Format :** A4 Portrait.
   - **Option recommandée :** Cochez la case **« Graphismes d'arrière-plan »** (ou *Background graphics*) pour conserver les couleurs de l'en-tête et le cachet d'entreprise.
6. L'aperçu d'impression passe automatiquement en **fond blanc papier immaculé** avec texte noir net et contrasté conforme aux normes d'administration d'entreprise malgaches.

---

*HINI MADAGASCAR — Solution de Facturation Professionnelle A4 & Gestion Commerciale.*
