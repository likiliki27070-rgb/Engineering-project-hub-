import React from 'react';
import { Compass, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/common/Logo';

interface NotFoundPageProps {
  onNavigate: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="limo-container" style={{ padding: '6rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Logo size="lg" showSubtitle={true} />
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '7rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginTop: '2rem'
        }}
      >
        404
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        Page Out of Bounds
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', fontSize: '0.95rem', marginBottom: '2rem' }}>
        The engineering coordinate or project identifier you navigated to does not exist on this node.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="limo-btn limo-btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/projects')}
          className="limo-btn limo-btn-secondary"
          style={{ gap: '0.5rem' }}
        >
          <Compass size={16} />
          <span>Explore Projects</span>
        </button>
      </div>
    </div>
  );
};
