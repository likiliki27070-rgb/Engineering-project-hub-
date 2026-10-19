import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, Edit3, Settings, LogOut, Shield, Laptop, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileDropdownProps {
  onNavigate: (route: string) => void;
  onOpenEditProfile?: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onNavigate, onOpenEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser, isAuthenticated, setIsLogoutModalOpen, switchUserRole } = useAuth();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!isAuthenticated || !currentUser) {
    return (
      <button
        type="button"
        className="limo-btn limo-btn-primary"
        onClick={() => onNavigate('/login')}
        style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}
      >
        Sign In
      </button>
    );
  }

  const roleIcons = {
    ADMIN: <Shield size={12} color="#38bdf8" />,
    DEVELOPER: <Laptop size={12} color="#818cf8" />,
    USER: <GraduationCap size={12} color="#34d399" />
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.3rem 0.5rem 0.3rem 0.3rem',
          borderRadius: '9999px',
          background: 'var(--bg-surface)',
          backdropFilter: 'blur(var(--glass-blur))',
          border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border-color)'}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9999px',
            objectFit: 'cover',
            border: '2px solid var(--primary)'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginRight: '0.3rem' }} className="hidden sm:flex">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {currentUser.name.split(' ')[0]}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {currentUser.role}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className="limo-glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '260px',
            padding: '0.75rem',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg), 0 0 25px rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
        >
          {/* User info banner */}
          <div style={{ padding: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '42px', height: '42px', borderRadius: '9999px', objectFit: 'cover' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.email}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.675rem', marginTop: '0.2rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', fontWeight: 600 }}>
                {roleIcons[currentUser.role]}
                {currentUser.role}
              </div>
            </div>
          </div>

          {/* Persona Quick Switcher for Testing/Pair Programming */}
          <div style={{ padding: '0.5rem 0.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Switch Persona for Testing:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', marginTop: '0.35rem' }}>
              {(['ADMIN', 'DEVELOPER', 'USER'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => switchUserRole(role)}
                  style={{
                    padding: '0.3rem 0.2rem',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    border: `1px solid ${currentUser.role === role ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: currentUser.role === role ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(255,255,255,0.03)',
                    color: currentUser.role === role ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {role === 'ADMIN' ? 'Admin' : role === 'DEVELOPER' ? 'Developer' : 'Student'}
                </button>
              ))}
            </div>
          </div>

          {/* Menu options: View Profile, Edit Profile, Settings, Logout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { setIsOpen(false); onNavigate('/profile'); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                textAlign: 'left'
              }}
              className="limo-btn-ghost"
            >
              <UserIcon size={16} color="var(--primary)" />
              <span>View Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onOpenEditProfile) {
                  onOpenEditProfile();
                } else {
                  onNavigate('/profile?edit=true');
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                textAlign: 'left'
              }}
              className="limo-btn-ghost"
            >
              <Edit3 size={16} color="var(--accent)" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsOpen(false); onNavigate('/settings'); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                textAlign: 'left'
              }}
              className="limo-btn-ghost"
            >
              <Settings size={16} color="var(--text-secondary)" />
              <span>Settings</span>
            </button>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />

            <button
              type="button"
              onClick={() => { setIsOpen(false); setIsLogoutModalOpen(true); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.875rem',
                textAlign: 'left'
              }}
              className="limo-btn-ghost"
            >
              <LogOut size={16} color="#f87171" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
