import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Category, Creator, Notification, FilterState } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  categories: Category[];
  creators: Creator[];
  notifications: Notification[];
  unreadNotifsCount: number;
  isLoading: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  refreshProjects: () => Promise<void>;
  refreshCreators: () => Promise<void>;
  toggleLike: (projectId: string) => Promise<void>;
  toggleBookmark: (projectId: string) => Promise<void>;
  recordDownload: (project: Project, resourceName?: string) => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  moderateProject: (id: string, action: 'APPROVE' | 'REJECT' | 'TOGGLE_FEATURED', reason?: string) => Promise<void>;
  // Creator management
  addCreator: (data: Partial<Creator>) => Promise<Creator>;
  updateCreator: (id: string, data: Partial<Creator>) => Promise<Creator>;
  deleteCreator: (id: string) => Promise<void>;
  // Notification drawer state
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => Promise<void>;
}

const defaultFilters: FilterState = {
  search: '',
  category: 'All',
  technology: 'All',
  difficulty: 'All',
  sort: 'latest'
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const refreshProjects = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProjects({ allStatus: 'true' });
      setProjects(data);
    } catch (err) {
      console.warn('Failed to fetch projects, keeping local state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCreators = async () => {
    try {
      const data = await api.getCreators();
      setCreators(data);
    } catch (err) {
      console.warn('Failed to fetch creators:', err);
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.warn('Failed to fetch categories:', err);
    }
  };

  const refreshNotifications = async () => {
    try {
      const notifs = await api.getNotifications(currentUser?.id);
      setNotifications(notifs);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    refreshProjects();
    refreshCategories();
    refreshCreators();
    refreshNotifications();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      refreshNotifications();
    }
  }, [currentUser]);

  const resetFilters = () => setFilters(defaultFilters);

  const toggleLike = async (projectId: string) => {
    try {
      const res = await api.toggleLike(projectId, currentUser?.id);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, likes: res.likes } : p))
      );
    } catch (err) {
      // Local optimistic toggle
      setProjects(prev =>
        prev.map(p => {
          if (p.id === projectId) {
            const isLiked = currentUser?.likes?.includes(projectId);
            return { ...p, likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1 };
          }
          return p;
        })
      );
    }
  };

  const toggleBookmark = async (projectId: string) => {
    try {
      const res = await api.toggleBookmark(projectId, currentUser?.id);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, bookmarks: res.bookmarks } : p))
      );
    } catch (err) {
      // Local optimistic toggle
      setProjects(prev =>
        prev.map(p => {
          if (p.id === projectId) {
            const isBookmarked = currentUser?.bookmarks?.includes(projectId);
            return { ...p, bookmarks: isBookmarked ? Math.max(0, p.bookmarks - 1) : p.bookmarks + 1 };
          }
          return p;
        })
      );
    }
  };

  const recordDownload = async (project: Project, resourceName?: string) => {
    try {
      await api.recordDownload(project.id);
      setProjects(prev =>
        prev.map(p => (p.id === project.id ? { ...p, downloads: (p.downloads || 0) + 1 } : p))
      );

      // Create a friendly downloadable blob for simulation
      const filename = resourceName || `${project.slug}-v${project.version || '1.0'}.md`;
      const fileContent = `# ${project.title}
Version: ${project.version}
Category: ${project.category}
Engineering Domain: ${project.engineeringDomain}
Developer: ${project.developer?.name}
GitHub: ${project.githubUrl || 'N/A'}
Demo: ${project.demoUrl || 'N/A'}

## Overview
${project.fullDescription || project.shortDescription}

## Features
${(project.features || []).map(f => `- ${f}`).join('\n')}

## Prerequisites & Installation
${project.installation || 'Standard package installation instructions.'}

## Architecture & Schematics
${project.documentation || 'Refer to the official LIMO documentation tab.'}

---
Downloaded from LIMO — Engineering Project Hub
(c) LIMO Hub Engineering Community.
`;

      const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Download error:', err);
    }
  };

  const createProject = async (data: Partial<Project>): Promise<Project> => {
    const created = await api.createProject(data);
    setProjects(prev => [created, ...prev]);
    return created;
  };

  const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
    const updated = await api.updateProject(id, data);
    setProjects(prev => prev.map(p => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProject = async (id: string): Promise<void> => {
    await api.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const moderateProject = async (id: string, action: 'APPROVE' | 'REJECT' | 'TOGGLE_FEATURED', reason?: string): Promise<void> => {
    const res = await api.moderateProject(id, action, reason);
    setProjects(prev => prev.map(p => (p.id === id ? res.project : p)));
  };

  // Creator management
  const addCreator = async (data: Partial<Creator>): Promise<Creator> => {
    const created = await api.createCreator(data);
    setCreators(prev => [...prev, created]);
    return created;
  };

  const updateCreator = async (id: string, data: Partial<Creator>): Promise<Creator> => {
    const updated = await api.updateCreator(id, data);
    setCreators(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCreator = async (id: string): Promise<void> => {
    await api.deleteCreator(id);
    setCreators(prev => prev.filter(c => c.id !== id));
  };

  const markNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <ProjectContext.Provider
      value={{
        projects,
        categories,
        creators,
        notifications,
        unreadNotifsCount,
        isLoading,
        filters,
        setFilters,
        resetFilters,
        refreshProjects,
        refreshCreators,
        toggleLike,
        toggleBookmark,
        recordDownload,
        createProject,
        updateProject,
        deleteProject,
        moderateProject,
        addCreator,
        updateCreator,
        deleteCreator,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        markNotificationRead
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within a ProjectProvider');
  return context;
};
