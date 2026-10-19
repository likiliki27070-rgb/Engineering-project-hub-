import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw, Filter, Check } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

interface ProjectSearchFilterProps {
  totalResults: number;
}

export const ProjectSearchFilter: React.FC<ProjectSearchFilterProps> = ({ totalResults }) => {
  const { filters, setFilters, resetFilters, categories } = useProjects();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const sortOptions = [
    { label: 'Latest Added', value: 'latest' },
    { label: 'Most Viewed', value: 'most-viewed' },
    { label: 'Most Liked', value: 'most-liked' },
    { label: 'Most Bookmarked', value: 'most-bookmarked' },
    { label: 'Alphabetical (A-Z)', value: 'a-z' }
  ];

  const popularTechnologies = [
    'All', 'Python', 'TypeScript', 'C++', 'Rust', 'ROS 2', 'PyTorch', 'ESP32', 'Solidity', 'Docker', 'React', 'Qiskit'
  ];

  const popularSearches = ['ROS 2', 'Quantum', 'ESP32', 'Drone', 'eBPF', 'Smart Grid'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          className="limo-glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.45rem 1rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            backgroundColor: 'var(--bg-surface-elevated)'
          }}
        >
          <Search size={20} style={{ color: 'var(--primary)', marginRight: '0.75rem', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search engineering projects by title, technology, domain, tags..."
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.975rem',
              fontFamily: 'inherit'
            }}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              style={{ padding: '0.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 0.75rem' }} />

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="limo-btn limo-btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem', borderRadius: '10px' }}
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
          </button>
        </div>

        {/* Quick popular search tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Popular suggestions:</span>
          {popularSearches.map(term => (
            <button
              key={term}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, search: term }))}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.15rem 0.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.725rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filter Box */}
      {showAdvanced && (
        <div
          className="limo-glass-panel animate-fade-in"
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {/* Category Filter */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.45rem' }}>
                Engineering Category
              </label>
              <select
                value={filters.category}
                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Categories (20+ Branches)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Technology Filter */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.45rem' }}>
                Technology / Framework
              </label>
              <select
                value={filters.technology}
                onChange={e => setFilters(prev => ({ ...prev, technology: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {popularTechnologies.map(tech => (
                  <option key={tech} value={tech}>{tech === 'All' ? 'All Technologies' : tech}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.45rem' }}>
                Difficulty Level
              </label>
              <select
                value={filters.difficulty}
                onChange={e => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.45rem' }}>
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {sortOptions.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={resetFilters}
              className="limo-btn limo-btn-ghost"
              style={{ fontSize: '0.825rem', gap: '0.4rem' }}
            >
              <RotateCcw size={14} />
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Header Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <div>
          Showing <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{totalResults}</span> engineering projects
          {filters.category !== 'All' && <span> in <span style={{ color: 'var(--primary)' }}>{filters.category}</span></span>}
          {filters.search && <span> matching "<strong>{filters.search}</strong>"</span>}
        </div>

        {/* Quick sort dropdown for inline view */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="hidden sm:inline">Sort:</span>
          <select
            value={filters.sort}
            onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {sortOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
