import React from 'react';
import { X, Palette, Check, Sparkles, Sliders, Sun, Moon, Zap, Layers, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemePreset } from '../../types';

export const ThemeDrawer: React.FC = () => {
  const { themeConfig, setThemePreset, updateThemeConfig, isThemeDrawerOpen, setIsThemeDrawerOpen } = useTheme();

  if (!isThemeDrawerOpen) return null;

  const presets: Array<{ id: ThemePreset; name: string; desc: string; icon: React.ReactNode; bg: string; primary: string }> = [
    { id: 'dark', name: 'Dark Slate', desc: 'Default sleek midnight engineering palette', icon: <Moon size={16} />, bg: '#090d16', primary: '#38bdf8' },
    { id: 'light', name: 'Clean Light', desc: 'High-clarity technical daylight', icon: <Sun size={16} />, bg: '#f8fafc', primary: '#0284c7' },
    { id: 'midnight', name: 'OLED Midnight', desc: 'Ultra-deep space black & violet', icon: <Sparkles size={16} />, bg: '#030509', primary: '#6366f1' },
    { id: 'glass', name: 'Glassmorphism', desc: 'Heavy frosted blur with neon glows', icon: <Layers size={16} />, bg: '#080c14', primary: '#38bdf8' },
    { id: 'cyber', name: 'Cyberpunk', desc: 'High-energy cyan & electric gold', icon: <Zap size={16} />, bg: '#06080e', primary: '#00f3ff' },
    { id: 'aurora', name: 'Aurora Emerald', desc: 'Nordic emerald & purple spectral light', icon: <Sparkles size={16} />, bg: '#04110e', primary: '#10b981' },
    { id: 'minimal', name: 'Minimalist', desc: 'Monochrome architectural slate', icon: <Moon size={16} />, bg: '#111318', primary: '#94a3b8' },
    { id: 'high-contrast', name: 'High Contrast', desc: 'Bold accessibility monochrome', icon: <Sun size={16} />, bg: '#000000', primary: '#00ffff' }
  ];

  const primaryColors = [
    { label: 'Cyan Sky', value: '#38bdf8' },
    { label: 'Indigo', value: '#818cf8' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Amber Gold', value: '#f59e0b' },
    { label: 'Rose Pink', value: '#f43f5e' },
    { label: 'Violet', value: '#a855f7' }
  ];

  const borderRadii = [
    { label: 'Sharp (4px)', value: '4px' },
    { label: 'Modern (8px)', value: '8px' },
    { label: 'Smooth (14px)', value: '14px' },
    { label: 'Rounded (22px)', value: '22px' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(2, 6, 23, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={() => setIsThemeDrawerOpen(false)}
    >
      <div
        className="limo-glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderLeft: '1px solid var(--border-color)',
          borderRadius: 0,
          boxShadow: '-10px 0 35px rgba(0,0,0,0.5)',
          overflowY: 'auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Palette size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Theme Center</h2>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Real-time workspace appearance engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsThemeDrawerOpen(false)}
            style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
            className="limo-btn-ghost"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. Theme Presets Grid */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.85rem' }}>
            1. Select Theme Preset (8 Curated Styles)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {presets.map(p => {
              const isActive = themeConfig.preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setThemePreset(p.id)}
                  style={{
                    padding: '0.85rem 0.75rem',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(var(--primary-rgb), 0.12)' : 'var(--bg-card)',
                    border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: isActive ? 'var(--primary)' : 'var(--text-primary)', fontWeight: 700, fontSize: '0.875rem' }}>
                      {p.icon}
                      <span>{p.name}</span>
                    </div>
                    {isActive && <Check size={16} color="var(--primary)" />}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Primary Color Overrides */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.85rem' }}>
            2. Primary Accent Color
          </label>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {primaryColors.map(c => {
              const isSelected = themeConfig.primaryColor === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => updateThemeConfig({ primaryColor: c.value })}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: c.value,
                    border: `3px solid ${isSelected ? '#ffffff' : 'transparent'}`,
                    boxShadow: isSelected ? '0 0 12px ' + c.value : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={c.label}
                >
                  {isSelected && <Check size={16} color="#000000" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Glassmorphism Blur Intensity */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
              3. Glassmorphic Intensity
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{themeConfig.glassIntensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={themeConfig.glassIntensity}
            onChange={e => updateThemeConfig({ glassIntensity: Number(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        {/* 4. Border Radius */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>
            4. Interface Corner Radius
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {borderRadii.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => updateThemeConfig({ borderRadius: r.value as any })}
                style={{
                  padding: '0.55rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: r.value,
                  backgroundColor: themeConfig.borderRadius === r.value ? 'rgba(var(--primary-rgb), 0.15)' : 'var(--bg-card)',
                  border: `1px solid ${themeConfig.borderRadius === r.value ? 'var(--primary)' : 'var(--border-color)'}`,
                  color: themeConfig.borderRadius === r.value ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Animation Intensity */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>
            5. Animation & Motion Level
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['full', 'subtle', 'none'] as const).map(level => (
              <button
                key={level}
                type="button"
                onClick={() => updateThemeConfig({ animationIntensity: level })}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  backgroundColor: themeConfig.animationIntensity === level ? 'rgba(var(--primary-rgb), 0.15)' : 'var(--bg-card)',
                  border: `1px solid ${themeConfig.animationIntensity === level ? 'var(--primary)' : 'var(--border-color)'}`,
                  color: themeConfig.animationIntensity === level ? 'var(--primary)' : 'var(--text-secondary)',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Reset to defaults button */}
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="limo-btn limo-btn-secondary"
            onClick={() => setThemePreset('dark')}
            style={{ width: '100%', gap: '0.5rem' }}
          >
            <RefreshCw size={15} />
            <span>Reset to LIMO Dark Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
