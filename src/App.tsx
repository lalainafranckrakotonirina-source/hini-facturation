import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { InvoicesList } from './components/InvoicesList';
import { InvoiceEditor } from './components/InvoiceEditor';
import { ClientsManager } from './components/ClientsManager';
import { ProductsManager } from './components/ProductsManager';
import { CompanySettingsView } from './components/CompanySettingsModal';
import { UserGuide } from './components/UserGuide';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { AccessDeploymentModal } from './components/AccessDeploymentModal';
import { HiniLogo } from './components/HiniLogo';
import { LoginScreen } from './components/LoginScreen';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Invoice, Client } from './types';
import {
  FileText,
  Plus,
  Users,
  Package,
  Settings,
  BookOpen,
  Menu,
  X,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Share2,
  Smartphone,
  Key,
  ShieldAlert,
  Globe,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    selectedInvoice,
    setSelectedInvoice,
    isEditingInvoice,
    setIsEditingInvoice,
    previewInvoice,
    setPreviewInvoice,
    settings,
    convertProformaToFacture,
    toasts,
    removeToast,
    userRole,
    setUserRole,
    isAuthenticated,
    currentUser,
    logout,
    login,
    authCredentials,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isAdminUnlockOpen, setIsAdminUnlockOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminUnlockError, setAdminUnlockError] = useState<string | null>(null);

  // If not authenticated, display login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminUnlockError(null);
    const result = login(adminPassInput, 'admin');
    if (result.success) {
      setIsAdminUnlockOpen(false);
      setAdminPassInput('');
      setActiveTab('settings');
    } else {
      setAdminUnlockError(result.error || "Code administrateur incorrect.");
    }
  };

  // Navigate to invoice editor for new document
  const handleCreateNewInvoice = () => {
    setSelectedInvoice(null);
    setIsEditingInvoice(true);
    setActiveTab('new-invoice');
  };

  // Edit existing invoice
  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditingInvoice(true);
    setActiveTab('new-invoice');
  };

  // Close invoice editor and return to list
  const handleCloseEditor = () => {
    setSelectedInvoice(null);
    setIsEditingInvoice(false);
    setActiveTab('invoices');
  };

  // Quick action from client card
  const handleNewInvoiceForClient = (client: Client) => {
    setSelectedInvoice(null);
    setIsEditingInvoice(true);
    setActiveTab('new-invoice');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* --- DESKTOP SIDEBAR NAVIGATION (hidden when printing) --- */}
      <aside className="no-print hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col p-4 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="mb-4 px-2">
          <button
            onClick={() => {
              handleCloseEditor();
              setActiveTab('invoices');
            }}
            className="text-left group block w-full"
          >
            <div className="flex justify-center">
              <HiniLogo variant="badge" size="md" className="w-full justify-center" />
            </div>
            <p className="text-[11px] text-slate-400 italic mt-2 line-clamp-2 leading-relaxed text-center">
              {settings.slogan}
            </p>
          </button>
        </div>

        {/* Theme Switcher in Sidebar */}
        <div className="mb-3">
          <ThemeSwitcher variant="compact" className="w-full justify-between" />
        </div>

        {/* Mode Indicator & Switcher */}
        <div className="mb-4 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 pl-1">
            <div
              className={`w-2 h-2 rounded-full ${
                userRole === 'admin' ? 'bg-amber-400' : 'bg-blue-400'
              }`}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {userRole === 'admin' ? 'Mode Admin' : 'Mode Commercial'}
            </span>
          </div>
          <button
            onClick={() => {
              if (userRole === 'commercial') {
                setIsAdminUnlockOpen(true);
              } else {
                setUserRole('commercial');
              }
            }}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            title="Basculer de rôle"
          >
            Changer
          </button>
        </div>

        {/* Quick New Document Button */}
        <div className="mb-5">
          <button
            onClick={handleCreateNewInvoice}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nouveau Document
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1">
          <button
            onClick={() => {
              handleCloseEditor();
              setActiveTab('invoices');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-medium text-left ${
              activeTab === 'invoices' && !isEditingInvoice
                ? 'bg-slate-800 text-white border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }`}
          >
            <FileText
              className={`w-4 h-4 ${
                activeTab === 'invoices' && !isEditingInvoice ? 'text-blue-400' : 'text-slate-400'
              }`}
            />
            <span>Facturation & Proformas</span>
          </button>

          <button
            onClick={() => {
              handleCloseEditor();
              setActiveTab('clients');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-medium text-left ${
              activeTab === 'clients'
                ? 'bg-slate-800 text-white border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }`}
          >
            <Users
              className={`w-4 h-4 ${
                activeTab === 'clients' ? 'text-blue-400' : 'text-slate-400'
              }`}
            />
            <span>Clients</span>
          </button>

          <button
            onClick={() => {
              handleCloseEditor();
              setActiveTab('products');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-medium text-left ${
              activeTab === 'products'
                ? 'bg-slate-800 text-white border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }`}
          >
            <Package
              className={`w-4 h-4 ${
                activeTab === 'products' ? 'text-blue-400' : 'text-slate-400'
              }`}
            />
            <span>Catalogue Produits</span>
          </button>

          <button
            onClick={() => {
              handleCloseEditor();
              setActiveTab('settings');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-medium text-left ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-white border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }`}
          >
            <Settings
              className={`w-4 h-4 ${
                activeTab === 'settings' ? 'text-blue-400' : 'text-slate-400'
              }`}
            />
            <span>Paramètres</span>
          </button>

          <button
            onClick={() => {
              handleCloseEditor();
              setActiveTab('guide');
            }}
            className={`w-full flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-medium text-left ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-white border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
            }`}
          >
            <BookOpen
              className={`w-4 h-4 ${
                activeTab === 'guide' ? 'text-blue-400' : 'text-slate-400'
              }`}
            />
            <span>Guide d'Utilisation</span>
          </button>

          <button
            onClick={() => setIsAccessModalOpen(true)}
            className="w-full flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-medium text-left text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Accès & Déploiement</span>
          </button>
        </nav>

        {/* User Badge - Tailored to active role */}
        <div className="mt-auto p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              Session
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                userRole === 'admin'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                  : 'bg-blue-950 text-blue-300 border border-blue-800/50'
              }`}
            >
              {userRole === 'admin' ? 'Admin' : 'Commercial'}
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                userRole === 'admin' ? 'bg-amber-600' : 'bg-blue-600'
              }`}
            >
              {userRole === 'admin' ? 'RA' : 'CO'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {currentUser?.name || currentUser?.displayName || (userRole === 'admin'
                  ? settings.prestataireSignatory || 'Hasina Razafy'
                  : 'Équipe Ventes')}
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                {userRole === 'admin'
                  ? settings.prestataireTitle || 'Direction Générale'
                  : 'Commercial Terrain'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs">
            {userRole === 'commercial' ? (
              <button
                onClick={() => setIsAdminUnlockOpen(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                title="Déverrouiller le profil administrateur"
              >
                <Key className="w-3 h-3" />
                Déverrouiller Admin
              </button>
            ) : (
              <button
                onClick={() => setUserRole('commercial')}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                title="Passer en mode commercial restreint"
              >
                <Smartphone className="w-3 h-3" />
                Mode Ventes
              </button>
            )}

            <button
              onClick={logout}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium transition-colors cursor-pointer ml-auto"
              title="Déconnexion sécurisée"
            >
              <LogOut className="w-3 h-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE TOPBAR (hidden when printing) --- */}
      <header className="no-print md:hidden bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiniLogo variant="badge" size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher variant="compact" />

            <button
              onClick={() => setIsAccessModalOpen(true)}
              className="p-2 bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg text-xs font-semibold"
              title="Accès & Déploiement"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCreateNewInvoice}
              className="p-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              title="Nouveau document"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1.5">
            {/* Quick Role Switch in Mobile Menu */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-300">
                Mode : {userRole === 'admin' ? 'Administrateur' : 'Commercial'}
              </span>
              {userRole === 'commercial' ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminUnlockOpen(true);
                  }}
                  className="text-[11px] font-bold text-amber-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1"
                >
                  <Key className="w-3 h-3" /> Déverrouiller Admin
                </button>
              ) : (
                <button
                  onClick={() => setUserRole('commercial')}
                  className="text-[11px] font-bold text-blue-400 bg-slate-900 px-2 py-1 rounded border border-slate-800"
                >
                  Passer Commercial
                </button>
              )}
            </div>

            <button
              onClick={() => {
                handleCloseEditor();
                setActiveTab('invoices');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                activeTab === 'invoices' && !isEditingInvoice
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Facturation & Proformas
            </button>

            <button
              onClick={() => {
                handleCloseEditor();
                setActiveTab('clients');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                activeTab === 'clients'
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              Clients
            </button>

            <button
              onClick={() => {
                handleCloseEditor();
                setActiveTab('products');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                activeTab === 'products'
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4 text-blue-400" />
              Catalogue Produits
            </button>

            <button
              onClick={() => {
                handleCloseEditor();
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                activeTab === 'settings'
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4 text-blue-400" />
              Paramètres
            </button>

            <button
              onClick={() => {
                handleCloseEditor();
                setActiveTab('guide');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                activeTab === 'guide'
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              Guide d'Utilisation
            </button>

            <button
              onClick={() => {
                setIsAccessModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-slate-400 hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              Accès & Déploiement
            </button>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-rose-400 hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion ({currentUser?.name || 'Session'})
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- MAIN BODY CONTENT --- */}
      <main className="flex-1 bg-slate-950 min-h-screen overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* Commercial Mode Banner */}
          {userRole === 'commercial' && (
            <div className="no-print mb-5 bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-blue-900/60 text-blue-300 rounded-lg border border-blue-700/50">
                  <Smartphone className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold text-slate-100">Mode Commercial (Ventes Terrain)</span> :
                  Saisie rapide des devis & proformas. Paramètres d'entreprise et coordonnées bancaires protégés.
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsAccessModalOpen(true)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-800/60 rounded-md font-semibold text-[11px] cursor-pointer"
                >
                  Liens d'accès
                </button>
                <button
                  onClick={() => setIsAdminUnlockOpen(true)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-md font-semibold text-[11px] cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3 h-3" />
                  Déverrouiller Admin
                </button>
              </div>
            </div>
          )}

          {/* Editor View */}
          {isEditingInvoice ? (
            <InvoiceEditor
              initialInvoice={selectedInvoice}
              onClose={handleCloseEditor}
            />
          ) : (
            <>
              {activeTab === 'invoices' && (
                <InvoicesList
                  onCreateNew={handleCreateNewInvoice}
                  onEdit={handleEditInvoice}
                  onView={(invoice) => setPreviewInvoice(invoice)}
                />
              )}

              {activeTab === 'clients' && (
                <ClientsManager onNewInvoiceForClient={handleNewInvoiceForClient} />
              )}

              {activeTab === 'products' && <ProductsManager />}

              {activeTab === 'settings' && (
                userRole === 'commercial' ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4 my-8">
                    <div className="w-12 h-12 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center mx-auto">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Paramètres Réservés à la Direction
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      La modification des mentions fiscales (NIF, STAT, CIS), des coordonnées bancaires
                      (RIB BNI Madagascar), des thèmes et des clés de sécurité est réservée au profil Administrateur.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => setActiveTab('invoices')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Retour aux Factures
                      </button>
                      <button
                        onClick={() => setIsAdminUnlockOpen(true)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-2"
                      >
                        <Key className="w-3.5 h-3.5" />
                        Déverrouiller en Mode Admin
                      </button>
                    </div>
                  </div>
                ) : (
                  <CompanySettingsView />
                )
              )}

              {activeTab === 'guide' && <UserGuide />}
            </>
          )}
        </div>
      </main>

      {/* --- MODAL ADMIN UNLOCK --- */}
      {isAdminUnlockOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Déverrouillage Administrateur
                  </h3>
                  <p className="text-xs text-slate-400">
                    Accès complet aux paramètres et configurations
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdminUnlockOpen(false);
                  setAdminUnlockError(null);
                  setAdminPassInput('');
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminUnlock} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Code d'accès Administrateur
                </label>
                <div className="relative">
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    value={adminPassInput}
                    onChange={(e) => {
                      setAdminPassInput(e.target.value);
                      if (adminUnlockError) setAdminUnlockError(null);
                    }}
                    placeholder="Entrez le code secret..."
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {adminUnlockError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{adminUnlockError}</span>
                </div>
              )}

              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <span>Code par défaut :</span>
                <button
                  type="button"
                  onClick={() => setAdminPassInput(authCredentials.adminPasscode)}
                  className="font-mono text-amber-400 hover:underline font-bold"
                >
                  {authCredentials.adminPasscode} (Remplir)
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminUnlockOpen(false);
                    setAdminUnlockError(null);
                    setAdminPassInput('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-amber-900/20"
                >
                  Déverrouiller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL PREVIEW & PRINT --- */}
      {previewInvoice && (
        <DocumentPreviewModal
          invoice={previewInvoice}
          settings={settings}
          onClose={() => setPreviewInvoice(null)}
          onEdit={(invoice) => {
            setPreviewInvoice(null);
            handleEditInvoice(invoice);
          }}
          onConvert={(invoiceId) => {
            convertProformaToFacture(invoiceId);
          }}
        />
      )}

      {/* --- MODAL DEPLOYMENT & ACCESS LINKS --- */}
      <AccessDeploymentModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />

      {/* --- TOAST NOTIFICATIONS --- */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-xl border text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800/80 backdrop-blur-sm'
                : toast.type === 'info'
                ? 'bg-slate-900/90 text-sky-200 border-slate-700/80 backdrop-blur-sm'
                : 'bg-slate-900/95 text-slate-100 border-slate-700/80 backdrop-blur-sm'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
