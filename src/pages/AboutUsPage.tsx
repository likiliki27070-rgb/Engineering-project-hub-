import React, { useEffect } from 'react';
import {
  Info, Target, Eye, Cpu, BookOpen, Layers, Users,
  Sparkles, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink
} from 'lucide-react';
import { Github, Linkedin, Twitter } from '../components/common/BrandIcons';
import { useProjects } from '../context/ProjectContext';
import { Logo } from '../components/common/Logo';

interface AboutUsPageProps {
  onNavigate: (route: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  const { creators, refreshCreators } = useProjects();

  useEffect(() => {
    refreshCreators();
  }, []);

  const visibleCreators = (creators || []).filter(c => c.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0));

  const platformPillars = [
    {
      title: 'Reproducible Engineering Builds',
      desc: 'Every project includes validated dependency matrices, containerized runtimes, and verified schematics.',
      icon: <Cpu size={24} color="var(--primary)" />
    },
    {
      title: 'Multi-Disciplinary Synthesis',
      desc: 'Seamlessly bridging robotics, AI, quantum computing, embedded firmware, and smart green grids.',
      icon: <Layers size={24} color="var(--accent)" />
    },
    {
      title: 'Verified Peer Review Workflows',
      desc: 'Projects submitted by student developers undergo structured technical review by academic leads.',
      icon: <ShieldCheck size={24} color="#34d399" />
    },
    {
      title: 'Open Source Community Ergonomics',
      desc: 'One-click access to downloadable CAD files, firmware binaries, datasets, and research notebooks.',
      icon: <Users size={24} color="#f59e0b" />
    }
  ];

  return (
    <div className="limo-container" style={{ padding: '3rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      {/* 1. HERO SECTION */}
      <section style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto', paddingTop: '1.5rem' }}>
        <div className="limo-badge limo-badge-primary" style={{ marginBottom: '1rem' }}>
          <Info size={14} />
          <span>Platform Overview &amp; Origins</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem' }}>
          About LIMO
        </h1>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Engineering Project Hub
        </div>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 400 }}>
          <strong>LIMO — Engineering Project Hub</strong> is an intelligent, open-access engineering ecosystem designed to help engineering students, researchers, and professional developers discover, explore, build, evaluate, and learn from state-of-the-art engineering projects.
        </p>
      </section>

      {/* 2. MISSION & VISION DUAL CARDS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Mission */}
        <div
          className="limo-glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.975rem' }}>
            To eliminate the friction between academic theory and physical reality. We empower engineers across universities and research laboratories worldwide to share transparent, reproducible code, hardware schematics, and simulation models that inspire the next generation of builders.
          </p>
        </div>

        {/* Vision */}
        <div
          className="limo-glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Our Vision</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.975rem' }}>
            To become the premier global central clearinghouse and collaborative network for multi-disciplinary engineering endeavors — from autonomous drones and quantum cryptography to bionic prosthetics and renewable microgrids.
          </p>
        </div>
      </section>

      {/* 3. WHAT LIMO PROVIDES */}
      <section>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>What LIMO Provides</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
            A comprehensive suite of tools built for engineering rigor, reproducibility, and cross-discipline collaboration.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {platformPillars.map(pillar => (
            <div key={pillar.title} className="limo-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {pillar.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MEET THE CREATORS SECTION (Dynamic from Admin Data!) */}
      <section id="creators">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
          <div className="limo-badge limo-badge-primary" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>The Team Behind The Vision</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Meet the Creators</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
            The architects, engineers, and researchers responsible for conceptualizing, building, and maintaining the LIMO Engineering Project Hub platform.
          </p>
        </div>

        {/* Creator Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {visibleCreators.map(creator => (
            <div
              key={creator.id}
              className="limo-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(var(--primary-rgb), 0.25)';
                e.currentTarget.style.borderColor = 'var(--border-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div>
                {/* Avatar with subtle glow and zoom */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '74px',
                      height: '74px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '2px solid var(--primary)',
                      boxShadow: '0 0 15px rgba(var(--primary-rgb), 0.35)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {creator.name}
                    </h3>
                    <div style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                      {creator.role}
                    </div>
                  </div>
                </div>

                {/* Short Bio */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {creator.shortBio}
                </p>

                {/* Key Contribution Highlight */}
                {creator.contribution && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
                      border: '1px solid rgba(var(--primary-rgb), 0.2)',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)',
                      marginBottom: '1.25rem',
                      lineHeight: 1.5
                    }}
                  >
                    <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '0.725rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      Key Contribution
                    </strong>
                    {creator.contribution}
                  </div>
                )}

                {/* Technologies / Skills Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                  {(creator.skills || []).map(skill => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                  {(creator.technologies || []).map(tech => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                        border: '1px solid rgba(var(--accent-rgb), 0.25)',
                        color: 'var(--accent)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links Footer */}
              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                {creator.github && (
                  <a
                    href={creator.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'color 0.15s ease'
                    }}
                    title="GitHub"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Github size={16} />
                  </a>
                )}
                {creator.linkedin && (
                  <a
                    href={creator.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'color 0.15s ease'
                    }}
                    title="LinkedIn"
                    onMouseEnter={e => (e.currentTarget.style.color = '#0077b5')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {creator.twitter && (
                  <a
                    href={creator.twitter}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'color 0.15s ease'
                    }}
                    title="Twitter / X"
                    onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Twitter size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROJECT ECOSYSTEM & CTA */}
      <section
        className="limo-glass-panel"
        style={{
          padding: '3rem 2rem',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-surface-elevated)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Explore the LIMO Project Hub Ecosystem
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
          Start browsing verified projects or submit your university/research project for peer review and showcase.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => onNavigate('/projects')}
            className="limo-btn limo-btn-primary"
            style={{ padding: '0.8rem 1.8rem', gap: '0.5rem' }}
          >
            <span>Explore Projects</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/developer')}
            className="limo-btn limo-btn-secondary"
            style={{ padding: '0.8rem 1.8rem' }}
          >
            <span>Developer Publishing Portal</span>
          </button>
        </div>
      </section>
    </div>
  );
};
