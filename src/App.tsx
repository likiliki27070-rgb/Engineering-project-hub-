import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { IntroAnimation } from './components/layout/IntroAnimation';
import { BackgroundCanvas } from './components/common/BackgroundCanvas';
import { ThemeDrawer } from './components/theme/ThemeDrawer';
import { NotificationDrawer } from './components/notification/NotificationDrawer';
import { LogoutConfirmModal } from './components/layout/LogoutConfirmModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DeveloperPortalPage } from './pages/DeveloperPortalPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simple, robust client router
  const renderCurrentPage = () => {
    const path = currentPath.split('?')[0];

    // Project Details route: /projects/:idOrSlug
    if (path.startsWith('/projects/') && path.length > 10) {
      const idOrSlug = path.replace('/projects/', '');
      return <ProjectDetailsPage idOrSlug={idOrSlug} onNavigate={navigate} />;
    }

    switch (path) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/projects':
        return <ExplorePage onNavigate={navigate} />;
      case '/about':
        return <AboutUsPage onNavigate={navigate} />;
      case '/profile':
        return <ProfilePage onNavigate={navigate} />;
      case '/settings':
        return <SettingsPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;
      case '/admin':
        return <AdminDashboardPage onNavigate={navigate} />;
      case '/developer':
        return <DeveloperPortalPage onNavigate={navigate} />;
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Cinematic Intro Animation on Load */}
      <IntroAnimation />

      {/* Dynamic Interactive Background Mesh */}
      <BackgroundCanvas />

      {/* Main Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => navigate('/projects')}
        onOpenEditProfile={() => navigate('/profile?edit=true')}
      />

      {/* Main Dynamic View */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {renderCurrentPage()}
      </main>

      {/* Complete Footer */}
      <Footer onNavigate={navigate} />

      {/* Universal Floating Overlays & Drawers */}
      <ThemeDrawer />
      <NotificationDrawer onNavigate={navigate} />
      <LogoutConfirmModal onConfirm={() => navigate('/login')} />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
