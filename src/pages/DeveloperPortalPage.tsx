import React, { useState } from 'react';
import {
  Terminal, PlusCircle, CheckCircle2, Clock, XCircle, Eye, Download, Heart,
  ExternalLink, FileText, Send, Sparkles, AlertTriangle
} from 'lucide-react';
import { Github } from '../components/common/BrandIcons';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Project } from '../types';

interface DeveloperPortalPageProps {
  onNavigate: (route: string) => void;
}

export const DeveloperPortalPage: React.FC<DeveloperPortalPageProps> = ({ onNavigate }) => {
  const { currentUser, isDeveloper, isAuthenticated } = useAuth();
  const { projects, categories, createProject, refreshProjects } = useProjects();

  const [activeTab, setActiveTab] = useState<'my-projects' | 'submit' | 'analytics'>('my-projects');

  // Submit form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Robotics',
    engineeringDomain: 'Robotics',
    difficulty: 'Intermediate',
    version: 'v1.0.0',
    githubUrl: '',
    demoUrl: '',
    features: ['High-throughput execution', 'Robust error-checking'],
    requirements: ['Python 3.10+', 'Docker engine']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState('');

  if (!isAuthenticated || !isDeveloper) {
    return (
      <div className="limo-container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Developer Access Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem 0' }}>
          Please sign in with a Developer or Administrator account to access the engineering submission pipeline.
        </p>
        <button type="button" onClick={() => onNavigate('/login')} className="limo-btn limo-btn-primary">
          Sign In as Developer
        </button>
      </div>
    );
  }

  const myProjects = projects.filter(p => p.developer && p.developer.id === currentUser?.id);
  const publishedProjects = myProjects.filter(p => p.status === 'Published');
  const pendingProjects = myProjects.filter(p => p.status === 'Pending');
  const draftProjects = myProjects.filter(p => p.status === 'Draft');

  const handleSubmitProject = async (status: 'Draft' | 'Pending') => {
    if (!formData.title?.trim() || !formData.shortDescription?.trim()) {
      alert('Please fill out the Project Title and Short Description.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createProject({
        ...formData,
        status,
        developer: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar
        }
      });
      await refreshProjects();
      setSubmissionFeedback(status === 'Pending'
        ? 'Project submitted successfully! It is now pending Admin Review.'
        : 'Project draft saved successfully.');
      setTimeout(() => setSubmissionFeedback(''), 4000);
      setActiveTab('my-projects');
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        category: 'Robotics',
        engineeringDomain: 'Robotics',
        difficulty: 'Intermediate',
        version: 'v1.0.0',
        githubUrl: '',
        demoUrl: ''
      });
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="limo-container" style={{ padding: '2.5rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Banner */}
      <div
        className="limo-glass-panel"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div className="limo-badge limo-badge-primary" style={{ marginBottom: '0.65rem' }}>
            <Terminal size={14} />
            <span>Developer Publishing Workspace</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: 0 }}>Developer Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', marginTop: '0.35rem' }}>
            Author, version, and submit engineering solutions for academic indexing and peer review.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className="limo-btn limo-btn-primary"
            style={{ gap: '0.5rem', padding: '0.75rem 1.5rem' }}
          >
            <PlusCircle size={18} />
            <span>Submit New Project</span>
          </button>
        </div>
      </div>

      {submissionFeedback && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', color: 'var(--success)', fontWeight: 600 }}>
          {submissionFeedback}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('my-projects')}
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: `2px solid ${activeTab === 'my-projects' ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === 'my-projects' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          My Authored Repositories ({myProjects.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('submit')}
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: `2px solid ${activeTab === 'submit' ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === 'submit' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Submit Project Form
        </button>
      </div>

      {/* Tab 1: My Projects */}
      {activeTab === 'my-projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="limo-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Published</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>{publishedProjects.length}</div>
            </div>
            <div className="limo-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Under Admin Review</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.2rem' }}>{pendingProjects.length}</div>
            </div>
            <div className="limo-card" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Drafts</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{draftProjects.length}</div>
            </div>
          </div>

          {/* Project List */}
          {myProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <Terminal size={40} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>You haven't submitted any projects yet.</p>
              <button type="button" onClick={() => setActiveTab('submit')} className="limo-btn limo-btn-primary" style={{ marginTop: '1rem' }}>
                Submit Your First Project
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myProjects.map(proj => (
                <div
                  key={proj.id}
                  className="limo-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ maxWidth: '650px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="limo-badge limo-badge-primary">{proj.category}</span>
                      <span
                        className="limo-badge"
                        style={{
                          backgroundColor: proj.status === 'Published' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                          color: proj.status === 'Published' ? 'var(--success)' : 'var(--warning)'
                        }}
                      >
                        {proj.status === 'Published' ? 'Published' : proj.status === 'Pending' ? 'In Admin Review' : 'Draft'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proj.version}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{proj.shortDescription}</p>

                    {proj.rejectionReason && (
                      <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.25)', color: '#f87171', fontSize: '0.8rem', display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                        <AlertTriangle size={15} />
                        <span>Admin Feedback: {proj.rejectionReason}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.75rem' }} className="hidden sm:flex">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={14} /> {proj.views || 0}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Heart size={14} /> {proj.likes || 0}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Download size={14} /> {proj.downloads || 0}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(`/projects/${proj.slug || proj.id}`)}
                      className="limo-btn limo-btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Submit Form */}
      {activeTab === 'submit' && (
        <div className="limo-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>Submit Engineering Project</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Provide thorough documentation, instructions, and source links to expedite review.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Quadrotor Swarm Perception Pipeline using ROS 2"
                value={formData.title || ''}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Engineering Discipline *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value, engineeringDomain: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Release Version
                </label>
                <input
                  type="text"
                  value={formData.version || 'v1.0.0'}
                  onChange={e => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Summary Abstract *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Concise high-level description for card display..."
                value={formData.shortDescription || ''}
                onChange={e => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Full Technical Documentation &amp; Architecture
              </label>
              <textarea
                rows={5}
                placeholder="Elaborate on hardware design, algorithms, benchmark numbers..."
                value={formData.fullDescription || ''}
                onChange={e => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl || ''}
                  onChange={e => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Live Demo / Telemetry URL
                </label>
                <input
                  type="url"
                  placeholder="https://demo.example.com"
                  value={formData.demoUrl || ''}
                  onChange={e => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitProject('Draft')}
                className="limo-btn limo-btn-secondary"
                style={{ minWidth: '130px' }}
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmitProject('Pending')}
                className="limo-btn limo-btn-primary"
                style={{ minWidth: '180px', gap: '0.5rem' }}
              >
                <Send size={16} />
                <span>Submit for Admin Review</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
