
import { ReactNode, useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const { sidebarExpanded } = useAppContext();
  const location = useLocation();
  const [isChanging, setIsChanging] = useState(false);
  
  // Add page transition effect when location changes
  useEffect(() => {
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <main className="flex-1 relative">
      <div 
        className={cn(
          "w-full min-h-screen pt-6 pb-12 px-4 md:px-6 transition-all duration-300",
          sidebarExpanded ? 'md:pl-64' : 'md:pl-20',
          isChanging ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div 
          className={cn(
            "max-w-7xl mx-auto transition-all duration-500",
            isChanging ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
