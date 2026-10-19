import React from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LogoutConfirmModalProps {
  onConfirm?: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ onConfirm }) => {
  const { isLogoutModalOpen, setIsLogoutModalOpen, logout } = useAuth();

  if (!isLogoutModalOpen) return null;

  const handleLogout = async () => {
    await logout();
    if (onConfirm) onConfirm();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '1rem'
      }}
      onClick={() => setIsLogoutModalOpen(false)}
    >
      <div
        className="limo-glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2rem',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(248, 113, 113, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Are you sure you want to log out?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Your current authenticated session on LIMO will be securely cleared.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
          <button
            type="button"
            className="limo-btn limo-btn-secondary"
            onClick={() => setIsLogoutModalOpen(false)}
            style={{ minWidth: '100px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="limo-btn limo-btn-danger"
            onClick={handleLogout}
            style={{
              minWidth: '110px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ef4444',
              color: '#ffffff'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
