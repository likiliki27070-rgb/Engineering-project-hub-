import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, ExternalLink, Download, Bookmark, Heart, Share2, Eye,
  Calendar, Cpu, CheckCircle2, Terminal, Code, Layers, MessageSquare, Send,
  FileText, ShieldCheck, User, Video, Info
} from 'lucide-react';
import { Github } from '../components/common/BrandIcons';
import { Project, Comment } from '../types';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { ShareModal } from '../components/project/ShareModal';
import { DownloadModal } from '../components/project/DownloadModal';
import { api } from '../services/api';

interface ProjectDetailsPageProps {
  idOrSlug: string;
  onNavigate: (route: string) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ idOrSlug, onNavigate }) => {
  const { projects, toggleLike, toggleBookmark } = useProjects();
  const { currentUser, isAuthenticated } = useAuth();

  const [project, setProject] = useState<Project | null>(() => {
    return projects.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'install' | 'docs' | 'media' | 'downloads' | 'comments'>('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchFullProject = async () => {
      try {
        const full = await api.getProjectByIdOrSlug(idOrSlug);
        setProject(full);
        setComments(full.comments || []);
      } catch (e) {
        const fallback = projects.find(p => p.id === idOrSlug || p.slug === idOrSlug);
        if (fallback) {
          setProject(fallback);
          setComments(fallback.comments || []);
        }
      }
    };
    fetchFullProject();
  }, [idOrSlug, projects]);

  if (!project) {
    return (
      <div className="limo-container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Project Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem 0' }}>The requested project may have been moved or unpublished.</p>
        <button type="button" onClick={() => onNavigate('/projects')} className="limo-btn limo-btn-primary">
          Back to Explorer
        </button>
      </div>
    );
  }

  const isLiked = currentUser?.likes?.includes(project.id);
  const isBookmarked = currentUser?.bookmarks?.includes(project.id);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    setIsSubmittingComment(true);
    try {
      const added = await api.addComment(project.id, {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        userRole: currentUser.role,
        content: newComment.trim()
      });
      setComments(prev => [...prev, added]);
      setNewComment('');
    } catch (err) {
      console.warn('Comment error:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Features', icon: <Info size={16} /> },
    { id: 'tech', label: 'Tech Stack & Requirements', icon: <Cpu size={16} /> },
    { id: 'install', label: 'Installation & Usage', icon: <Terminal size={16} /> },
    { id: 'docs', label: 'Documentation', icon: <FileText size={16} /> },
    { id: 'media', label: 'Screenshots & Media', icon: <Video size={16} /> },
    { id: 'downloads', label: `Downloads (${project.downloadResources?.length || 1})`, icon: <Download size={16} /> },
    { id: 'comments', label: `Discussions (${comments.length})`, icon: <MessageSquare size={16} /> }
  ];

  return (
    <div className="limo-container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Back button & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          type="button"
          onClick={() => onNavigate('/projects')}
          className="limo-btn limo-btn-ghost"
          style={{ padding: '0.4rem 0.75rem', gap: '0.5rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Projects Explorer</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Projects</span>
          <span>/</span>
          <span style={{ color: 'var(--primary)' }}>{project.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{project.slug || project.id}</span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div
        className="limo-glass-panel"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span className="limo-badge limo-badge-primary">{project.category}</span>
              <span className="limo-badge limo-badge-accent">{project.difficulty}</span>
              <span className="limo-badge" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}>
                {project.version}
              </span>
              <span className="limo-badge limo-badge-success">
                <ShieldCheck size={12} />
                Verified Engineering Build
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
              {project.title}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {project.shortDescription}
            </p>
          </div>

          {/* Action Buttons Column */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => toggleBookmark(project.id)}
              className="limo-btn limo-btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', gap: '0.45rem' }}
              title="Bookmark project"
            >
              <Bookmark size={16} fill={isBookmarked ? 'var(--primary)' : 'none'} color={isBookmarked ? 'var(--primary)' : 'currentColor'} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleLike(project.id)}
              className="limo-btn limo-btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', gap: '0.45rem' }}
              title="Like project"
            >
              <Heart size={16} fill={isLiked ? '#f43f5e' : 'none'} color={isLiked ? '#f43f5e' : 'currentColor'} />
              <span>{project.likes || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="limo-btn limo-btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', gap: '0.45rem' }}
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="limo-btn limo-btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', gap: '0.5rem' }}
            >
              <Download size={16} />
              <span>Download Assets</span>
            </button>
          </div>
        </div>

        {/* Developer & Meta Strip */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            fontSize: '0.85rem'
          }}
        >
          {/* Developer Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={project.developer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={project.developer?.name || 'Developer'}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {project.developer?.name || 'Lead Researcher'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Project Author &bull; {project.engineeringDomain}
              </div>
            </div>
          </div>

          {/* External Links: GitHub & Live Demo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="limo-btn limo-btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
              >
                <Github size={15} />
                <span>Repository</span>
                <ExternalLink size={12} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="limo-btn limo-btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
              >
                <ExternalLink size={15} color="var(--primary)" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {tabs.map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.15rem',
                borderBottom: `2px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* 1. OVERVIEW & FEATURES */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Project Abstract &amp; Architecture
              </h3>
              <p style={{ fontSize: '0.975rem', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                {project.fullDescription || project.shortDescription}
              </p>
            </div>

            {project.features && project.features.length > 0 && (
              <div className="limo-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  Core Engineering Features
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <CheckCircle2 size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. TECH STACK & REQUIREMENTS */}
        {activeTab === 'tech' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Technologies &amp; Frameworks
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2rem' }}>
                {(project.technologies || []).map(tech => (
                  <span
                    key={tech}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(var(--primary-rgb), 0.12)',
                      border: '1px solid rgba(var(--primary-rgb), 0.3)',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
                Programming Languages
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(project.programmingLanguages || ['Python', 'C++']).map(lang => (
                  <span
                    key={lang}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.12)',
                      border: '1px solid rgba(var(--accent-rgb), 0.3)',
                      color: 'var(--accent)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {project.requirements && project.requirements.length > 0 && (
              <div className="limo-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  Hardware &amp; Software Prerequisites
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {project.requirements.map((req, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Cpu size={16} color="var(--primary)" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 3. INSTALLATION & USAGE */}
        {activeTab === 'install' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Installation Instructions
              </h3>
              <pre
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(5, 8, 16, 0.85)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  lineHeight: 1.6
                }}
              >
                <code>{project.installation || '# Clone repository\ngit clone ' + (project.githubUrl || 'https://github.com/limo-hub/repo') + '\ncd project\nmake build'}</code>
              </pre>
            </div>

            {project.usage && (
              <div className="limo-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Execution &amp; Usage Guide
                </h3>
                <pre
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(5, 8, 16, 0.85)',
                    border: '1px solid var(--border-color)',
                    color: '#38bdf8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    overflowX: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  <code>{project.usage}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 4. DOCUMENTATION */}
        {activeTab === 'docs' && (
          <div className="limo-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <FileText size={24} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Project Engineering Whitepaper
              </h3>
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line'
              }}
            >
              {project.documentation || 'Detailed whitepaper and mathematical modeling available via the Downloads tab.'}
            </div>
          </div>
        )}

        {/* 5. MEDIA & SCREENSHOTS */}
        {activeTab === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {project.images && project.images.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>High-Resolution Screenshots</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {project.images.map((img, i) => (
                    <div key={i} className="limo-card" style={{ height: '240px', overflow: 'hidden' }}>
                      <img
                        src={img}
                        alt={`Screenshot ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.demoVideoUrl && (
              <div className="limo-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>Demonstration Video</h3>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
                  <iframe
                    src={project.demoVideoUrl}
                    title="Demonstration Video"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. DOWNLOADS */}
        {activeTab === 'downloads' && (
          <div className="limo-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Available Project Packages</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                  Total platform downloads for this project: <strong>{project.downloads || 0}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(true)}
                className="limo-btn limo-btn-primary"
              >
                <Download size={16} />
                <span>Open Asset Downloader</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(project.downloadResources || []).map((res, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: '0.925rem', fontWeight: 700, margin: 0 }}>{res.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.type} &bull; {res.size}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="limo-btn limo-btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. COMMENTS & DISCUSSIONS */}
        {activeTab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Add Comment Form */}
            <div className="limo-card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Participate in Discussion</h4>
              {isAuthenticated ? (
                <form onSubmit={handleAddComment}>
                  <textarea
                    rows={3}
                    placeholder="Share technical inquiries, benchmarks, or peer review feedback..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      marginBottom: '1rem'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="limo-btn limo-btn-primary"
                      style={{ gap: '0.45rem' }}
                    >
                      <Send size={15} />
                      <span>{isSubmittingComment ? 'Posting...' : 'Post Technical Comment'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sign in to post comments and join technical discussions.</span>
                  <button type="button" onClick={() => onNavigate('/login')} className="limo-btn limo-btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Existing Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ opacity: 0.3, margin: '0 auto 0.75rem auto' }} />
                  <p>No comments posted yet. Be the first engineer to start the technical discussion!</p>
                </div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="limo-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={c.userAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'}
                          alt={c.userName}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                            {c.userName}
                          </div>
                          <span style={{ fontSize: '0.675rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                            {c.userRole}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {c.createdDate}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ShareModal
        project={project}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <DownloadModal
        project={project}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
