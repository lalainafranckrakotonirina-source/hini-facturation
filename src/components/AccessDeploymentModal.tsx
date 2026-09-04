import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  ShieldAlert,
  Globe,
  Cloud,
  ArrowRight,
  Sparkles,
  Layers,
  Key,
  Download,
  ExternalLink,
} from 'lucide-react';

interface AccessDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessDeploymentModal: React.FC<AccessDeploymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userRole, setUserRole, showToast } = useApp();
  const [copiedRole, setCopiedRole] = useState<'commercial' | 'admin' | null>(null);

  if (!isOpen) return null;

  // Compute live URLs
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      : 'https://ais-pre-jmynd2cl7cb5pjhh4ulsgx-247394849695.europe-west3.run.app/';

  const commercialUrl = `${baseUrl}?mode=commercial`;
  const adminUrl = `${baseUrl}?mode=admin`;

  const copyToClipboard = async (url: string, role: 'commercial' | 'admin') => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedRole(role);
      showToast(
        role === 'commercial'
          ? 'URL Commerciale copiée dans le presse-papier !'
          : 'URL Administrateur copiée dans le presse-papier !',
        'success'
      );
      setTimeout(() => setCopiedRole(null), 2500);
    } catch {
      // Fallback
      showToast('Impossible de copier automatiquement. Veuillez copier manuellement le lien.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-800 text-slate-100 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-950/70 border border-blue-800/60 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase text-blue-400 mb-1.5">
              <Share2 className="w-3 h-3" /> Déploiement & Accès Multi-Rôles
            </div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Liens d'Accès en Ligne — HINI MADAGASCAR
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Accédez directement à l'application avec des rôles pré-calibrés pour les commerciaux et la direction.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Mode Switcher */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                userRole === 'admin' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400 animate-pulse'
              }`}
            />
            <div>
              <div className="text-xs font-bold text-slate-200">
                Mode Actuel :{' '}
                <span
                  className={`font-mono uppercase ${
                    userRole === 'admin' ? 'text-amber-400' : 'text-blue-400'
                  }`}
                >
                  {userRole === 'admin' ? 'Administrateur / Gestion' : 'Commercial / Ventes'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {userRole === 'admin'
                  ? 'Contrôle total des devis, factures, tarifs, RIB, NIF/STAT et sauvegarde JSON.'
                  : 'Interface simplifiée et sécurisée pour les ventes et l’émission rapide sur mobile.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setUserRole('commercial')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                userRole === 'commercial'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                userRole === 'admin'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Administrateur
            </button>
          </div>
        </div>

        {/* The Two Distinct URLs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              1. URLs Dédiées & Codes de Sécurité
            </h3>
            <span className="text-[11px] text-slate-400">
              Slugs recommandés : <code className="text-emerald-400 font-mono">hini-facturation.app</code>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Commercial URL */}
            <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/40 hover:border-blue-700/60 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-950 rounded-lg text-blue-400 border border-blue-800/50">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-100">
                      URL Commercial (Ventes)
                    </span>
                  </div>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded-full font-mono">
                    Code : COMMERCIAL2026
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Idéal pour les commerciaux sur <strong>smartphone ou tablette</strong>. Accès direct pour
                  saisir les proformas chez les clients, consulter les prix en Ariary et enregistrer des
                  prospects sans risque d'altérer les paramètres bancaires ou fiscaux de la société.
                </p>

                <div className="mt-3 bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-blue-300 break-all select-all">
                  {commercialUrl}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(commercialUrl, 'commercial')}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedRole === 'commercial' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copier l'URL Commercial
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setUserRole('commercial');
                    onClose();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  title="Basculer vers le mode commercial"
                >
                  Activer
                </button>
              </div>
            </div>

            {/* 2. Admin URL */}
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/40 hover:border-amber-700/60 transition-all flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-950 rounded-lg text-amber-400 border border-amber-800/50">
                      <Key className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-100">
                      URL Admin (Direction)
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-full font-mono">
                    Code : ADMIN2026
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Accès complet pour la <strong>Direction Générale et la Comptabilité</strong>.
                  Configuration des coordonnées légales (NIF, STAT, CIS), du compte bancaire (RIB BNI),
                  modification des prix du catalogue, et sauvegarde/restauration complète JSON.
                </p>

                <div className="mt-3 bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 break-all select-all">
                  {adminUrl}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => copyToClipboard(adminUrl, 'admin')}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedRole === 'admin' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copier l'URL Admin
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    onClose();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  title="Basculer vers le mode administrateur"
                >
                  Activer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Steps Summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-400" />
            2. Hébergement & Déploiement Instantané
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                Déployé en Ligne
              </div>
              <p className="text-slate-400">
                L'application est active sur Google Cloud Run avec certificat SSL HTTPS automatique.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3 text-blue-400" />
                Vercel / Netlify
              </div>
              <p className="text-slate-400">
                Exportez le code en ZIP ou GitHub puis glissez-déposez sur Netlify ou connectez à Vercel en 1 clic.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Smartphone className="w-3 h-3 text-purple-400" />
                Mode Mobile PWA
              </div>
              <p className="text-slate-400">
                Ouvrez sur mobile et choisissez <em>« Ajouter à l'écran d'accueil »</em> pour l'utiliser comme une vraie appli.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
