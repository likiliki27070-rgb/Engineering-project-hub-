import React from 'react';
import { X, Bell, CheckCheck, Clock, ExternalLink, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

interface NotificationDrawerProps {
  onNavigate: (route: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onNavigate }) => {
  const {
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationRead
  } = useProjects();

  if (!isNotificationDrawerOpen) return null;

  const handleNotificationClick = (link: string, id: string) => {
    markNotificationRead(id);
    setIsNotificationDrawerOpen(false);
    if (link) onNavigate(link);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_APPROVED':
        return <CheckCircle2 size={18} color="#34d399" />;
      case 'PROJECT_SUBMITTED':
        return <ShieldAlert size={18} color="#f59e0b" />;
      case 'PROJECT_UPDATE':
        return <Sparkles size={18} color="#38bdf8" />;
      default:
        return <Bell size={18} color="#818cf8" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(2, 6, 23, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={() => setIsNotificationDrawerOpen(false)}
    >
      <div
        className="limo-glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderLeft: '1px solid var(--border-color)',
          borderRadius: 0,
          boxShadow: '-10px 0 35px rgba(0,0,0,0.5)',
          overflowY: 'auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Notifications</h2>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Platform activity &amp; project alerts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNotificationDrawerOpen(false)}
            style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
            className="limo-btn-ghost"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', flex: 1 }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Bell size={40} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
              <p style={{ fontSize: '0.95rem' }}>No notifications yet</p>
              <p style={{ fontSize: '0.8rem' }}>You're all caught up with your engineering feeds.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.link, notif.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: notif.isRead ? 'var(--bg-card)' : 'rgba(var(--primary-rgb), 0.08)',
                  border: `1px solid ${notif.isRead ? 'var(--border-color)' : 'rgba(var(--primary-rgb), 0.3)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = notif.isRead ? 'var(--border-color)' : 'rgba(var(--primary-rgb), 0.3)')}
              >
                {!notif.isRead && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)'
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0.5rem 0', lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      <Clock size={12} />
                      <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
