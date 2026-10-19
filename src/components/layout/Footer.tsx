import React from 'react';
import { ExternalLink, Heart, Shield, Code, Cpu } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Github, Instagram, Linkedin } from '../common/BrandIcons';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      style={{
        marginTop: '6rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '4rem 0 2rem 0'
      }}
    >
      <div className="limo-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}
        >
          {/* Col 1: Branding & Description */}
          <div style={{ maxWidth: '360px' }}>
            <Logo size="md" showSubtitle={true} />
            <p
              style={{
                marginTop: '1.25rem',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}
            >
              The premier open-access central hub for engineering discovery, reproducible student research, hardware-software co-design, and developer collaboration across 20+ engineering disciplines.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1.5rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                title="GitHub"
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                title="LinkedIn"
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#0077b5';
                  e.currentTarget.style.borderColor = '#0077b5';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                title="Instagram"
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#e1306c';
                  e.currentTarget.style.borderColor = '#e1306c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li>
                <button type="button" onClick={() => onNavigate('/projects')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Projects Explorer
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/developer')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Developer Portal
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/about')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  About Us & Creators
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/#contact')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Contact Engineering Board
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/about')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Documentation & Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Domains */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Key Disciplines
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li>
                <button type="button" onClick={() => onNavigate('/projects?category=Robotics')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Robotics & Autonomous Systems
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/projects?category=Quantum Computing')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Quantum Computing & Cryptography
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/projects?category=Cybersecurity')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Cybersecurity & Zero-Trust
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/projects?category=Artificial Intelligence')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Artificial Intelligence & ML
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/projects?category=Embedded Systems')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Embedded Systems & Microgrids
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Standards */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Platform & Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li>
                <button type="button" onClick={() => alert('Privacy Policy: LIMO respects all data sovereignty, academic project licensing, and user privacy.')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => alert('Terms of Service: Projects published on LIMO are open for educational and research evaluation under open-source licenses.')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/about#creators')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Meet the Creators
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/settings')} className="limo-btn-ghost" style={{ padding: 0 }}>
                  Account & Theme Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>&copy; {new Date().getFullYear()}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>LIMO — Engineering Project Hub</span>
            <span>. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Code size={14} style={{ color: 'var(--primary)' }} />
              Built with React &amp; TypeScript
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Cpu size={14} style={{ color: 'var(--accent)' }} />
              Engineering Standard v2.4
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
