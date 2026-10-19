import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe } from 'lucide-react';
import { Linkedin, Twitter } from '../common/BrandIcons';
import { Project } from '../../types';

interface ShareModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ project, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const projectUrl = `${window.location.origin}/projects/${project.slug || project.id}`;
  const shareText = `Explore "${project.title}" on LIMO — Engineering Project Hub: ${project.shortDescription}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(projectUrl)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.shortDescription,
          url: projectUrl
        });
      } catch (err) {
        console.warn('Native share aborted or failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="limo-glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '1.75rem',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Share Engineering Project</h3>
          </div>
          <button type="button" onClick={onClose} className="limo-btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Share <strong style={{ color: 'var(--text-primary)' }}>{project.title}</strong> with students, researchers, or colleagues.
        </p>

        {/* Copy Link Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            readOnly
            value={projectUrl}
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="limo-btn limo-btn-primary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.825rem', gap: '0.4rem' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={shareToTwitter}
            className="limo-btn limo-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.65rem', gap: '0.4rem' }}
          >
            <Twitter size={16} color="#38bdf8" />
            <span>Twitter/X</span>
          </button>

          <button
            type="button"
            onClick={shareToLinkedIn}
            className="limo-btn limo-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.65rem', gap: '0.4rem' }}
          >
            <Linkedin size={16} color="#0077b5" />
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="limo-btn limo-btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.65rem', gap: '0.4rem' }}
          >
            <Globe size={16} color="#10b981" />
            <span>Web Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
