import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CompanySettings } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';
import { HiniLogo } from './HiniLogo';
import {
  Settings,
  Building,
  CreditCard,
  Phone,
  Mail,
  FileCheck,
  Download,
  Upload,
  RotateCcw,
  Save,
  Check,
  Share2,
  Copy,
  Smartphone,
  Key,
  Globe,
  Cloud,
  Palette,
  ShieldCheck,
  Lock,
  ExternalLink,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  RefreshCw,
  Eye,
  Sparkles,
} from 'lucide-react';

export const CompanySettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportBackupJson,
    importBackupJson,
    resetAllData,
    showToast,
    userRole,
    setUserRole,
    authCredentials,
    updateAuthCredentials,
  } = useApp();

  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Logo upload state
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Sync formData with settings when updated globally
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Security Credentials state
  const [commercialPass, setCommercialPass] = useState(authCredentials.commercialPasscode);
  const [adminPass, setAdminPass] = useState(authCredentials.adminPasscode);

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      : 'https://ais-pre-jmynd2cl7cb5pjhh4ulsgx-247394849695.europe-west3.run.app/';

  const commercialUrl = `${baseUrl}?mode=commercial`;
  const adminUrl = `${baseUrl}?mode=admin`;

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(id);
      showToast('Lien copié dans le presse-papier !', 'success');
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      showToast('Copie impossible', 'error');
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercialPass.trim() || !adminPass.trim()) {
      showToast('Les codes d\'accès ne peuvent pas être vides.', 'error');
      return;
    }
    updateAuthCredentials({
      commercialPasscode: commercialPass.trim(),
      adminPasscode: adminPass.trim(),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackupJson(content);
        setFileInputKey(Date.now());
      }
    };
    reader.readAsText(file);
  };

  // --- Dynamic Logo Upload Logic ---
  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Format non supporté. Veuillez sélectionner une image (PNG, SVG, JPG, WebP).', 'error');
      return;
    }

    // Special handling for SVG vector files
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const svgContent = ev.target?.result as string;
        if (svgContent) {
          setFormData((prev) => ({ ...prev, logoUrl: svgContent }));
          updateSettings({ logoUrl: svgContent });
          showToast('Logo vectoriel SVG importé et appliqué sur toute l\'application !', 'success');
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // Raster images (PNG, JPG, WebP): clean scaling & compression to avoid local storage overflow
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const mime = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
          const optimizedDataUrl = canvas.toDataURL(mime, 0.92);
          setFormData((prev) => ({ ...prev, logoUrl: optimizedDataUrl }));
          updateSettings({ logoUrl: optimizedDataUrl });
          showToast('Logo d\'entreprise mis à jour avec succès sur l\'application et les factures !', 'success');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
      e.target.value = '';
    }
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleResetLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: undefined }));
    updateSettings({ logoUrl: undefined });
    showToast('Logo officiel HINI Make Your Mark rétabli.', 'info');
  };

  const handleDownloadActiveLogo = () => {
    const url = formData.logoUrl || '/logo-hini-official.svg';
    const link = document.createElement('a');
    link.href = url;
    link.download = formData.logoUrl ? 'logo-entreprise.png' : 'logo-hini-official.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Téléchargement du logo en cours...', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Paramètres Officiels de l'Entreprise
          </h1>
          <p className="text-xs text-slate-400">
            Coordonnées légales, mentions de paiement et sauvegarde des données
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* --- SECTION DÉDIÉE : UPLOAD DYNAMIQUE DU LOGO (ADMIN) --- */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Logo Officiel & Identité Visuelle de l'Entreprise
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Remplacement en 1 clic : se répercute instantanément dans l'en-tête, la barre latérale, l'écran de connexion et sur toutes les factures/proformas.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {formData.logoUrl ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Logo Personnalisé Actif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Logo Officiel HINI Make Your Mark
                </span>
              )}
            </div>
          </div>

          {/* Double visual preview: Document Header vs Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Aperçu En-tête de Document (Factures & Proformas) */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-blue-600" />
                  Aperçu Facture & Proforma (Impression A4)
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  En-tête officiel
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-2">
                <div className="shrink-0 max-w-[200px]">
                  <HiniLogo
                    variant="full"
                    size="md"
                    customLogoUrl={formData.logoUrl}
                  />
                </div>
                <div className="text-right text-[11px] text-slate-500 leading-tight">
                  <div className="font-bold text-slate-900 text-xs">{formData.name || 'HINI MADAGASCAR'}</div>
                  <div className="text-[10px] text-slate-400 italic">"Make Your Mark."</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{formData.nif || 'NIF 4004948777'}</div>
                </div>
              </div>
            </div>

            {/* 2. Aperçu Navigation Bar & Menu */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-400" />
                  Aperçu Menu & Barre Latérale
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  Cartouche Blanc
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 py-2">
                <HiniLogo
                  variant="badge"
                  size="sm"
                  customLogoUrl={formData.logoUrl}
                />
                <div className="text-right text-[11px] text-slate-400">
                  <div className="text-slate-200 font-semibold text-xs">Navigation Système</div>
                  <div className="text-[10px] text-slate-500">Rendu adaptatif haute résolution</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingLogo(true);
            }}
            onDragLeave={() => setIsDraggingLogo(false)}
            onDrop={handleLogoDrop}
            onClick={() => logoInputRef.current?.click()}
            className={`p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 select-none ${
              isDraggingLogo
                ? 'border-blue-500 bg-blue-950/40 scale-[1.01]'
                : 'border-slate-700 bg-slate-950/60 hover:bg-slate-800/40 hover:border-slate-600'
            }`}
          >
            <input
              type="file"
              ref={logoInputRef}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleLogoFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-200">
                Glissez-déposez ici votre nouveau logo d'entreprise
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                ou <span className="text-blue-400 underline font-semibold">cliquez pour parcourir vos fichiers</span> (PNG avec transparence, SVG, JPG, WebP)
              </div>
            </div>

            <div className="text-[10px] text-slate-400 max-w-md bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
              Astuce : Pour un résultat optimal à l'impression des factures et proformas, privilégiez un format vectoriel SVG ou un fichier PNG sur fond transparent.
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Télécharger un logo
              </button>

              <button
                type="button"
                onClick={handleDownloadActiveLogo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Télécharger le logo actif
              </button>
            </div>

            {formData.logoUrl && (
              <button
                type="button"
                onClick={handleResetLogo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-rose-800/60"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                Rétablir le logo officiel HINI
              </button>
            )}
          </div>
        </div>

        {/* Identité & Coordonnées légales */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" />
            Identité Commerciale & Fiscalité
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nom officiel de l'entreprise *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Slogan commercial *
              </label>
              <input
                type="text"
                required
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 italic"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Lieu d'émission par défaut
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                NIF (Numéro d'Identification Fiscale) *
              </label>
              <input
                type="text"
                required
                value={formData.nif}
                onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                className="w-full font-mono px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                CIS N° *
              </label>
              <input
                type="text"
                required
                value={formData.cis}
                onChange={(e) => setFormData({ ...formData, cis: e.target.value })}
                className="w-full font-mono px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                STAT (Numéro Statistique) *
              </label>
              <input
                type="text"
                required
                value={formData.stat}
                onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                className="w-full font-mono px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contacts & Signatures */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            Contacts & Signataire
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                GSM Officiel *
              </label>
              <input
                type="text"
                required
                value={formData.gsm}
                onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Email Officiel *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nom du signataire (Cachet & Prestataire)
              </label>
              <input
                type="text"
                value={formData.prestataireSignatory}
                onChange={(e) =>
                  setFormData({ ...formData, prestataireSignatory: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Titre / Fonction du signataire
              </label>
              <input
                type="text"
                value={formData.prestataireTitle}
                onChange={(e) =>
                  setFormData({ ...formData, prestataireTitle: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Modalités de paiement */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            Modalités et Coordonnées Bancaires
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Ordre pour les chèques *
              </label>
              <input
                type="text"
                required
                value={formData.chequeOrder}
                onChange={(e) => setFormData({ ...formData, chequeOrder: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                RIB Bancaire officiel pour virement *
              </label>
              <input
                type="text"
                required
                value={formData.bankRib}
                onChange={(e) => setFormData({ ...formData, bankRib: e.target.value })}
                className="w-full font-mono px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Conditions de règlement par défaut *
              </label>
              <input
                type="text"
                required
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-blue-500 text-rose-400 font-semibold"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Enregistrer les Paramètres Officiels
            </button>
          </div>
        </div>
      </form>

      {/* Sauvegarde & Données */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-400" />
          Sauvegarde & Portabilité des Données
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          Toutes vos données (clients, catalogue produits, factures et proformas) sont sauvegardées
          automatiquement et de manière persistante dans le stockage local de votre navigateur.
          Vous pouvez également exporter un fichier de sauvegarde JSON pour sécuriser vos données
          ou les transférer vers un autre ordinateur.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportBackupJson}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            Exporter la Sauvegarde (JSON)
          </button>

          {/* Import JSON */}
          <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            Restaurer depuis un fichier JSON
            <input
              key={fileInputKey}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Attention : Vous allez réinitialiser toutes les données aux valeurs par défaut de HINI MADAGASCAR. Continuer ?'
                )
              ) {
                resetAllData();
              }
            }}
            className="px-4 py-2 bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-2 border border-rose-900/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser les données d'origine
          </button>
        </div>
      </div>

      {/* --- GESTION DES THÈMES & AFFICHAGE --- */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-400" />
            Gestion des Thèmes & Confort Visuel
          </h2>
          <span className="text-[11px] text-slate-400">
            3 modes d'affichage ergonomiques
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Choisissez l'environnement graphique le plus adapté à vos conditions de travail :
          le thème officiel HINI MADAGASCAR, le mode clair haute lisibilité pour le bureau, ou le mode sombre profond.
        </p>

        <ThemeSwitcher variant="cards" />
      </div>

      {/* --- SÉCURITÉ & CODES D'ACCÈS DES RÔLES --- */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Sécurisation & Codes d'Accès des Profils
          </h2>
          <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60">
            Réservé Direction
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Définissez les codes d'accès requis pour déverrouiller chaque profil sur l'écran de connexion.
          Les codes sont insensibles à la casse pour plus de confort lors de la saisie sur mobile.
        </p>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Commercial Passcode */}
            <div className="p-4 bg-slate-950 rounded-xl border border-blue-900/40 space-y-2">
              <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Code d'accès Commercial
                </span>
                <span className="text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded font-mono">
                  Ventes Terrain
                </span>
              </label>
              <input
                type="text"
                value={commercialPass}
                onChange={(e) => setCommercialPass(e.target.value)}
                placeholder="Ex: COMMERCIAL2026"
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg font-mono text-xs focus:ring-1 focus:ring-blue-500 uppercase"
              />
              <p className="text-[11px] text-slate-500">
                Donne accès à la création des proformas, factures, catalogue et fiches clients.
              </p>
            </div>

            {/* Admin Passcode */}
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/40 space-y-2">
              <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Code d'accès Administrateur
                </span>
                <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded font-mono">
                  Accès Total
                </span>
              </label>
              <input
                type="text"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Ex: ADMIN2026"
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg font-mono text-xs focus:ring-1 focus:ring-amber-500 uppercase"
              />
              <p className="text-[11px] text-slate-500">
                Donne accès à tous les paramètres fiscaux, coordonnées bancaires et gestion des données.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Mettre à jour les codes de sécurité
            </button>
          </div>
        </form>
      </div>

      {/* --- PERSONNALISATION DE L'URL & BRANDING DU DÉPLOIEMENT --- */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            URLs Personnalisées & Nom de Domaine Professionnel
          </h2>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
            HINI MADAGASCAR
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Pour un rendu professionnel et mémorisable auprès de vos clients et de vos équipes, voici les slugs d'URL optimisés recommandés pour le déploiement en production :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* URL Option 1 : SaaS moderne */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                  Recommandé SaaS
                </span>
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-mono text-xs font-bold text-slate-100 break-all">
                https://hini-facturation.app
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Court, moderne et facile à retenir pour vos commerciaux et clients.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyUrl('https://hini-facturation.app', 'hini-app')}
              className="w-full mt-3 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedUrl === 'hini-app' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copier l'URL
                </>
              )}
            </button>
          </div>

          {/* URL Option 2 : Domaine officiel .mg */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/40 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                  Officiel Madagascar
                </span>
                <Building className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="font-mono text-xs font-bold text-slate-100 break-all">
                https://facturation.hinimadagascar.mg
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sous-domaine institutionnel rattaché à l'extension officielle nationale .mg.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyUrl('https://facturation.hinimadagascar.mg', 'hini-mg')}
              className="w-full mt-3 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedUrl === 'hini-mg' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copier l'URL
                </>
              )}
            </button>
          </div>

          {/* URL Option 3 : Ultra-court mobile */}
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-900/40 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-950 px-2 py-0.5 rounded">
                  Format Mobile
                </span>
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="font-mono text-xs font-bold text-slate-100 break-all">
                https://hini.app/facture
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Lien ultra-court optimisé pour l'envoi rapide par SMS ou WhatsApp.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyUrl('https://hini.app/facture', 'hini-short')}
              className="w-full mt-3 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedUrl === 'hini-short' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copier l'URL
                </>
              )}
            </button>
          </div>
        </div>

        {/* DNS Configuration Guide Notice */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-sky-400" />
            Guide de Liaison DNS vers votre nom de domaine personnalisé :
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pour lier <code className="text-emerald-400 font-mono">hini-facturation.app</code> ou <code className="text-emerald-400 font-mono">facturation.hinimadagascar.mg</code>, ajoutez simplement un enregistrement DNS de type <strong className="text-slate-200">CNAME</strong> pointant vers le domaine hébergé (ou <strong className="text-slate-200">A Record</strong> fourni par le registrar). Le certificat de sécurité SSL/HTTPS est délivré automatiquement.
          </p>
        </div>
      </div>

      {/* Liens d'accès par rôle */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            Liens d'Accès Directs par Rôle
          </h2>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/60">
            Session Immédiate
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Partagez ces liens directs avec paramètres pré-configurés pour vos collaborateurs :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Commercial Link Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-950 text-blue-400 rounded-md border border-blue-800/60">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-200">
                  1. Lien Commercial (Terrain & Vente)
                </div>
              </div>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800/40">
                Mobile / Tablette
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pour créer des proformas et factures rapidement chez le client, avec catalogue et clients.
              Paramètres sensibles masqués.
            </p>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-blue-300 break-all select-all">
              {commercialUrl}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyUrl(commercialUrl, 'commercial')}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUrl === 'commercial' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" /> Lien Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copier le lien Commercial
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setUserRole('commercial')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Activer
              </button>
            </div>
          </div>

          {/* Admin Link Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-950 text-amber-400 rounded-md border border-amber-800/60">
                  <Key className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-200">
                  2. Lien Admin (Direction & Gestion)
                </div>
              </div>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                Accès Complet
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pour la direction : configuration légale (NIF/STAT/CIS), RIB bancaire, prix unitaires
              et sauvegardes globales.
            </p>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 break-all select-all">
              {adminUrl}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyUrl(adminUrl, 'admin')}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUrl === 'admin' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" /> Lien Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copier le lien Admin
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setUserRole('admin')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Activer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
