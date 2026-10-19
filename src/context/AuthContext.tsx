import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDeveloper: boolean;
  isUser: boolean;
  login: (email?: string, password?: string, userId?: string) => Promise<User>;
  register: (data: Partial<User> & { password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  switchUserRole: (role: Role) => Promise<User>;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo users matching backend seed
const DEMO_USERS: Record<Role, Partial<User>> = {
  ADMIN: {
    id: 'usr-admin',
    name: 'Dr. Sarah Vance',
    username: 'admin_sarah',
    email: 'admin@limo.hub',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Chief Academic Officer & Lead Systems Architect at LIMO.',
    engineeringDomain: 'Computer Science Engineering',
    skills: ['Distributed Systems', 'Platform Governance', 'Kubernetes'],
    joinedDate: '2024-01-10',
    bookmarks: ['proj-1', 'proj-3', 'proj-6'],
    likes: ['proj-1', 'proj-2', 'proj-4']
  },
  DEVELOPER: {
    id: 'usr-dev-1',
    name: 'Alex Rivera',
    username: 'alex_robotics',
    email: 'alex@limo.hub',
    role: 'DEVELOPER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Autonomous robotics researcher & ROS2 developer.',
    engineeringDomain: 'Robotics',
    skills: ['ROS 2', 'C++', 'Python', 'SLAM', 'PyTorch'],
    joinedDate: '2024-02-14',
    githubUrl: 'https://github.com/alexrivera-eng',
    linkedinUrl: 'https://linkedin.com/in/alexrivera-eng',
    bookmarks: ['proj-2', 'proj-4'],
    likes: ['proj-1', 'proj-3']
  },
  USER: {
    id: 'usr-student',
    name: 'Elena Rostova',
    username: 'elena_eng',
    email: 'student@limo.hub',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    bio: 'Senior Electrical & Embedded Systems student.',
    engineeringDomain: 'Embedded Systems',
    skills: ['C', 'ESP32', 'PCB Design', 'MATLAB'],
    joinedDate: '2024-05-18',
    bookmarks: ['proj-1', 'proj-2', 'proj-5'],
    likes: ['proj-1', 'proj-3', 'proj-4']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('limo_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse current user from localStorage', e);
    }
    // Default to student user initially so the site is instantly interactive
    return DEMO_USERS.USER as User;
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('limo_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('limo_current_user');
      localStorage.removeItem('limo_auth_token');
    }
  }, [currentUser]);

  const login = async (email?: string, password?: string, userId?: string): Promise<User> => {
    try {
      const res = await api.login({ email, password, userId });
      setCurrentUser(res.user);
      localStorage.setItem('limo_auth_token', res.token);
      return res.user;
    } catch (err) {
      // Fallback matching demo user if backend is reconnecting
      const matched = Object.values(DEMO_USERS).find(
        u => (email && u.email?.toLowerCase() === email.toLowerCase()) || (userId && u.id === userId)
      ) as User;
      if (matched) {
        setCurrentUser(matched);
        localStorage.setItem('limo_auth_token', `demo-token-${matched.id}`);
        return matched;
      }
      throw err;
    }
  };

  const register = async (data: Partial<User> & { password?: string }): Promise<User> => {
    try {
      const res = await api.register(data);
      setCurrentUser(res.user);
      localStorage.setItem('limo_auth_token', res.token);
      return res.user;
    } catch (err) {
      // Offline fallback
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name || 'New Member',
        username: data.username || 'member',
        email: data.email || 'user@limo.hub',
        role: data.role || 'USER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
        engineeringDomain: data.engineeringDomain || 'Computer Science Engineering',
        skills: data.skills || ['Engineering Foundations'],
        joinedDate: new Date().toISOString().split('T')[0],
        bookmarks: [],
        likes: []
      };
      setCurrentUser(newUser);
      return newUser;
    }
  };

  const logout = async () => {
    try {
      if (currentUser?.id) {
        await api.logout(currentUser.id);
      }
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('limo_current_user');
      localStorage.removeItem('limo_auth_token');
      setIsLogoutModalOpen(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!currentUser) throw new Error('Not logged in');
    try {
      const updated = await api.updateUserProfile(currentUser.id, updates);
      setCurrentUser(updated);
      return updated;
    } catch (err) {
      const localUpdated = { ...currentUser, ...updates };
      setCurrentUser(localUpdated);
      return localUpdated;
    }
  };

  const switchUserRole = async (role: Role): Promise<User> => {
    const demo = DEMO_USERS[role] as User;
    try {
      await api.login({ userId: demo.id });
    } catch (err) {
      console.warn('Switch role API note:', err);
    }
    setCurrentUser(demo);
    localStorage.setItem('limo_auth_token', `demo-token-${demo.id}`);
    return demo;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'ADMIN',
        isDeveloper: currentUser?.role === 'DEVELOPER' || currentUser?.role === 'ADMIN',
        isUser: !!currentUser,
        login,
        register,
        logout,
        updateProfile,
        switchUserRole,
        isLogoutModalOpen,
        setIsLogoutModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
