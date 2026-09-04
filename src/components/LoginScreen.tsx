import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { HiniLogo } from './HiniLogo';
import { ThemeSwitcher } from './ThemeSwitcher';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Briefcase,
  Key,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Smartphone,
  Globe,
  Info,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, settings, authCredentials } = useApp();

  // Selected profile to log into
  const [selectedRole, setSelectedRole] = useState<UserRole>('commercial');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = login(passcode, selectedRole);
    if (!result.success) {
      setErrorMessage(result.error || "Code d'accès incorrect");
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (role: UserRole) => {
    setSelectedRole(role);
    setPasscode(role === 'admin' ? authCredentials.adminPasscode : authCredentials.commercialPasscode);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* Top Bar with Theme Switcher and Secure Badge */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 py-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Portail d'Accès Sécurisé — République de Madagascar</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher variant="compact" />
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="w-full max-w-xl mx-auto my-auto z-10 py-6">
        <div className="bg-slate-900/95 border border-slate-800/90 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/60 backdrop-blur-md space-y-7 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Official Brand Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <HiniLogo variant="badge" size="xl" />
            </div>

            <div className="space-y-1 pt-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {settings.name || 'HINI MADAGASCAR'}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-blue-400">
                {settings.slogan || "Organisateur d'événementiel - Tous supports publicitaires"}
              </p>
              <p className="text-[11px] text-slate-400 italic">
                Application officielle de facturation & gestion commerciale
              </p>
            </div>
          </div>

          {/* Profile Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
              Sélectionnez votre profil d'accès
            </label>

            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Profil d'utilisateur">
              {/* Commercial Profile */}
              <button
                type="button"
                role="radio"
                aria-checked={selectedRole === 'commercial'}
                onClick={() => {
                  setSelectedRole('commercial');
                  setErrorMessage(null);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedRole === 'commercial'
                    ? 'bg-blue-950/60 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`p-1.5 rounded-lg ${
                        selectedRole === 'commercial'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        selectedRole === 'commercial'
                          ? 'bg-blue-900/80 text-blue-300 border border-blue-700/60'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      Ventes
                    </span>
                  </div>

                  <div className="font-bold text-xs sm:text-sm text-slate-100">
                    Commercial
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Saisie rapide proformas, devis, clients & catalogue.
                  </p>
                </div>
              </button>

              {/* Admin Profile */}
              <button
                type="button"
                role="radio"
                aria-checked={selectedRole === 'admin'}
                onClick={() => {
                  setSelectedRole('admin');
                  setErrorMessage(null);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedRole === 'admin'
                    ? 'bg-amber-950/60 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`p-1.5 rounded-lg ${
                        selectedRole === 'admin'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Key className="w-4 h-4" />
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        selectedRole === 'admin'
                          ? 'bg-amber-900/80 text-amber-300 border border-amber-700/60'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      Complet
                    </span>
                  </div>

                  <div className="font-bold text-xs sm:text-sm text-slate-100">
                    Administrateur
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Direction, paramètres fiscaux, RIB, prix & sauvegardes.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>
                  Code d'accès {selectedRole === 'admin' ? 'Administrateur' : 'Commercial'}
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Insensible à la casse
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'Ex: ADMIN2026'
                      : 'Ex: COMMERCIAL2026'
                  }
                  autoFocus
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'Masquer' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl text-xs flex items-center gap-2.5 animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !passcode.trim()}
              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40 disabled:opacity-50'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40 disabled:opacity-50'
              }`}
            >
              <span>Accéder à l'application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Helpers for instant testability */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                Codes d'accès configurés par défaut :
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Modifiables en Admin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('commercial')}
                className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-700/60 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-bold text-slate-400 group-hover:text-blue-300">
                  Remplir profil Commercial :
                </div>
                <div className="font-mono text-blue-400 font-bold tracking-wider mt-0.5">
                  COMMERCIAL2026
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-700/60 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-bold text-slate-400 group-hover:text-amber-300">
                  Remplir profil Admin :
                </div>
                <div className="font-mono text-amber-400 font-bold tracking-wider mt-0.5">
                  ADMIN2026
                </div>
              </button>
            </div>
          </div>

          {/* Vanity URL & Deployment Information */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 flex items-center gap-2.5 text-[11px] text-slate-400">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-300 font-semibold">URL recommandée :</span>{' '}
              <code className="text-emerald-400 font-mono">hini-facturation.app</code>{' '}
              ou <code className="text-emerald-400 font-mono">facturation.hinimadagascar.mg</code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Legal Mentions */}
      <footer className="w-full max-w-4xl mx-auto text-center text-[11px] text-slate-500 py-3 space-y-1 z-10">
        <p className="font-medium text-slate-400">
          {settings.name || 'HINI MADAGASCAR'} — {settings.slogan || "Organisateur d'événementiel - Tous supports publicitaires"}
        </p>
        <p>
          NIF : {settings.nif || '1001023024'} · STAT : {settings.stat || '73201 11 20080 03528'} · CIS : {settings.cis || '0184079/DGI-I'} · Antananarivo, Madagascar
        </p>
      </footer>
    </div>
  );
};
