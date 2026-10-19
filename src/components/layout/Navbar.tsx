import React, { useState } from 'react';
import { Info, Bell, Search, Compass, Terminal, Shield, Menu, X, BookOpen } from 'lucide-react';
import { Logo } from '../common/Logo';
import { ThreeDotsMenu } from './ThreeDotsMenu';
import { ProfileDropdown } from './ProfileDropdown';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (route: string) => void;
  onOpenSearch?: () => void;
  onOpenEditProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch, onOpenEditProfile }) => {
  const { isAdmin, isDeveloper, isAuthenticated } = useAuth();
  const { unreadNotifsCount, setIsNotificationDrawerOpen } = useProjects();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', path: '/projects', icon: <Compass size={16} /> },
    { label: 'Domains', path: '/#domains', icon: <BookOpen size={16} /> },
    ...(isDeveloper ? [{ label: 'Dev Portal', path: '/developer', icon: <Terminal size={16} /> }] : []),
    ...(isAdmin ? [{ label: 'Admin', path: '/admin', icon: <Shield size={16} /> }] : [])
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        borderBottom: '1px solid var(--border-color)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="limo-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Left: Brand Logo & Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div
            onClick={() => onNavigate('/')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Logo size="md" showSubtitle={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hidden md:flex">
            {navLinks.map(link => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleLinkClick(link.path)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'rgba(var(--primary-rgb), 0.12)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(var(--primary-rgb), 0.3)' : 'transparent'}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center/Search Quick Trigger */}
        <div className="hidden lg:flex" style={{ flex: 1, maxWidth: '280px', margin: '0 1.5rem' }}>
          <button
            type="button"
            onClick={onOpenSearch || (() => onNavigate('/projects'))}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={15} />
              <span>Search engineering projects...</span>
            </div>
            <kbd
              style={{
                fontSize: '0.65rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                color: 'var(--text-secondary)'
              }}
            >
              /
            </kbd>
          </button>
        </div>

        {/* Right Section: Ordered strictly as requested in Part 2:
            [ ... (three dots) ] [ About Us ] [ Profile / Avatar ]
        */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => setIsNotificationDrawerOpen(true)}
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Notifications"
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.borderColor = 'var(--border-glow)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 8px var(--primary)'
                }}
              />
            )}
          </button>

          {/* 1. THREE-DOTS MENU (⋮) */}
          <ThreeDotsMenu onNavigate={onNavigate} />

          {/* 2. ABOUT US BUTTON (Dedicated top-right modern glassmorphism button) */}
          <button
            type="button"
            onClick={() => onNavigate('/about')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              backgroundColor: currentPath === '/about' ? 'rgba(var(--primary-rgb), 0.15)' : 'var(--bg-surface)',
              backdropFilter: 'blur(var(--glass-blur))',
              border: `1px solid ${currentPath === '/about' ? 'var(--primary)' : 'var(--border-color)'}`,
              color: currentPath === '/about' ? 'var(--primary)' : 'var(--text-primary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              if (currentPath !== '/about') {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <Info size={16} style={{ color: 'var(--primary)' }} />
            <span>About Us</span>
          </button>

          {/* 3. PROFILE / AVATAR / SIGN IN */}
          <ProfileDropdown onNavigate={onNavigate} onOpenEditProfile={onOpenEditProfile} />

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="limo-glass-panel animate-fade-in md:hidden"
          style={{
            padding: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface-elevated)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map(link => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleLinkClick(link.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: currentPath === link.path ? 'var(--primary)' : 'var(--text-primary)',
                  backgroundColor: currentPath === link.path ? 'rgba(var(--primary-rgb), 0.12)' : 'transparent',
                  textAlign: 'left'
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleLinkClick('/about')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: currentPath === '/about' ? 'var(--primary)' : 'var(--text-primary)',
                backgroundColor: currentPath === '/about' ? 'rgba(var(--primary-rgb), 0.12)' : 'transparent',
                textAlign: 'left'
              }}
            >
              <Info size={16} />
              <span>About Us</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
