export type Role = 'ADMIN' | 'DEVELOPER' | 'USER';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  avatar: string;
  bio?: string;
  engineeringDomain?: string;
  skills?: string[];
  joinedDate: string;
  githubUrl?: string;
  linkedinUrl?: string;
  theme?: string;
  bookmarks?: string[];
  likes?: string[];
}

export interface Creator {
  id: string;
  name: string;
  role: string;
  shortBio: string;
  avatar: string;
  skills: string[];
  technologies: string[];
  contribution: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  order: number;
  isVisible: boolean;
}

export interface DownloadResource {
  name: string;
  size: string;
  type: string;
  filename: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  engineeringDomain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  technologies: string[];
  programmingLanguages: string[];
  projectType: string;
  developer: {
    id: string;
    name: string;
    avatar: string;
  };
  teamMembers?: string[];
  status: 'Draft' | 'Pending' | 'Published' | 'Rejected';
  rejectionReason?: string;
  isFeatured?: boolean;
  featuredOrder?: number;
  version: string;
  githubUrl?: string;
  demoUrl?: string;
  demoVideoUrl?: string;
  images: string[];
  features: string[];
  requirements: string[];
  installation: string;
  usage: string;
  documentation: string;
  downloadResources: DownloadResource[];
  tags: string[];
  createdDate: string;
  updatedDate: string;
  views: number;
  likes: number;
  bookmarks: number;
  downloads: number;
  comments?: Comment[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  description: string;
}

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: Role;
  content: string;
  createdDate: string;
  likes: number;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}

export type ThemePreset =
  | 'dark'
  | 'light'
  | 'midnight'
  | 'glass'
  | 'cyber'
  | 'aurora'
  | 'minimal'
  | 'high-contrast';

export interface ThemeConfig {
  preset: ThemePreset;
  primaryColor: string;
  accentColor: string;
  backgroundStyle: 'mesh' | 'grid' | 'dots' | 'solid';
  cardAppearance: 'glass' | 'solid' | 'bordered' | 'neon';
  borderRadius: '4px' | '8px' | '14px' | '22px' | '9999px';
  glassIntensity: number; // 0 - 100
  animationIntensity: 'full' | 'subtle' | 'none';
}

export interface FilterState {
  search: string;
  category: string;
  technology: string;
  difficulty: string;
  sort: string;
}
