import React from 'react';

interface OfficialStampProps {
  signatory?: string;
  title?: string;
  nif?: string;
  showSignature?: boolean;
  stampSignature?: string; // Optionnel : image personnalisée si besoin
  className?: string;
}

/**
 * Official Corporate Stamp & Handwritten Signature of HINI MADAGASCAR
 * Faithfully reproduces the official blue oval "HiNi Madagascar" stamp with authentic signature
 */
export const OfficialStamp: React.FC<OfficialStampProps> = ({
  signatory = 'Hasina Razafy',
  title = 'Direction Générale',
  nif,
  showSignature = true,
  stampSignature,
  className = '',
}) => {
  return (
    <div className={`relative inline-block w-56 select-none pointer-events-none ${className}`}>
      {/* Container with stamp and signature */}
      <div className="relative w-52 h-40 mx-auto flex flex-col items-center justify-center">
        {stampSignature ? (
          // Si une image de cachet/signature personnalisée est fournie via les paramètres
          <img
            src={stampSignature}
            alt="Cachet et Signature"
            className="w-full h-full object-contain filter drop-shadow-xs transform -rotate-2"
          />
        ) : (
          // Sinon, utilisation du SVG vectoriel officiel HINI Madagascar
          <svg
            viewBox="0 0 320 240"
            className="w-full h-full transform -rotate-2 filter drop-shadow-xs"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="stamp-roughness" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* --- 1. OVAL STAMP BORDER --- */}
            <g filter="url(#stamp-roughness)">
              <ellipse
                cx="160"
                cy="95"
                rx="138"
                ry="74"
                fill="none"
                stroke="#224b94"
                strokeWidth="4"
                strokeDasharray="180 1 120 1"
                opacity="0.92"
              />
              <ellipse
                cx="160"
                cy="95"
                rx="133"
                ry="69"
                fill="none"
                stroke="#224b94"
                strokeWidth="1"
                opacity="0.45"
              />

              {/* --- 2. TOP STYLIZED "HiNi" LOGOTYPE --- */}
              <g fill="#224b94" opacity="0.95">
                <path d="M 68,44 L 88,44 L 62,94 L 42,94 Z" />
                <path d="M 60,65 L 105,65 L 98,76 L 55,76 Z" />
                <path d="M 94,44 L 114,44 L 88,94 L 68,94 Z" />
                <ellipse cx="88" cy="70" rx="14" ry="4" fill="#ffffff" />
                <ellipse cx="88" cy="70" rx="12" ry="3" fill="#224b94" />

                <ellipse cx="136" cy="46" rx="7" ry="9" transform="rotate(-15 136 46)" />
                <path d="M 125,58 L 143,58 L 135,94 L 119,94 Z" />

                <path d="M 148,52 L 168,52 L 162,94 L 144,94 Z" />
                <path d="M 162,54 L 196,86 L 194,94 L 160,62 Z" />
                <path d="M 188,52 L 208,52 L 202,94 L 184,94 Z" />

                <ellipse cx="228" cy="46" rx="7" ry="9" transform="rotate(-12 228 46)" />
                <path d="M 218,58 L 236,58 L 229,94 L 213,94 Z" />
              </g>

              {/* --- 3. BANNER "Madagascar" --- */}
              <rect
                x="52"
                y="97"
                width="216"
                height="36"
                rx="4"
                fill="#224b94"
                opacity="0.95"
              />
              <text
                x="160"
                y="122"
                textAnchor="middle"
                fill="#ffffff"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="900"
                fontSize="20"
                letterSpacing="3"
              >
                Madagascar
              </text>
            </g>

            {/* --- 4. AUTHENTIC HANDWRITTEN BLUE INK SIGNATURE --- */}
            {showSignature && (
              <g
                stroke="#1b4287"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.96"
              >
                <path
                  d="M 135,130 C 120,145 110,165 116,180 C 122,192 138,188 144,172 C 150,154 135,140 128,144 C 118,150 112,176 122,204 C 128,218 134,228 126,234 C 120,238 112,230 114,212 C 117,192 135,160 152,148"
                  strokeWidth="3.2"
                />
                <path
                  d="M 124,152 C 138,138 160,136 172,150 C 182,162 168,184 148,198 C 132,210 125,218 136,224 C 146,230 166,204 186,170"
                  strokeWidth="2.8"
                />
                <path
                  d="M 130,166 C 142,160 154,162 152,174 C 150,184 136,186 128,178 C 122,170 130,158 142,156"
                  strokeWidth="2.4"
                />
                <path
                  d="M 142,196 L 168,168"
                  strokeWidth="3.2"
                />
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Signatory Text underneath */}
      <div className="text-center mt-1">
        <p className="text-[11px] font-bold text-slate-900 leading-tight uppercase">
          {signatory}
        </p>
        <p className="text-[10px] text-slate-600 italic">
          {title}
        </p>
        {nif && (
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            NIF: {nif}
          </p>
        )}
      </div>
    </div>
  );
};
