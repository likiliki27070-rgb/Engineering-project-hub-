import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { api } from '../services/api';

interface ForgotPasswordPageProps {
  onNavigate: (route: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await api.forgotPassword(email);
    } catch (e) {
      // Mock flow
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="limo-container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="limo-glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <KeyRound size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Enter your email to receive recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verification Link Dispatched</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              If an account is associated with <strong>{email}</strong>, a secure reset token has been delivered.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="limo-btn limo-btn-primary"
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Account Email
              </label>
              <input
                type="email"
                required
                placeholder="name@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="limo-btn limo-btn-primary"
              style={{ padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {isLoading ? 'Verifying...' : 'Send Recovery Link'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="limo-btn limo-btn-ghost"
              style={{ gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
