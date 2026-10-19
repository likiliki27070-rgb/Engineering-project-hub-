import React, { useState } from 'react';
import { LogIn, Shield, Laptop, GraduationCap, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      onNavigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: Role) => {
    setIsLoading(true);
    try {
      await switchUserRole(role);
      onNavigate(role === 'ADMIN' ? '/admin' : role === 'DEVELOPER' ? '/developer' : '/profile');
    } catch (err: any) {
      setError('Quick login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="limo-container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="limo-glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="lg" showSubtitle={true} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '1.5rem', marginBottom: '0.35rem' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sign in to access your saved repositories and engineering tools
          </p>
        </div>

        {/* 1-Click Persona Quick Switcher for Evaluation */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
            border: '1px solid rgba(var(--primary-rgb), 0.25)',
            marginBottom: '1.75rem'
          }}
        >
          <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>
            ⚡ 1-Click Fast Sign-In:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              style={{
                padding: '0.5rem 0.3rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              <Shield size={16} color="var(--primary)" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('DEVELOPER')}
              style={{
                padding: '0.5rem 0.3rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              <Laptop size={16} color="var(--accent)" />
              <span>Developer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('USER')}
              style={{
                padding: '0.5rem 0.3rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              <GraduationCap size={16} color="#34d399" />
              <span>Student</span>
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(248, 113, 113, 0.15)', border: '1px solid rgba(248, 113, 113, 0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Email Login */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Academic or Organization Email
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="name@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="limo-btn-ghost"
                style={{ padding: 0, fontSize: '0.75rem', color: 'var(--primary)' }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="limo-btn limo-btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', gap: '0.5rem' }}
          >
            <LogIn size={18} />
            <span>{isLoading ? 'Signing In...' : 'Sign In to Hub'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an engineering account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/register')}
            style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};
