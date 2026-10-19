import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Info, User, Settings, Palette, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface ThreeDotsMenuProps {
  onNavigate: (route: string) => void;
}

export const ThreeDotsMenu: React.FC<ThreeDotsMenuProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, setIsLogoutModalOpen } = useAuth();
  const { setIsThemeDrawerOpen } = useTheme();

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleAction = (action: string) => {
    setIsOpen(false);
    switch (action) {
      case 'about':
        onNavigate('/about');
        break;
      case 'profile':
        if (isAuthenticated) {
          onNavigate('/profile');
        } else {
          onNavigate('/login');
        }
        break;
      case 'settings':
        onNavigate('/settings');
        break;
      case 'theme':
        setIsThemeDrawerOpen(true);
        break;
      case 'logout':
        if (isAuthenticated) {
          setIsLogoutModalOpen(true);
        } else {
          onNavigate('/login');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      {/* Three-dots button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Platform Menu"
        title="More Options"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isOpen ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
          backdropFilter: 'blur(var(--glass-blur))',
          border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border-color)'}`,
          color: isOpen ? 'var(--primary)' : 'var(--text-secondary)',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.borderColor = 'var(--border-glow)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          if (!isOpen) {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <MoreVertical size={20} />
      </button>

      {/* Modern Dropdown Menu */}
      {isOpen && (
        <div
          className="limo-glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '230px',
            padding: '0.5rem',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg), 0 0 20px rgba(0,0,0,0.4)',
            zIndex: 1000
          }}
        >
          {/* Header indicator */}
          <div
            style={{
              padding: '0.45rem 0.75rem 0.6rem 0.75rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Navigation Menu</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>LIMO Hub</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {/* 1. About Us */}
            <button
              type="button"
              onClick={() => handleAction('about')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'background 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.12)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <Info size={17} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>About Us</span>
            </button>

            {/* 2. Profile */}
            <button
              type="button"
              onClick={() => handleAction('profile')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'background 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.12)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <User size={17} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>Profile</span>
            </button>

            {/* 3. Settings */}
            <button
              type="button"
              onClick={() => handleAction('settings')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'background 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <Settings size={17} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <span>Settings</span>
            </button>

            {/* 4. Theme */}
            <button
              type="button"
              onClick={() => handleAction('theme')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'background 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.12)';
                e.currentTarget.style.color = 'var(--warning)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <Palette size={17} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <span>Theme Center</span>
            </button>

            {/* Separator before Logout */}
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.35rem 0' }} />

            {/* 5. Logout */}
            <button
              type="button"
              onClick={() => handleAction('logout')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                transition: 'background 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(248, 113, 113, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut size={17} style={{ color: '#f87171', flexShrink: 0 }} />
              <span>{isAuthenticated ? 'Logout' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
