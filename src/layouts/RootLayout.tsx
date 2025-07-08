import { Outlet, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { Footer } from '../components/Footer';

interface RootLayoutProps {
  children?: ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  const location = useLocation();
  
  // Don't show footer on auth pages
  const hideFooterPaths = ['/signin', '/signup'];
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}; 