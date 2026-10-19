import React, { useMemo } from 'react';
import { Compass, RotateCcw, Frown } from 'lucide-react';
import { ProjectCard } from '../components/project/ProjectCard';
import { ProjectSearchFilter } from '../components/project/ProjectSearchFilter';
import { useProjects } from '../context/ProjectContext';

interface ExplorePageProps {
  onNavigate: (route: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
  const { projects, filters, resetFilters, isLoading } = useProjects();

  // Filter and sort logic
  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => p.status === 'Published');

    // Category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        p => p.category.toLowerCase() === filters.category.toLowerCase() ||
             p.engineeringDomain.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Technology filter
    if (filters.technology && filters.technology !== 'All') {
      result = result.filter(p =>
        p.technologies && p.technologies.some(t => t.toLowerCase() === filters.technology.toLowerCase())
      );
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== 'All') {
      result = result.filter(p => p.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
          (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q))) ||
          (p.developer && p.developer.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters.sort === 'most-viewed') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filters.sort === 'most-liked') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (filters.sort === 'most-bookmarked') {
      result.sort((a, b) => (b.bookmarks || 0) - (a.bookmarks || 0));
    } else if (filters.sort === 'a-z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime());
    }

    return result;
  }, [projects, filters]);

  return (
    <div className="limo-container" style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Page Header */}
      <div>
        <div className="limo-badge limo-badge-primary" style={{ marginBottom: '0.5rem' }}>
          <Compass size={13} />
          <span>Project Explorer</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800 }}>Engineering Projects Hub</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.25rem', maxWidth: '650px' }}>
          Discover verified engineering prototypes, open hardware, algorithms, and simulation packages across every branch of technology.
        </p>
      </div>

      {/* Search & Filters */}
      <ProjectSearchFilter totalResults={filteredProjects.length} />

      {/* Projects Grid or Empty State */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
          <div className="animate-spin-slow" style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', marginBottom: '1rem' }} />
          <p>Loading projects from engineering repository...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className="limo-glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Frown size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>No engineering projects found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem' }}>
            No projects matched your active search query or filter criteria. Try resetting your filters to explore all available projects.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="limo-btn limo-btn-primary"
            style={{ gap: '0.5rem', marginTop: '0.5rem' }}
          >
            <RotateCcw size={16} />
            <span>Clear Filters &amp; Show All</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};
