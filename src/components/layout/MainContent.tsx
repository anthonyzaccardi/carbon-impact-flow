
import { ReactNode } from 'react';
import { useAppContext } from '@/contexts/AppContext';

interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const { sidebarExpanded } = useAppContext();

  return (
    <main className="flex-1 relative">
      <div 
        className={`w-full min-h-screen pt-6 pb-6 px-4 md:px-6 transition-all duration-300
          ${sidebarExpanded ? 'md:pl-64' : 'md:pl-20'}`}
      >
        {children}
      </div>
    </main>
  );
};

export default MainContent;
