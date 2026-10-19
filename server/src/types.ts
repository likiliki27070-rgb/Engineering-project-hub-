export type Role = 'ADMIN' | 'DEVELOPER' | 'USER';

export type ProjectStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Cutting-Edge';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar: string;
  bio?: string;
  engineeringDomain?: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  projectCount?: number;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon?: string;
}

export interface ProjectFile {
  name: string;
  size: string;
  type: string;
  downloadUrl: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  engineeringDomain: string;
  difficulty: DifficultyLevel;
  technologies: string[];
  programmingLanguages: string[];
  developerId: string;
  developerName: string;
  developerAvatar?: string;
  teamMembers?: string[];
  status: ProjectStatus;
  version: string;
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  markdownDoc?: string;
  images: string[];
  demoVideoUrl?: string;
  downloadFiles: ProjectFile[];
  requirements: string[];
  installation: string[];
  usage: string[];
  features: string[];
  futureImprovements: string[];
  tags: string[];
  isFeatured: boolean;
  featuredOrder?: number;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  developerId: string;
  developerName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  adminFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
}

export interface ProjectLike {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: Role;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'submission' | 'approval' | 'rejection' | 'comment';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Creator {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  skills: string[];
  technologies: string[];
  contribution: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeConfig {
  name: string;
  id: string;
  primaryColor: string;
  accentColor: string;
  borderRadius: string;
  glassIntensity: number;
  animationIntensity: number;
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  heroHeading: string;
  heroDescription: string;
  allowUserSubmissions: boolean;
  requireApproval: boolean;
  defaultTheme: string;
  contactEmail: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  projects: Project[];
  categories: Category[];
  technologies: Technology[];
  submissions: ProjectSubmission[];
  likes: ProjectLike[];
  bookmarks: Bookmark[];
  comments: Comment[];
  notifications: Notification[];
  creators: Creator[];
  settings: SiteSettings;
  activityLogs: ActivityLog[];
}
