import React, { useState, useEffect } from 'react';
import {
  User, Edit3, Bookmark, Heart, Clock, Award, Terminal,
  ExternalLink, Calendar, Check, X, Shield, Cpu, Layers
} from 'lucide-react';
import { Github, Linkedin } from '../components/common/BrandIcons';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { ProjectCard } from '../components/project/ProjectCard';
import { Project } from '../types';

interface ProfilePageProps {
  onNavigate: (route: string) => void;
  initialEditMode?: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, initialEditMode = false }) => {
  const { currentUser, isAuthenticated, updateProfile } = useAuth();
  const { projects } = useProjects();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'likes' | 'projects' | 'activity'>('bookmarks');
  const [isEditModalOpen, setIsEditModalOpen] = useState(initialEditMode);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditUsername(currentUser.username || '');
      setEditAvatar(currentUser.avatar || '');
      setEditBio(currentUser.bio || '');
      setEditDomain(currentUser.engineeringDomain || 'Computer Science Engineering');
      setEditSkills(Array.isArray(currentUser.skills) ? currentUser.skills.join(', ') : '');
      setEditGithub(currentUser.githubUrl || '');
      setEditLinkedin(currentUser.linkedinUrl || '');
    }
  }, [currentUser]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="limo-container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile Sign In Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem 0' }}>Please log in to access your personal engineering profile and bookmarked repositories.</p>
        <button type="button" onClick={() => onNavigate('/login')} className="limo-btn limo-btn-primary">
          Sign In to LIMO
        </button>
      </div>
    );
  }

  const bookmarkedProjects = projects.filter(p => (currentUser.bookmarks || []).includes(p.id));
  const likedProjects = projects.filter(p => (currentUser.likes || []).includes(p.id));
  const developerProjects = projects.filter(p => p.developer && p.developer.id === currentUser.id);
  const publishedDevProjects = developerProjects.filter(p => p.status === 'Published');
  const pendingDevProjects = developerProjects.filter(p => p.status === 'Pending');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      const skillsArray = editSkills.split(',').map(s => s.trim()).filter(Boolean);
      await updateProfile({
        name: editName.trim(),
        username: editUsername.trim(),
        avatar: editAvatar.trim(),
        bio: editBio.trim(),
        engineeringDomain: editDomain,
        skills: skillsArray,
        githubUrl: editGithub.trim(),
        linkedinUrl: editLinkedin.trim()
      });
      setSuccessMessage('Profile details updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsEditModalOpen(false);
    } catch (err) {
      console.warn('Update profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="limo-container" style={{ padding: '3rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Success Notification */}
      {successMessage && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Header Glass Panel */}
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
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.35)'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--primary)',
                  color: '#090d16',
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {currentUser.role}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {currentUser.name}
                </h1>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  @{currentUser.username}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                {currentUser.engineeringDomain}
              </div>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, margin: '0.75rem 0' }}>
                {currentUser.bio || 'Exploring, benchmarking, and building multi-disciplinary engineering projects on LIMO Hub.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} />
                  Joined {currentUser.joinedDate}
                </span>
                <span>&bull;</span>
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="limo-btn limo-btn-primary"
              style={{ gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Skills and Social Links */}
        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginRight: '0.4rem' }}>
              Specializations:
            </span>
            {(currentUser.skills || ['Systems Engineering', 'Algorithms']).map(s => (
              <span
                key={s}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.775rem',
                  fontWeight: 600
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {currentUser.githubUrl && (
              <a
                href={currentUser.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="limo-btn limo-btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.775rem', gap: '0.35rem' }}
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
            )}
            {currentUser.linkedinUrl && (
              <a
                href={currentUser.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="limo-btn limo-btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.775rem', gap: '0.35rem' }}
              >
                <Linkedin size={14} color="#0077b5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Developer Stats Strip (If Developer or Admin) */}
      {(currentUser.role === 'DEVELOPER' || currentUser.role === 'ADMIN') && (
        <div
          className="limo-glass-panel"
          style={{
            padding: '1.75rem 2rem',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Published Projects</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>{publishedDevProjects.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Review</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.2rem' }}>{pendingDevProjects.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cumulative Views</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              {developerProjects.reduce((acc, p) => acc + (p.views || 0), 0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Code Downloads</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
              {developerProjects.reduce((acc, p) => acc + (p.downloads || 0), 0)}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActiveTab('bookmarks')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderBottom: `2px solid ${activeTab === 'bookmarks' ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === 'bookmarks' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <Bookmark size={16} />
          <span>Bookmarked Projects ({bookmarkedProjects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('likes')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderBottom: `2px solid ${activeTab === 'likes' ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === 'likes' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <Heart size={16} />
          <span>Liked Projects ({likedProjects.length})</span>
        </button>

        {(currentUser.role === 'DEVELOPER' || currentUser.role === 'ADMIN') && (
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderBottom: `2px solid ${activeTab === 'projects' ? 'var(--primary)' : 'transparent'}`,
              color: activeTab === 'projects' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <Terminal size={16} />
            <span>My Authored Projects ({developerProjects.length})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderBottom: `2px solid ${activeTab === 'activity' ? 'var(--primary)' : 'transparent'}`,
            color: activeTab === 'activity' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <Clock size={16} />
          <span>Recent Activity</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarkedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <Bookmark size={40} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>You haven't bookmarked any engineering projects yet.</p>
                <button type="button" onClick={() => onNavigate('/projects')} className="limo-btn limo-btn-primary" style={{ marginTop: '1rem' }}>
                  Explore Projects to Bookmark
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {bookmarkedProjects.map(proj => (
                  <ProjectCard key={proj.id} project={proj} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div>
            {likedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <Heart size={40} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>No liked projects yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {likedProjects.map(proj => (
                  <ProjectCard key={proj.id} project={proj} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button type="button" onClick={() => onNavigate('/developer')} className="limo-btn limo-btn-primary">
                Open Developer Submission Console
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {developerProjects.map(proj => (
                <ProjectCard key={proj.id} project={proj} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="limo-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Personal Action Trail</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <Bookmark size={18} color="var(--primary)" />
                <div style={{ flex: 1, fontSize: '0.875rem' }}>
                  <span>Bookmarked </span>
                  <strong style={{ color: 'var(--text-primary)' }}>Autonomous Drone Swarm Perception</strong>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recent</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <Heart size={18} color="#f43f5e" />
                <div style={{ flex: 1, fontSize: '0.875rem' }}>
                  <span>Liked </span>
                  <strong style={{ color: 'var(--text-primary)' }}>Quantum Key Distribution (BB84) Simulator</strong>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yesterday</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <Award size={18} color="var(--accent)" />
                <div style={{ flex: 1, fontSize: '0.875rem' }}>
                  <span>Completed profile setup with engineering domain verification</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
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
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="limo-glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.25rem',
              borderRadius: '24px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Edit User Profile</h3>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Update your engineering identity &amp; links</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="limo-btn-ghost">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Display Name & Username */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Full Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={e => setEditAvatar(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              {/* Engineering Domain */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Primary Engineering Domain
                </label>
                <input
                  type="text"
                  value={editDomain}
                  onChange={e => setEditDomain(e.target.value)}
                  placeholder="e.g. Robotics, Computer Science, Quantum Computing"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              {/* Bio */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Professional Bio / Research Focus
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              {/* Skills */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Skills &amp; Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={e => setEditSkills(e.target.value)}
                  placeholder="e.g. ROS 2, PyTorch, C++, Docker, FreeRTOS"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              {/* Social URLs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={e => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={e => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Action Buttons: Save Changes & Cancel */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="limo-btn limo-btn-secondary"
                  style={{ minWidth: '100px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="limo-btn limo-btn-primary"
                  style={{ minWidth: '130px', gap: '0.45rem' }}
                >
                  <Check size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
