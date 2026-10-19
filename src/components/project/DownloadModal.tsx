import React, { useState } from 'react';
import { X, Download, FileText, Archive, CheckCircle2, Cpu } from 'lucide-react';
import { Project, DownloadResource } from '../../types';
import { useProjects } from '../../context/ProjectContext';

interface DownloadModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ project, isOpen, onClose }) => {
  const { recordDownload } = useProjects();
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const resources: DownloadResource[] = project.downloadResources && project.downloadResources.length > 0
    ? project.downloadResources
    : [
        { name: 'Source Code Package', size: '14.8 MB', type: 'ZIP Archive', filename: `${project.slug}-v${project.version || '1.0'}.zip` },
        { name: 'Architecture & Wiring Blueprint', size: '4.2 MB', type: 'Schematics', filename: `${project.slug}-schematics.pdf` },
        { name: 'Research Summary & Documentation', size: '2.1 MB', type: 'Documentation', filename: `${project.slug}-docs.pdf` }
      ];

  const handleDownload = async (resource: DownloadResource) => {
    setDownloadingFile(resource.filename);
    await recordDownload(project, resource.filename);
    setTimeout(() => {
      setDownloadingFile(null);
    }, 1500);
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
          maxWidth: '520px',
          padding: '2rem',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Download Project Assets</h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Verified open-source engineering resources</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="limo-btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Assets for <strong>{project.title}</strong> ({project.version}):
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {resources.map(res => {
            const isCurrentlyDownloading = downloadingFile === res.filename;
            return (
              <div
                key={res.filename}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--primary)' }}>
                    {res.type.includes('ZIP') || res.type.includes('Archive') ? <Archive size={20} /> : <FileText size={20} />}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                      {res.name}
                    </h5>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      <span>{res.type}</span>
                      <span>&bull;</span>
                      <span>{res.size}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isCurrentlyDownloading}
                  onClick={() => handleDownload(res)}
                  className={`limo-btn ${isCurrentlyDownloading ? 'limo-btn-secondary' : 'limo-btn-primary'}`}
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.775rem', gap: '0.35rem' }}
                >
                  {isCurrentlyDownloading ? (
                    <>
                      <CheckCircle2 size={14} color="#34d399" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <Cpu size={14} style={{ color: 'var(--primary)' }} />
          <span>All packages are compiled and checked against standard engineering reproducibility benchmarks.</span>
        </div>
      </div>
    </div>
  );
};
