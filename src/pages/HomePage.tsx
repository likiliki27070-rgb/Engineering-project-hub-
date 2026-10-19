import React, { useState } from 'react';
import { ArrowRight, Sparkles, Terminal, Compass, TrendingUp, Layers, Cpu, Award, Users, BookOpen, ExternalLink, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { ProjectCard } from '../components/project/ProjectCard';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { projects, categories } = useProjects();
  const { isDeveloper, isAdmin } = useAuth();

  const publishedProjects = projects.filter(p => p.status === 'Published');
  const featuredProjects = publishedProjects.filter(p => p.isFeatured).slice(0, 3);
  const trendingProjects = [...publishedProjects].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
  const recentProjects = [...publishedProjects].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()).slice(0, 3);

  const stats = [
    { label: 'Verified Projects', value: '140+', icon: <Layers size={22} color="var(--primary)" /> },
    { label: 'Engineering Disciplines', value: '20+', icon: <BookOpen size={22} color="var(--accent)" /> },
    { label: 'Active Developers', value: '850+', icon: <Users size={22} color="#34d399" /> },
    { label: 'Resource Downloads', value: '24.5K', icon: <Cpu size={22} color="#f59e0b" /> }
  ];

  const popularTechs = [
    'ROS 2', 'Python', 'Qiskit', 'Rust', 'ESP32', 'C++', 'PyTorch', 'Docker', 'Solidity', 'FastAPI', 'FreeRTOS', 'OpenCV'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 4rem 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Glow ambient background aura */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '350px',
            background: 'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.22) 0%, rgba(var(--accent-rgb), 0.12) 40%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="limo-container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Top Pill Announcement */}
          <div
            onClick={() => onNavigate('/about')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
              border: '1px solid rgba(var(--primary-rgb), 0.3)',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '2rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Sparkles size={14} />
            <span>Welcome to the Official LIMO Engineering Ecosystem &bull; Meet the Creators</span>
            <ChevronRight size={14} />
          </div>

          {/* Large Hero Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h1
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1.05,
                background: 'linear-gradient(135deg, #ffffff 20%, var(--primary) 70%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              LIMO
            </h1>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '0.25rem'
              }}
            >
              Engineering Project Hub
            </div>
          </div>

          {/* Subtitle / Description */}
          <p
            style={{
              maxWidth: '720px',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              fontWeight: 400
            }}
          >
            Discover, explore, build and manage engineering projects in one intelligent platform.
          </p>

          {/* Action Buttons: Explore Projects & Developer Portal */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => onNavigate('/projects')}
              className="limo-btn limo-btn-primary"
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', gap: '0.65rem' }}
            >
              <Compass size={20} />
              <span>Explore Projects</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/developer')}
              className="limo-btn limo-btn-secondary"
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', gap: '0.65rem' }}
            >
              <Terminal size={20} style={{ color: 'var(--accent)' }} />
              <span>Developer Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM STATISTICS COUNTER */}
      <section className="limo-container">
        <div
          className="limo-glass-panel"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-surface-elevated)'
          }}
        >
          {stats.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {s.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PROJECTS SECTION */}
      {featuredProjects.length > 0 && (
        <section className="limo-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <div className="limo-badge limo-badge-primary" style={{ marginBottom: '0.5rem' }}>
                <Award size={13} />
                <span>Curated Showcase</span>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Featured Projects</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Peer-reviewed research and high-impact engineering solutions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/projects?filter=featured')}
              className="limo-btn limo-btn-ghost"
              style={{ gap: '0.4rem', color: 'var(--primary)', fontWeight: 600 }}
            >
              <span>View All Featured</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {featuredProjects.map(proj => (
              <ProjectCard key={proj.id} project={proj} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* 4. ENGINEERING DOMAINS SECTION (20+ Branches) */}
      <section id="domains" className="limo-container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem auto' }}>
          <div className="limo-badge limo-badge-accent" style={{ marginBottom: '0.75rem' }}>
            <BookOpen size={13} />
            <span>Multi-Disciplinary Scope</span>
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Explore Engineering Domains</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
            LIMO indexes reproducible projects across 20+ specialized engineering faculties.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {categories.slice(0, 12).map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/projects?category=${encodeURIComponent(cat.name)}`)}
              className="limo-card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Domain
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {projects.filter(p => p.category === cat.name || p.engineeringDomain === cat.name).length} Projects
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {cat.name}
                </h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {cat.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.775rem', fontWeight: 600, marginTop: '1rem' }}>
                <span>Explore branch</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            type="button"
            onClick={() => onNavigate('/projects')}
            className="limo-btn limo-btn-secondary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <span>View All 20+ Engineering Disciplines</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* 5. TRENDING & RECENTLY ADDED DUAL GRID */}
      <section className="limo-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Trending */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Trending Projects</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {trendingProjects.map(proj => (
                <ProjectCard key={proj.id} project={proj} onNavigate={onNavigate} />
              ))}
            </div>
          </div>

          {/* Recently Added */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Sparkles size={22} color="var(--accent)" />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Recently Added</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recentProjects.map(proj => (
                <ProjectCard key={proj.id} project={proj} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. POPULAR TECHNOLOGIES STRIP */}
      <section className="limo-container">
        <div
          className="limo-glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-surface-elevated)',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Popular Technologies in the Hub
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            From ROS 2 and eBPF to Qiskit and FreeRTOS, filter projects by your preferred toolchain.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {popularTechs.map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => onNavigate(`/projects?technology=${encodeURIComponent(tech)}`)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION / DEVELOPER SPOTLIGHT */}
      <section className="limo-container">
        <div
          className="limo-glass-panel"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '4rem 2rem',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(18, 25, 43, 0.9) 0%, rgba(30, 41, 74, 0.85) 100%)',
            border: '1px solid var(--border-glow)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '300px',
              background: 'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.25) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}
          />

          <div className="limo-badge limo-badge-primary" style={{ marginBottom: '1rem' }}>
            <ShieldCheck size={14} />
            <span>Developer Publishing Ecosystem</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', maxWidth: '650px' }}>
            Ready to Publish Your Engineering Innovations?
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6, marginBottom: '2rem' }}>
            Join thousands of student engineers and verified researchers. Submit projects for peer review, distribute code packages, and track live analytics.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => onNavigate('/developer')}
              className="limo-btn limo-btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem', gap: '0.6rem' }}
            >
              <Terminal size={18} />
              <span>Go to Developer Portal</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/about')}
              className="limo-btn limo-btn-secondary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              <span>Learn More About LIMO</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
