import React, { useState, useEffect } from 'react';
import {
  Shield, BarChart3, Layers, PlusCircle, Users, Terminal, Tag, CheckCircle2,
  XCircle, AlertCircle, Trash2, Edit3, Eye, Download, Heart, Bookmark, Settings,
  Palette, FileText, ArrowUpRight, Search, Check, X, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Project, Creator, Category, User as UserType } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (route: string) => void;
  initialTab?: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, initialTab = 'dashboard' }) => {
  const {
    projects, categories, creators, refreshProjects, refreshCreators,
    deleteProject, moderateProject, addCreator, updateCreator, deleteCreator
  } = useProjects();
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Add/Edit Project Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Computer Science Engineering',
    engineeringDomain: 'Computer Science Engineering',
    difficulty: 'Intermediate',
    technologies: [],
    programmingLanguages: ['Python'],
    version: 'v1.0.0',
    githubUrl: '',
    demoUrl: '',
    status: 'Published',
    features: ['Modular architecture', 'High-throughput execution'],
    requirements: ['Node.js 18+', 'Docker runtime']
  });
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectMessage, setProjectMessage] = useState('');

  // Creator Modal State
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Partial<Creator> | null>(null);

  // Rejection Reason Modal
  const [rejectingProjectId, setRejectingProjectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Category State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Load analytics & users on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [aData, uData, lData] = await Promise.all([
          api.getAnalytics(),
          api.getUsers(),
          api.getActivityLogs()
        ]);
        setAnalyticsData(aData);
        setAllUsers(uData);
        setActivityLogs(lData);
      } catch (err) {
        console.warn('Admin fetch error:', err);
      }
    };
    fetchAdminData();
  }, []);

  const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLikes = projects.reduce((acc, p) => acc + (p.likes || 0), 0);
  const totalDownloads = projects.reduce((acc, p) => acc + (p.downloads || 0), 0);
  const pendingProjects = projects.filter(p => p.status === 'Pending');

  // Submit project handler
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    setIsSubmittingProject(true);
    try {
      await api.createProject({
        ...newProject,
        developer: {
          id: currentUser?.id || 'usr-admin',
          name: currentUser?.name || 'Administrator',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
        }
      });
      await refreshProjects();
      setProjectMessage('Project published successfully to LIMO Hub!');
      setTimeout(() => setProjectMessage(''), 3000);
      setNewProject({
        title: '',
        shortDescription: '',
        fullDescription: '',
        category: 'Computer Science Engineering',
        engineeringDomain: 'Computer Science Engineering',
        difficulty: 'Intermediate',
        technologies: [],
        programmingLanguages: ['Python'],
        version: 'v1.0.0',
        githubUrl: '',
        demoUrl: '',
        status: 'Published'
      });
    } catch (err: any) {
      alert(err.message || 'Error creating project');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Creator Save handler
  const handleSaveCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCreator?.name || !editingCreator?.role) return;
    try {
      if (editingCreator.id) {
        await updateCreator(editingCreator.id, editingCreator);
      } else {
        await addCreator(editingCreator);
      }
      await refreshCreators();
      setIsCreatorModalOpen(false);
      setEditingCreator(null);
    } catch (err: any) {
      alert(err.message || 'Error saving creator profile');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingProjectId) return;
    await moderateProject(rejectingProjectId, 'REJECT', rejectionReason || 'Revisions requested by Administrator.');
    setRejectingProjectId(null);
    setRejectionReason('');
    await refreshProjects();
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.createCategory({ name: newCategoryName.trim(), description: newCategoryDesc.trim() });
      setNewCategoryName('');
      setNewCategoryDesc('');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error adding category');
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard & Metrics', icon: <BarChart3 size={17} /> },
    { id: 'projects', label: `Projects (${projects.length})`, icon: <Layers size={17} /> },
    { id: 'submissions', label: `Submissions (${pendingProjects.length})`, icon: <CheckCircle2 size={17} />, badge: pendingProjects.length },
    { id: 'add-project', label: 'Add Project', icon: <PlusCircle size={17} /> },
    { id: 'creators', label: `Creator Management (${creators.length})`, icon: <Sparkles size={17} /> },
    { id: 'categories', label: `Categories (${categories.length})`, icon: <Tag size={17} /> },
    { id: 'users', label: `Users (${allUsers.length || 4})`, icon: <Users size={17} /> },
    { id: 'activity', label: 'Activity Logs', icon: <FileText size={17} /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={17} /> }
  ];

  return (
    <div className="limo-container" style={{ padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
      {/* Admin Warning Banner if not Admin */}
      {!isAdmin && (
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '12px', color: 'var(--warning)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>You are viewing Admin Dashboard in demo inspection mode. Use the persona switcher to test full Admin capabilities.</span>
        </div>
      )}

      {/* Main Admin Layout: Sidebar + Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="flex flex-col lg:grid">
        {/* Sidebar */}
        <aside
          className="limo-glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            alignSelf: 'flex-start'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>LIMO Admin</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>Command Console</span>
            </div>
          </div>

          {sidebarItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(var(--primary-rgb), 0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(var(--primary-rgb), 0.3)' : 'transparent'}`,
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textAlign: 'left',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span style={{ padding: '0.1rem 0.45rem', borderRadius: '9999px', backgroundColor: '#f59e0b', color: '#000', fontSize: '0.675rem', fontWeight: 800 }}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 1. DASHBOARD & METRICS TAB */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div className="limo-card" style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Projects</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>{projects.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem' }}>{projects.filter(p => p.status === 'Published').length} published active</div>
                </div>

                <div className="limo-card" style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Review</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.35rem' }}>{pendingProjects.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Requires Admin approval</div>
                </div>

                <div className="limo-card" style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Cumulative Views</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.35rem' }}>{totalViews}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Across all repositories</div>
                </div>

                <div className="limo-card" style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Code Downloads</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.35rem' }}>{totalDownloads}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Packages &amp; schematics</div>
                </div>
              </div>

              {/* Analytical Charts Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="limo-card" style={{ padding: '1.75rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Platform Views Growth</h4>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '160px', gap: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    {[
                      { m: 'May', h: '35%' },
                      { m: 'Jun', h: '50%' },
                      { m: 'Jul', h: '65%' },
                      { m: 'Aug', h: '80%' },
                      { m: 'Sep', h: '92%' },
                      { m: 'Oct', h: '100%' }
                    ].map(bar => (
                      <div key={bar.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '100%', height: bar.h, backgroundColor: 'var(--primary)', borderRadius: '6px 6px 0 0', opacity: 0.85 }} />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{bar.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="limo-card" style={{ padding: '1.75rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Engineering Categories</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {categories.slice(0, 5).map(cat => (
                      <div key={cat.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cat.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{projects.filter(p => p.category === cat.name).length} projects</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, (projects.filter(p => p.category === cat.name).length + 1) * 20)}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROJECTS MANAGEMENT TAB */}
          {activeTab === 'projects' && (
            <div className="limo-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Platform Projects Inventory</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Manage, publish, unpublish, and feature projects across the catalog.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('add-project')}
                  className="limo-btn limo-btn-primary"
                  style={{ gap: '0.45rem', fontSize: '0.85rem' }}
                >
                  <PlusCircle size={16} />
                  <span>Add Project</span>
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.725rem' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Project Title</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Author</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Views</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {p.title}
                          {p.isFeatured && (
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
                              Featured
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>{p.developer?.name || 'Engineer'}</td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span
                            className="limo-badge"
                            style={{
                              backgroundColor: p.status === 'Published' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                              color: p.status === 'Published' ? 'var(--success)' : 'var(--warning)',
                              fontSize: '0.675rem'
                            }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>{p.views || 0}</td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => onNavigate(`/projects/${p.slug || p.id}`)}
                              className="limo-btn-ghost"
                              style={{ padding: '0.35rem' }}
                              title="View project"
                            >
                              <Eye size={15} color="var(--primary)" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moderateProject(p.id, 'TOGGLE_FEATURED')}
                              className="limo-btn-ghost"
                              style={{ padding: '0.35rem' }}
                              title={p.isFeatured ? 'Unfeature' : 'Mark as Featured'}
                            >
                              <Sparkles size={15} color={p.isFeatured ? '#f59e0b' : 'var(--text-muted)'} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                  deleteProject(p.id);
                                }
                              }}
                              className="limo-btn-ghost"
                              style={{ padding: '0.35rem' }}
                              title="Delete project"
                            >
                              <Trash2 size={15} color="#f87171" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. SUBMISSIONS APPROVAL WORKFLOW TAB */}
          {activeTab === 'submissions' && (
            <div className="limo-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>Developer Submissions Workflow</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Review, approve, or reject projects submitted by verified developers for public indexing.
              </p>

              {pendingProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={40} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>All submissions are currently reviewed.</p>
                  <p style={{ fontSize: '0.85rem' }}>No projects are pending moderation.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {pendingProjects.map(proj => (
                    <div
                      key={proj.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ maxWidth: '600px' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span className="limo-badge limo-badge-warning">Pending Review</span>
                          <span className="limo-badge limo-badge-primary">{proj.category}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>{proj.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{proj.shortDescription}</p>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          Submitted by <strong>{proj.developer?.name || 'Developer'}</strong> &bull; Version {proj.version}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/projects/${proj.slug || proj.id}`)}
                          className="limo-btn limo-btn-secondary"
                          style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                        >
                          <Eye size={15} />
                          <span>Inspect</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingProjectId(proj.id)}
                          className="limo-btn limo-btn-danger"
                          style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                        >
                          <XCircle size={15} />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await moderateProject(proj.id, 'APPROVE');
                            await refreshProjects();
                          }}
                          className="limo-btn limo-btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', gap: '0.4rem' }}
                        >
                          <CheckCircle2 size={15} />
                          <span>Approve &amp; Publish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. CREATOR MANAGEMENT TAB (Part 2 Core requirement) */}
          {activeTab === 'creators' && (
            <div className="limo-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Creator Profile Management</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Control the creators displayed in the "Meet the Creators" section on the About Us page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCreator({
                      name: '',
                      role: 'Engineering Lead',
                      shortBio: '',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                      skills: ['Systems Design', 'Full-Stack'],
                      technologies: ['React', 'Node.js'],
                      contribution: '',
                      order: creators.length + 1,
                      isVisible: true
                    });
                    setIsCreatorModalOpen(true);
                  }}
                  className="limo-btn limo-btn-primary"
                  style={{ gap: '0.45rem', fontSize: '0.85rem' }}
                >
                  <PlusCircle size={16} />
                  <span>Add New Creator</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {creators.map(creator => (
                  <div
                    key={creator.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{creator.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{creator.role}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                        {creator.shortBio}
                      </p>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Status: <strong style={{ color: creator.isVisible !== false ? 'var(--success)' : 'var(--danger)' }}>{creator.isVisible !== false ? 'Visible on /about' : 'Hidden'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCreator(creator);
                          setIsCreatorModalOpen(true);
                        }}
                        className="limo-btn limo-btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', gap: '0.35rem' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Delete creator profile for ${creator.name}?`)) {
                            await deleteCreator(creator.id);
                            await refreshCreators();
                          }
                        }}
                        className="limo-btn limo-btn-danger"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ADD PROJECT TAB */}
          {activeTab === 'add-project' && (
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>Publish Official Engineering Project</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Fill out the technical specification fields to publish directly to the LIMO repository.
              </p>

              {projectMessage && (
                <div style={{ padding: '0.85rem 1.25rem', borderRadius: '10px', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'var(--success)', marginBottom: '1.5rem', fontWeight: 600 }}>
                  {projectMessage}
                </div>
              )}

              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Robotic Manipulator with Haptic Teleoperation"
                    value={newProject.title || ''}
                    onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      Category *
                    </label>
                    <select
                      value={newProject.category}
                      onChange={e => setNewProject(prev => ({ ...prev, category: e.target.value, engineeringDomain: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      Difficulty Level
                    </label>
                    <select
                      value={newProject.difficulty}
                      onChange={e => setNewProject(prev => ({ ...prev, difficulty: e.target.value as any }))}
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
                      Version
                    </label>
                    <input
                      type="text"
                      value={newProject.version || 'v1.0.0'}
                      onChange={e => setNewProject(prev => ({ ...prev, version: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Short Summary / Elevator Abstract *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newProject.shortDescription || ''}
                    onChange={e => setNewProject(prev => ({ ...prev, shortDescription: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Full Technical Description &amp; Methodology
                  </label>
                  <textarea
                    rows={5}
                    value={newProject.fullDescription || ''}
                    onChange={e => setNewProject(prev => ({ ...prev, fullDescription: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      GitHub / Repository URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={newProject.githubUrl || ''}
                      onChange={e => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://demo.example.com"
                      value={newProject.demoUrl || ''}
                      onChange={e => setNewProject(prev => ({ ...prev, demoUrl: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmittingProject}
                    className="limo-btn limo-btn-primary"
                    style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
                  >
                    {isSubmittingProject ? 'Publishing...' : 'Publish Official Project'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 6. CATEGORIES MANAGEMENT TAB */}
          {activeTab === 'categories' && (
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>Engineering Categories ({categories.length})</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Create and organize the 20+ supported engineering domains on LIMO Hub.
              </p>

              <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="New Category Name (e.g. Biomedical Nanotech)"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  style={{ flex: 1, minWidth: '220px', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={newCategoryDesc}
                  onChange={e => setNewCategoryDesc(e.target.value)}
                  style={{ flex: 2, minWidth: '260px', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button type="submit" className="limo-btn limo-btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                  Add Category
                </button>
              </form>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {categories.map(c => (
                  <div key={c.id} style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h5 style={{ fontSize: '0.925rem', fontWeight: 700, margin: 0 }}>{c.name}</h5>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{c.description || 'Engineering branch'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. USERS MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>Platform Users &amp; Roles</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Manage account permissions and roles across the LIMO platform.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {allUsers.map(u => (
                  <div key={u.id} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img src={u.avatar} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email} &bull; {u.engineeringDomain}</div>
                      </div>
                    </div>
                    <span className="limo-badge limo-badge-primary">{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. ACTIVITY LOGS TAB */}
          {activeTab === 'activity' && (
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>Audit &amp; Security Trail</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activityLogs.map(log => (
                  <div key={log.id} style={{ padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{log.user}: </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{log.action}</span>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>{log.details}</p>
                    </div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. SITE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="limo-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>Global Platform Configurations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '520px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Platform Main Title
                  </label>
                  <input type="text" readOnly value="LIMO" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Subtitle
                  </label>
                  <input type="text" readOnly value="Engineering Project Hub" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Project Moderation Mode
                  </label>
                  <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>Active (Developer Submissions require Admin review before publishing)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATOR EDIT/ADD MODAL (Part 2 requirement) */}
      {isCreatorModalOpen && editingCreator && (
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
          onClick={() => setIsCreatorModalOpen(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {editingCreator.id ? 'Edit Creator Profile' : 'Add New Creator to Meet the Creators'}
              </h3>
              <button type="button" onClick={() => setIsCreatorModalOpen(false)} className="limo-btn-ghost">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCreator} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Creator Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCreator.name || ''}
                  onChange={e => setEditingCreator(prev => ({ ...prev!, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Role (e.g. Founder, Lead Architect, AI/ML Specialist) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCreator.role || ''}
                  onChange={e => setEditingCreator(prev => ({ ...prev!, role: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={editingCreator.avatar || ''}
                  onChange={e => setEditingCreator(prev => ({ ...prev!, avatar: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Short Bio
                </label>
                <textarea
                  rows={2}
                  value={editingCreator.shortBio || ''}
                  onChange={e => setEditingCreator(prev => ({ ...prev!, shortBio: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Key Contribution to LIMO
                </label>
                <input
                  type="text"
                  value={editingCreator.contribution || ''}
                  onChange={e => setEditingCreator(prev => ({ ...prev!, contribution: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCreator.order || 1}
                    onChange={e => setEditingCreator(prev => ({ ...prev!, order: Number(e.target.value) }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={editingCreator.isVisible !== false}
                      onChange={e => setEditingCreator(prev => ({ ...prev!, isVisible: e.target.checked }))}
                    />
                    <span>Visible on About Us page</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setIsCreatorModalOpen(false)} className="limo-btn limo-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="limo-btn limo-btn-primary">
                  Save Creator Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingProjectId && (
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
          onClick={() => setRejectingProjectId(null)}
        >
          <div
            className="limo-glass-panel"
            style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-surface-elevated)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Request Developer Changes</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Provide constructive feedback to the developer detailing required technical revisions.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Please provide a requirements.txt and verify Gazebo simulation SITL steps."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', marginBottom: '1.25rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setRejectingProjectId(null)} className="limo-btn limo-btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmReject} className="limo-btn limo-btn-danger">
                Send Revisions Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
