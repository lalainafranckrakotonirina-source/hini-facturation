import React from 'react';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../types';
import { Sun, Moon, Sparkles, Check, Eye } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'compact' | 'dropdown' | 'cards';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, setTheme } = useApp();

  const options: {
    id: ThemeMode;
    label: string;
    shortLabel: string;
    desc: string;
    eyecareTag: string;
    icon: React.FC<{ className?: string }>;
    swatches: { color: string; name: string }[];
  }[] = [
    {
      id: 'classic-pro',
      label: 'Clair Classique Pro',
      shortLabel: 'Clair Pro',
      desc: 'Fond gris perle velouté, en-têtes bleu marine officiel HINI et touches turquoise subtiles. Confort optimal en lumière du jour.',
      eyecareTag: 'Anti-éblouissement jour',
      icon: Sun,
      swatches: [
        { color: '#f4f6fa', name: 'Gris perle doux' },
        { color: '#ffffff', name: 'Cartouche pur' },
        { color: '#121e42', name: 'Bleu marine HINI' },
        { color: '#248281', name: 'Turquoise HINI' },
      ],
    },
    {
      id: 'ivory-warm',
      label: 'Ivoire Élégant',
      shortLabel: 'Ivoire Doux',
      desc: 'Teinte papier velin ivoire doux, accents dorés et bleu nuit apaisant. Élimine la lumière bleue agressive pour les longues saisies.',
      eyecareTag: 'Zéro fatigue bleue',
      icon: Sparkles,
      swatches: [
        { color: '#f8f6f0', name: 'Velin ivoire doux' },
        { color: '#fdfcf9', name: 'Cartouche ivoire' },
        { color: '#c99558', name: 'Or plume caramel' },
        { color: '#162039', name: 'Bleu nuit chaud' },
      ],
    },
    {
      id: 'soft-navy',
      label: 'Bleu Nuit Doux',
      shortLabel: 'Bleu Nuit',
      desc: 'Marine crépusculaire profond et feutré, sans noir absolu agressif. Parfait pour les sessions tardives sans éblouir la rétine.',
      eyecareTag: 'Confort crépusculaire',
      icon: Moon,
      swatches: [
        { color: '#101935', name: 'Marine nuit doux' },
        { color: '#172347', name: 'Panneau nuit' },
        { color: '#38b2ac', name: 'Turquoise doux' },
        { color: '#e2b274', name: 'Or doux' },
      ],
    },
  ];

  const checkIsSelected = (optId: ThemeMode) => {
    if (theme === optId) return true;
    if (optId === 'classic-pro' && (theme === 'light' || theme === 'default')) return true;
    if (optId === 'soft-navy' && theme === 'dark') return true;
    return false;
  };

  if (variant === 'cards') {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-3.5 ${className}`}
        role="radiogroup"
        aria-label="Sélecteur d'ambiances Eye-Care HINI"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = checkIsSelected(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/30 shadow-md scale-[1.01]'
                  : 'border-slate-800 bg-slate-900/70 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`p-2.5 rounded-lg flex items-center justify-center ${
                      opt.id === 'classic-pro'
                        ? 'bg-blue-900/40 text-blue-400'
                        : opt.id === 'ivory-warm'
                        ? 'bg-amber-900/40 text-amber-300'
                        : 'bg-indigo-900/40 text-indigo-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
                      <Eye className="w-2.5 h-2.5 text-emerald-400" />
                      {opt.eyecareTag}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800/60">
                        <Check className="w-3 h-3" /> Actif
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  {opt.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {opt.desc}
                </div>
              </div>

              {/* Color swatches reflecting the theme */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {opt.swatches.map((swatch, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-black/20 shadow-xs inline-block transition-transform group-hover:scale-110"
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.name}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Charte HINI
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact segmented control for Header / Sidebar
  return (
    <div
      className={`inline-flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 backdrop-blur-xs ${className}`}
      role="radiogroup"
      aria-label="Thème d'affichage Eye-Care"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = checkIsSelected(opt.id);

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTheme(opt.id)}
            title={`${opt.label} (${opt.eyecareTag}) : ${opt.desc}`}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">{opt.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
