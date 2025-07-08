import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navigation } from '../components/Navigation';
import '../styles/global.css';

interface RootLayoutProps {
  children?: React.ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const location = useLocation();
  
  // Don't show footer on auth pages
  const hideFooterPaths = ['/signin', '/signup'];
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="app-container">
      <header className="header">
        <Navigation />
      </header>
      
      <main className="main-content">
        {children || <Outlet />}
      </main>
      
      {shouldShowFooter && <Footer />}
    </div>
  );
}; 