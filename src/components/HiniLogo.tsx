import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface HiniLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'badge' | 'light' | 'white-card';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  customLogoUrl?: string;
}

/**
 * Official Brand Logo: HINI - Make Your Mark.
 * Faithfully matches the official circular emblem with the stylized H,
 * golden quill feather, curving navy arrow, deep navy "HINI" wordmark,
 * and warm golden cursive "Make Your Mark." signature.
 * Automatically supports custom company logos uploaded dynamically by admin.
 */
export const HiniLogo: React.FC<HiniLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = true,
  customLogoUrl,
}) => {
  let contextLogoUrl: string | undefined;
  let companyName = 'HINI MADAGASCAR';

  try {
    const appContext = useApp();
    contextLogoUrl = appContext?.settings?.logoUrl;
    if (appContext?.settings?.name) {
      companyName = appContext.settings.name;
    }
  } catch {
    // rendered outside context
  }

  const activeLogo = customLogoUrl ?? contextLogoUrl;
  const [imgError, setImgError] = useState(false);

  // Height & width proportions matching the official logo ratio (~1.45:1 for full logo)
  const sizeMap = {
    sm: { height: 38, width: 220, iconSize: 38 },
    md: { height: 50, width: 280, iconSize: 50 },
    lg: { height: 68, width: 360, iconSize: 68 },
    xl: { height: 86, width: 460, iconSize: 86 },
    '2xl': { height: 110, width: 580, iconSize: 110 },
  }[size];

  // If a custom logo is uploaded and valid, render it in place with optimal containment
  if (activeLogo && !imgError) {
    if (variant === 'badge' || variant === 'white-card') {
      return (
        <div
          className={`inline-flex items-center bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-200/80 select-none transition-transform hover:scale-[1.01] ${className}`}
          title={companyName}
        >
          <img
            src={activeLogo}
            alt={companyName}
            onError={() => setImgError(true)}
            style={{ maxHeight: sizeMap.height, width: 'auto', maxWidth: sizeMap.width }}
            className="object-contain"
          />
        </div>
      );
    }

    if (variant === 'icon-only') {
      return (
        <div
          className={`inline-flex items-center justify-center select-none overflow-hidden rounded-lg ${className}`}
          style={{ width: sizeMap.iconSize, height: sizeMap.iconSize }}
          title={companyName}
        >
          <img
            src={activeLogo}
            alt={companyName}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div
        className={`inline-flex items-center select-none ${className}`}
        style={{ height: sizeMap.height }}
        title={companyName}
      >
        <img
          src={activeLogo}
          alt={companyName}
          onError={() => setImgError(true)}
          style={{ maxHeight: sizeMap.height, width: 'auto', maxWidth: sizeMap.width }}
          className="object-contain"
        />
      </div>
    );
  }

  // Navy text color: on pure light / official document it is #1b2a65.
  // On 'light' variant (dark background without white card), make it crisp white #ffffff.
  const isLightOnDark = variant === 'light';
  const navyColor = isLightOnDark ? '#ffffff' : '#1b2a65';
  const tealColor = '#2f8f8e';
  const goldColor = '#c99558';

  // If badge or white-card is requested (perfect for dark sidebar/topbar to show authentic colors)
  if (variant === 'badge' || variant === 'white-card') {
    return (
      <div
        className={`inline-flex items-center bg-white px-3 py-1.5 rounded-xl shadow-xs border border-white/20 select-none transition-transform hover:scale-[1.01] ${className}`}
        title="HINI Make Your Mark"
      >
        <img
          src="/logo-hini-official.svg"
          alt="HINI Make Your Mark"
          style={{ height: sizeMap.height, width: 'auto' }}
          className="object-contain"
        />
      </div>
    );
  }

  // Icon only (circular emblem with H, feather, and arrow)
  if (variant === 'icon-only') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ width: sizeMap.iconSize, height: sizeMap.iconSize }}
        title="HINI - Make Your Mark"
      >
        <svg
          viewBox="0 0 460 480"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="featherGradIcon" x1="10%" y1="100%" x2="90%" y2="0%">
              <stop offset="0%" stopColor="#ab753a" />
              <stop offset="25%" stopColor="#cb965a" />
              <stop offset="60%" stopColor="#e2b274" />
              <stop offset="85%" stopColor="#ecc38a" />
              <stop offset="100%" stopColor="#c99558" />
            </linearGradient>
            <linearGradient id="shaftGradIcon" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#693e17" />
              <stop offset="50%" stopColor="#8c5825" />
              <stop offset="100%" stopColor="#bc8648" />
            </linearGradient>
            <linearGradient id="tealGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#389d9c" />
              <stop offset="100%" stopColor="#288180" />
            </linearGradient>
            <linearGradient id="navyGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLightOnDark ? '#4f6bc7' : '#21316c'} />
              <stop offset="100%" stopColor={isLightOnDark ? '#2e418a' : '#182352'} />
            </linearGradient>
          </defs>

          {/* Outer Teal Arc */}
          <path
            d="M 125,120 A 155,155 0 1,0 265,415"
            fill="none"
            stroke="url(#tealGradIcon)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Outer Navy Arc */}
          <path
            d="M 275,114 A 155,155 0 0,1 355,195"
            fill="none"
            stroke="url(#navyGradIcon)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Curved Navy Arrow */}
          <path
            d="M 320,380 C 275,440 180,432 180,375 C 180,350 195,330 195,320"
            fill="none"
            stroke="url(#navyGradIcon)"
            strokeWidth="17"
            strokeLinecap="round"
          />
          <polygon points="195,300 172,338 218,338" fill="url(#navyGradIcon)" />

          {/* Stylized 'H' Left Pillar */}
          <path
            d="M 115,165 C 138,165 158,180 158,206 L 158,335 L 102,360 L 136,258 C 122,258 108,244 115,165 Z"
            fill="url(#navyGradIcon)"
          />

          {/* Stylized 'H' Crossbar */}
          <path d="M 158,252 L 220,252 L 200,286 L 184,286 L 158,286 Z" fill="url(#tealGradIcon)" />

          {/* Stylized 'H' Right Pillar */}
          <path
            d="M 218,166 L 252,166 L 236,252 L 236,325 C 236,344 246,356 270,362 L 270,364 L 210,364 C 214,355 218,342 218,325 Z"
            fill="url(#tealGradIcon)"
          />

          {/* Golden Quill Feather */}
          <path
            d="M 190,252 C 198,205 228,136 288,62 C 280,78 274,94 276,112 C 288,97 302,87 312,80 C 305,98 295,118 285,140 C 298,127 315,116 328,109 C 315,140 292,172 258,204 C 232,230 205,248 190,252 Z"
            fill="url(#featherGradIcon)"
          />
          <path
            d="M 190,252 C 218,242 256,218 294,186 C 284,202 270,216 250,232 C 268,222 286,210 298,202 C 284,228 258,250 222,266 C 205,260 196,255 190,252 Z"
            fill="url(#featherGradIcon)"
          />
          <path
            d="M 184,260 Q 248,172 312,24"
            fill="none"
            stroke="url(#shaftGradIcon)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Full composite official logo (Emblem + HINI + Make Your Mark.)
  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ height: sizeMap.height, width: 'auto' }}
      title="HINI - Make Your Mark."
    >
      <svg
        viewBox="0 0 880 540"
        style={{ height: sizeMap.height, width: 'auto', maxHeight: '100%' }}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Caveat:wght@700&display=swap');
              .hini-wordmark {
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 900;
                letter-spacing: -0.025em;
              }
              .mym-script {
                font-family: 'Caveat', 'Brush Script MT', 'Dancing Script', 'Segoe Script', cursive, sans-serif;
                font-style: italic;
                font-weight: 700;
                letter-spacing: 0.02em;
              }
            `}
          </style>

          {/* Golden Quill Feather Gradient */}
          <linearGradient id="featherGradFull" x1="10%" y1="100%" x2="90%" y2="0%">
            <stop offset="0%" stopColor="#ab753a" />
            <stop offset="25%" stopColor="#cb965a" />
            <stop offset="60%" stopColor="#e2b274" />
            <stop offset="85%" stopColor="#ecc38a" />
            <stop offset="100%" stopColor="#c99558" />
          </linearGradient>

          {/* Central Quill Shaft Gradient */}
          <linearGradient id="shaftGradFull" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#693e17" />
            <stop offset="50%" stopColor="#8c5825" />
            <stop offset="100%" stopColor="#bc8648" />
          </linearGradient>

          {/* Teal Arc Gradient */}
          <linearGradient id="tealGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#389d9c" />
            <stop offset="100%" stopColor="#288180" />
          </linearGradient>

          {/* Navy Arc Gradient */}
          <linearGradient id="navyGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLightOnDark ? '#4a67c5' : '#21316c'} />
            <stop offset="100%" stopColor={isLightOnDark ? '#2e418a' : '#182352'} />
          </linearGradient>
        </defs>

        {/* ==================== 1. EMBLEM (LEFT) ==================== */}
        <g id="hini-official-emblem" transform="translate(10, 0)">
          {/* Outer Teal Arc: sweeps from ~10h down around left to ~5h */}
          <path
            d="M 155,160 A 175,175 0 1,0 305,490"
            fill="none"
            stroke="url(#tealGradFull)"
            strokeWidth="26"
            strokeLinecap="round"
          />

          {/* Outer Navy Arc: top-right segment (~12:30h to ~2:30h) */}
          <path
            d="M 315,152 A 175,175 0 0,1 405,242"
            fill="none"
            stroke="url(#navyGradFull)"
            strokeWidth="26"
            strokeLinecap="round"
          />

          {/* Looping Navy Arrow at bottom */}
          <path
            d="M 370,455 C 315,525 210,515 210,450 C 210,422 225,400 225,388"
            fill="none"
            stroke="url(#navyGradFull)"
            strokeWidth="19"
            strokeLinecap="round"
          />
          <polygon points="225,365 198,408 252,408" fill="url(#navyGradFull)" />

          {/* Stylized 'H' Left Pillar (Navy) */}
          <path
            d="M 142,215 C 168,215 190,233 190,262 L 190,410 L 128,438 L 166,320 C 150,320 134,304 142,215 Z"
            fill="url(#navyGradFull)"
          />

          {/* Stylized 'H' Crossbar (Teal) */}
          <path d="M 190,314 L 260,314 L 238,352 L 220,352 L 190,352 Z" fill="url(#tealGradFull)" />

          {/* Stylized 'H' Right Pillar (Teal) */}
          <path
            d="M 256,216 L 295,216 L 278,314 L 278,396 C 278,418 290,432 316,438 L 316,440 L 250,440 C 254,430 256,416 256,396 Z"
            fill="url(#tealGradFull)"
          />

          {/* Golden Quill Feather */}
          <path
            d="M 226,314 C 236,260 270,182 338,98 C 329,116 322,134 324,154 C 337,138 353,126 365,118 C 357,138 346,160 334,185 C 350,170 369,158 383,150 C 369,185 342,222 304,258 C 274,288 242,308 226,314 Z"
            fill="url(#featherGradFull)"
          />
          <path
            d="M 226,314 C 258,302 300,274 344,238 C 332,256 316,272 294,290 C 314,278 335,265 348,255 C 332,285 302,310 262,328 C 242,322 232,316 226,314 Z"
            fill="url(#featherGradFull)"
          />
          <path
            d="M 218,324 Q 292,224 366,54"
            fill="none"
            stroke="url(#shaftGradFull)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* ==================== 2. BRAND TYPOGRAPHY (RIGHT) ==================== */}
        <g id="hini-official-typography">
          {/* "HINI" Wordmark */}
          <text
            x="418"
            y="352"
            fill={navyColor}
            className="hini-wordmark"
            fontSize="148"
            fontWeight="900"
          >
            HINI
          </text>

          {/* "Make Your Mark." Signature Script */}
          {showSubtitle && (
            <text
              x="395"
              y="428"
              fill={goldColor}
              className="mym-script"
              fontSize="78"
              fontWeight="700"
              fontStyle="italic"
            >
              Make Your Mark.
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};
