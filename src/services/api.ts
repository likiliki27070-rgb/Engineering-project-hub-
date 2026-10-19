import { Project, User, Creator, Category, Notification, ActivityLog } from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (data: { email?: string; password?: string; userId?: string }) =>
    fetchJSON<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  register: (data: Partial<User> & { password?: string }) =>
    fetchJSON<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  logout: (userId?: string) =>
    fetchJSON<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ userId })
    }),

  forgotPassword: (email: string) =>
    fetchJSON<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  // Projects
  getProjects: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return fetchJSON<Project[]>(`/projects${query ? `?${query}` : ''}`);
  },

  getProjectByIdOrSlug: (idOrSlug: string) =>
    fetchJSON<Project>(`/projects/${idOrSlug}`),

  createProject: (data: Partial<Project>) =>
    fetchJSON<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateProject: (id: string, data: Partial<Project>) =>
    fetchJSON<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteProject: (id: string) =>
    fetchJSON<{ success: boolean; message: string }>(`/projects/${id}`, {
      method: 'DELETE'
    }),

  toggleLike: (projectId: string, userId?: string) =>
    fetchJSON<{ likes: number; userLikes: string[] }>(`/projects/${projectId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    }),

  toggleBookmark: (projectId: string, userId?: string) =>
    fetchJSON<{ bookmarks: number; userBookmarks: string[] }>(`/projects/${projectId}/bookmark`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    }),

  recordDownload: (projectId: string) =>
    fetchJSON<{ success: boolean; downloads: number; message: string }>(`/projects/${projectId}/download`, {
      method: 'POST'
    }),

  addComment: (projectId: string, data: { userId: string; userName: string; userAvatar: string; userRole: string; content: string }) =>
    fetchJSON<any>(`/projects/${projectId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  moderateProject: (projectId: string, action: 'APPROVE' | 'REJECT' | 'TOGGLE_FEATURED', rejectionReason?: string) =>
    fetchJSON<{ success: boolean; project: Project }>(`/projects/${projectId}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ action, rejectionReason })
    }),

  // Creators
  getCreators: () =>
    fetchJSON<Creator[]>('/creators'),

  getAllCreators: () =>
    fetchJSON<Creator[]>('/creators/all'),

  createCreator: (data: Partial<Creator>) =>
    fetchJSON<Creator>('/creators', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateCreator: (id: string, data: Partial<Creator>) =>
    fetchJSON<Creator>(`/creators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteCreator: (id: string) =>
    fetchJSON<{ success: boolean; message: string }>(`/creators/${id}`, {
      method: 'DELETE'
    }),

  // Users
  getUsers: () =>
    fetchJSON<User[]>('/users'),

  getUserProfile: (id: string) =>
    fetchJSON<User & { projects: Project[]; bookmarkedProjects: Project[]; likedProjects: Project[] }>(`/users/${id}`),

  updateUserProfile: (id: string, data: Partial<User>) =>
    fetchJSON<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Categories & Tech
  getCategories: () =>
    fetchJSON<Category[]>('/categories'),

  createCategory: (data: { name: string; icon?: string; description?: string }) =>
    fetchJSON<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteCategory: (id: string) =>
    fetchJSON<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE'
    }),

  getTechnologies: () =>
    fetchJSON<string[]>('/technologies'),

  // Analytics & Logs
  getAnalytics: () =>
    fetchJSON<any>('/analytics'),

  getNotifications: (userId?: string) =>
    fetchJSON<Notification[]>(`/notifications${userId ? `?userId=${userId}` : ''}`),

  markNotificationRead: (id: string) =>
    fetchJSON<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PUT'
    }),

  getActivityLogs: () =>
    fetchJSON<ActivityLog[]>('/activity-logs'),

  getSettings: () =>
    fetchJSON<any>('/settings'),

  updateSettings: (data: any) =>
    fetchJSON<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};
