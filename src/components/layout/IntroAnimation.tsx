import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';

export const IntroAnimation: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if reduced motion is requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    // Dismiss smoothly after 1.4 seconds
    const timer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#070b14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fading ? 'none' : 'auto',
        cursor: 'pointer'
      }}
    >
      {/* Subtle particle glow ring in center */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(129, 140, 248, 0.1) 40%, transparent 70%)',
          filter: 'blur(35px)',
          animation: 'pulseGlow 2s ease-in-out infinite'
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          transform: fading ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <Logo size="xl" showSubtitle={false} />

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <span style={{ height: '1px', width: '28px', backgroundColor: 'var(--primary)' }} />
          <span>Engineering Project Hub</span>
          <span style={{ height: '1px', width: '28px', backgroundColor: 'var(--primary)' }} />
        </div>

        {/* Minimal loading indicator bar */}
        <div
          style={{
            width: '180px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '0.75rem'
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--primary)',
              animation: 'float 1.2s ease-in-out infinite'
            }}
          />
        </div>
      </div>
    </div>
  );
};
