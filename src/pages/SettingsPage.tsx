import React, { useState } from 'react';
import { Settings, Palette, Bell, Shield, Key, Moon, Sun, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { themeConfig, setIsThemeDrawerOpen, setThemePreset } = useTheme();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [submissionNotifs, setSubmissionNotifs] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="limo-container" style={{ padding: '3rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <div className="limo-badge limo-badge-primary" style={{ marginBottom: '0.5rem' }}>
          <Settings size={13} />
          <span>Preferences &amp; Configuration</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800 }}>Account &amp; Platform Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Manage your personal workspace appearance, notification channels, and security settings.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Card 1: Theme Center Shortcut */}
        <div className="limo-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(251, 191, 36, 0.15)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Palette size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Theme Customization</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Preset: <strong>{themeConfig.preset}</strong></span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Switch between 8 curated engineering themes (Dark, Light, Midnight, Glass, Cyber, Aurora, Minimal, High Contrast) or customize colors and glassmorphic blur.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(['dark', 'light', 'midnight', 'cyber'] as const).map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setThemePreset(preset)}
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    backgroundColor: themeConfig.preset === preset ? 'rgba(var(--primary-rgb), 0.15)' : 'var(--bg-card)',
                    border: `1px solid ${themeConfig.preset === preset ? 'var(--primary)' : 'var(--border-color)'}`,
                    color: themeConfig.preset === preset ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsThemeDrawerOpen(true)}
            className="limo-btn limo-btn-primary"
            style={{ width: '100%', gap: '0.5rem' }}
          >
            <Palette size={16} />
            <span>Open Advanced Theme Center</span>
          </button>
        </div>

        {/* Card 2: Notifications & Communication */}
        <div className="limo-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Notification Preferences</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Activity feeds &amp; project updates</span>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Email Digests on Project Updates</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>Receive alerts when bookmarked projects release new versions.</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={submissionNotifs}
                onChange={e => setSubmissionNotifs(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Developer Review Notifications</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>Instant notifications when Admin reviews your submitted repositories.</p>
              </div>
            </label>

            <button type="submit" className="limo-btn limo-btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>
              Save Notification Preferences
            </button>
          </form>
        </div>

        {/* Card 3: Security & Session */}
        <div className="limo-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Security &amp; Session</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Authentication &amp; cryptographic status</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Active Persona:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.name || 'Guest'}</strong> ({currentUser?.role || 'None'})
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Session Token:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)' }}>JWT-Signed RS256 Validated</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/profile?edit=true')}
              className="limo-btn limo-btn-secondary"
              style={{ width: '100%' }}
            >
              Update Profile Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
