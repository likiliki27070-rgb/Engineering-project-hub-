import React from 'react';
import { Eye, Heart, Bookmark, ArrowUpRight, Cpu, User } from 'lucide-react';
import { Project } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';

interface ProjectCardProps {
  project: Project;
  onNavigate: (route: string) => void;
  onQuickView?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onNavigate }) => {
  const { toggleLike, toggleBookmark } = useProjects();
  const { currentUser } = useAuth();

  const isLiked = currentUser?.likes?.includes(project.id);
  const isBookmarked = currentUser?.bookmarks?.includes(project.id);

  const difficultyColors = {
    Beginner: 'var(--success)',
    Intermediate: 'var(--primary)',
    Advanced: 'var(--accent)',
    Expert: '#f59e0b'
  };

  const handleCardClick = () => {
    onNavigate(`/projects/${project.slug || project.id}`);
  };

  return (
    <div
      className="limo-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
    >
      {/* Thumbnail Banner */}
      <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
        <img
          src={project.images && project.images[0] ? project.images[0] : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80'}
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.2) 60%, transparent 100%)'
          }}
        />

        {/* Top Floating Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span
            className="limo-badge"
            style={{
              backgroundColor: 'rgba(9, 13, 22, 0.75)',
              backdropFilter: 'blur(8px)',
              borderColor: 'var(--border-color)',
              color: 'var(--primary)',
              fontSize: '0.7rem'
            }}
          >
            {project.category}
          </span>

          <span
            className="limo-badge"
            style={{
              backgroundColor: 'rgba(9, 13, 22, 0.75)',
              backdropFilter: 'blur(8px)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: difficultyColors[project.difficulty] || 'var(--text-secondary)',
              fontSize: '0.675rem'
            }}
          >
            {project.difficulty}
          </span>
        </div>

        {/* Floating Quick Action Buttons on image */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 2
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => toggleBookmark(project.id)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(9, 13, 22, 0.8)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isBookmarked ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)'}`,
              color: isBookmarked ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Project'}
          >
            <Bookmark size={15} fill={isBookmarked ? 'var(--primary)' : 'none'} />
          </button>

          <button
            type="button"
            onClick={() => toggleLike(project.id)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(9, 13, 22, 0.8)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isLiked ? '#f43f5e' : 'rgba(255, 255, 255, 0.2)'}`,
              color: isLiked ? '#f43f5e' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={isLiked ? 'Unlike' : 'Like Project'}
          >
            <Heart size={15} fill={isLiked ? '#f43f5e' : 'none'} />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1.35,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {project.shortDescription}
          </p>

          {/* Tech stack badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {(project.technologies || []).slice(0, 3).map(tech => (
              <span
                key={tech}
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                {tech}
              </span>
            ))}
            {(project.technologies?.length || 0) > 3 && (
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                +{(project.technologies?.length || 0) - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer Meta: Developer and Metrics */}
        <div
          style={{
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          {/* Developer Avatar & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={project.developer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={project.developer?.name || 'Developer'}
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)', maxWidth: '90px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {project.developer?.name || 'Engineer'}
            </span>
          </div>

          {/* Views & Likes stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={13} />
              {project.views || 0}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Heart size={13} color={isLiked ? '#f43f5e' : 'currentColor'} />
              {project.likes || 0}
            </span>
            <ArrowUpRight size={14} style={{ color: 'var(--primary)', marginLeft: '0.2rem' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
