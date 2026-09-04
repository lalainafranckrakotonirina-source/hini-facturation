import React from 'react';
import {
  BookOpen,
  Printer,
  FileCheck,
  Package,
  Users,
  Settings,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const UserGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Box */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-blue-400">
          <Sparkles className="w-3.5 h-3.5" /> Guide d'Utilisation Officiel
        </div>
        <h1 className="text-2xl font-black tracking-tight font-serif text-slate-100">
          Application de Gestion & Facturation — HINI MADAGASCAR
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Outil sur mesure pour l'édition, le chiffrage et l'exportation immédiate
          de vos Factures Proformas et Factures Définitives en conformité avec
          la charte commerciale de HINI MADAGASCAR.
        </p>
      </div>

      {/* Guide Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Step 1: Invoicing */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="font-bold text-sm text-slate-100">
              Créer une Proforma ou une Facture
            </h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Cliquez sur <strong className="text-slate-200">« Nouveau document »</strong>. Choisissez le type :
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li><strong className="text-slate-300">Facture Proforma :</strong> pour les devis et propositions commerciales préalables.</li>
            <li><strong className="text-slate-300">Facture Définitive :</strong> pour les commandes validées et règlements.</li>
          </ul>
          <p className="text-slate-400 leading-relaxed">
            Sélectionnez le client (ou cliquez sur <em className="text-blue-400">+ Nouveau client</em> pour l'ajouter en 5 secondes).
            Ajoutez les articles : vous pouvez les sélectionner depuis le catalogue ou saisir
            directement une désignation sur mesure. Le montant total et la somme en toutes lettres
            se calculent automatiquement !
          </p>
        </div>

        {/* Step 2: Printing & PDF */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="font-bold text-sm text-slate-100">
              Impression & Export PDF Impeccable
            </h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            L'application applique une feuille de style d'impression A4 stricte :
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li><strong className="text-emerald-400">Nommage automatique du fichier PDF :</strong> le nom du fichier prend automatiquement le numéro exact du document avec conversion propre des barres obliques (ex: <code className="text-emerald-300 font-mono">020926_FP_20264901.pdf</code>).</li>
            <li>Tous les boutons, menus et éléments d'interface sont automatiquement masqués lors de l'impression.</li>
            <li>Le format A4 Portrait est calibré au millimètre avec en-tête officiel « HINI Make Your Mark » et cachet officiel avec signature manuscrite.</li>
            <li>
              <strong className="text-slate-200">Astuce pour l'export PDF :</strong> Dans la fenêtre d'impression,
              sélectionnez <em className="text-emerald-400">« Enregistrer au format PDF »</em> comme destination,
              et assurez-vous que l'option <em className="text-slate-300">« Graphismes d'arrière-plan »</em> est cochée
              pour conserver les couleurs et le cachet.
            </li>
          </ul>
        </div>

        {/* Step 3: Fast Proforma to Facture Conversion */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/60 flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="font-bold text-sm text-slate-100">
              Conversion Proforma vers Facture en 1 Clic
            </h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Lorsqu'un client confirme la commande de votre facture proforma, cliquez simplement sur l'icône
            flèche verte <strong className="text-emerald-400">« Convertir en Facture »</strong> dans la liste.
          </p>
          <p className="text-slate-400 leading-relaxed">
            L'application génère immédiatement la Facture Définitive correspondante avec un nouveau numéro
            officiel (type <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">FA</code>) tout en conservant l'historique de la proforma initiale.
          </p>
        </div>

        {/* Step 4: Catalog & Clients */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="font-bold text-sm text-slate-100">
              Gestion des Produits & Clients
            </h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Dans les onglets <strong className="text-slate-200">« Clients »</strong> et <strong className="text-slate-200">« Catalogue Produits »</strong> :
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Enregistrez vos prix unitaires en Ariary (Ar) avec descriptions techniques détaillées.</li>
            <li>Enregistrez les coordonnées de vos clients réguliers (adresse physique, téléphone, NIF, STAT).</li>
            <li>Modifiez les tarifs à tout moment en fonction de l'évolution des coûts de matière première.</li>
          </ul>
        </div>
      </div>

      {/* Persistence & Security Section */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4 text-xs">
        <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Rôles Multi-Utilisateurs & Liens d'Accès Sécurisés
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-blue-400 font-bold uppercase text-[10px] tracking-wider block">
              1. URL Commerciale (Terrain / Tablette)
            </span>
            <p className="text-[11px] leading-relaxed">
              Idéale pour les commerciaux en clientèle : chiffrage rapide, création de proformas, consultation du catalogue. Les paramètres légaux et bancaires sont protégés.
            </p>
            <code className="text-[10px] text-slate-300 block font-mono bg-slate-900 px-2 py-1 rounded">
              ?mode=commercial
            </code>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider block">
              2. URL Administrateur (Gestion & Direction)
            </span>
            <p className="text-[11px] leading-relaxed">
              Donne accès à la modification du RIB bancaire BNI, des mentions fiscales (NIF, STAT, CIS), des tarifs et à la sauvegarde/restauration JSON.
            </p>
            <code className="text-[10px] text-slate-300 block font-mono bg-slate-900 px-2 py-1 rounded">
              ?mode=admin
            </code>
          </div>
        </div>
      </div>

      {/* Persistence & Security Section */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4 text-xs">
        <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Sauvegarde, Confidentialité & Évolution Supabase
        </h2>
        <div className="space-y-2 text-slate-400 leading-relaxed">
          <p>
            <strong className="text-slate-200">Persistance locale automatique :</strong> Toutes vos saisies sont conservées
            dans le stockage sécurisé de votre navigateur web (LocalStorage). Vos données ne disparaissent
            pas lors du rafraîchissement ou de la fermeture du navigateur.
          </p>
          <p>
            <strong className="text-slate-200">Sauvegarde préventive (JSON) :</strong> Dans l'onglet <em className="text-blue-400">« Paramètres »</em>, vous
            pouvez à tout moment cliquer sur <em className="text-slate-200">« Exporter la Sauvegarde (JSON) »</em> pour télécharger
            une copie complète de votre base clients, produits et factures. Cela vous permet de restaurer
            l'intégralité de votre travail sur un nouvel ordinateur en quelques clics.
          </p>
          <p>
            <strong className="text-slate-200">Évolution vers Supabase / Cloud :</strong> La structure de données (schémas TypeScript
            <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded mx-1">Client</code>,
            <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded mx-1">Product</code>,
            <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded mx-1">Invoice</code>) a été conçue pour être
            directement mappable sur une base relationnelle PostgreSQL / Supabase si vous souhaitez
            centraliser les données entre plusieurs utilisateurs simultanés.
          </p>
        </div>
      </div>
    </div>
  );
};
