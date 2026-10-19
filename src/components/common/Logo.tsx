import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true, className = '' }) => {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64
  };

  const fontSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  const s = iconSizes[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* 3D-styled Geometric Hexagonal Engineering Logo */}
      <div
        style={{
          position: 'relative',
          width: `${s}px`,
          height: `${s}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px'
        }}
      >
        <svg
          width={s}
          height={s}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(var(--primary-rgb), 0.45))',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Outer Isometric Hexagon */}
          <polygon
            points="50,6 92,30 92,78 50,102 8,78 8,30"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinejoin="round"
            fill="rgba(var(--primary-rgb), 0.08)"
          />
          {/* Inner Geodesic Facet */}
          <polygon
            points="50,22 80,39 80,71 50,88 20,71 20,39"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinejoin="round"
            fill="rgba(10, 16, 32, 0.75)"
          />
          {/* Central Reactor Node */}
          <circle cx="50" cy="55" r="10" fill="var(--primary)" />
          <circle cx="50" cy="55" r="5" fill="#ffffff" />
          {/* Connecting Quantum Vectors */}
          <line x1="50" y1="22" x2="50" y2="45" stroke="var(--primary)" strokeWidth="3" strokeDasharray="2 2" />
          <line x1="20" y1="71" x2="42" y2="60" stroke="var(--accent)" strokeWidth="3" />
          <line x1="80" y1="71" x2="58" y2="60" stroke="var(--accent)" strokeWidth="3" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            fontSize: size === 'xl' ? '3.5rem' : size === 'lg' ? '2.25rem' : size === 'md' ? '1.5rem' : '1.25rem'
          }}
        >
          LIMO
        </span>
        {showSubtitle && (
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: size === 'xl' ? '1.1rem' : size === 'lg' ? '0.85rem' : '0.675rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginTop: '0.15rem'
            }}
          >
            Engineering Project Hub
          </span>
        )}
      </div>
    </div>
  );
};
