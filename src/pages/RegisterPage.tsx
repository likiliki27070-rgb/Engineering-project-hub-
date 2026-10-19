import React, { useState } from 'react';
import { UserPlus, Shield, Laptop, GraduationCap, Mail, Lock, User, BookOpen, AlertCircle } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface RegisterPageProps {
  onNavigate: (route: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [domain, setDomain] = useState('Computer Science Engineering');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsLoading(true);
    setError('');
    try {
      await register({
        name,
        username: username || email.split('@')[0],
        email,
        password,
        role,
        engineeringDomain: domain
      });
      onNavigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="limo-container" style={{ padding: '3.5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="limo-glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="lg" showSubtitle={true} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.35rem' }}>
            Create Engineering Profile
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Join the central engineering research and project distribution hub
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(248, 113, 113, 0.15)', border: '1px solid rgba(248, 113, 113, 0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Role Selection Tabs */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.45rem' }}>
              Choose Your Member Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setRole('USER')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${role === 'USER' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: role === 'USER' ? 'rgba(var(--primary-rgb), 0.12)' : 'var(--bg-card)',
                  color: role === 'USER' ? 'var(--primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <GraduationCap size={18} />
                <span>Student / Explorer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('DEVELOPER')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${role === 'DEVELOPER' ? 'var(--accent)' : 'var(--border-color)'}`,
                  backgroundColor: role === 'DEVELOPER' ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--bg-card)',
                  color: role === 'DEVELOPER' ? 'var(--accent)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Laptop size={18} />
                <span>Developer / Author</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Dr. Jordan Lee"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Username
              </label>
              <input
                type="text"
                placeholder="jordan_robotics"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Academic / Work Email *
            </label>
            <input
              type="email"
              required
              placeholder="jordan@mit.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Engineering Domain
            </label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. Robotics, AI, Quantum Computing"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="limo-btn limo-btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', gap: '0.5rem' }}
          >
            <UserPlus size={18} />
            <span>{isLoading ? 'Creating Account...' : 'Register for LIMO Hub'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
