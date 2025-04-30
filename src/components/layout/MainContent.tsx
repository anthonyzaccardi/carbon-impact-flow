
import { ReactNode } from 'react';
import { useAppContext } from '@/contexts/useAppContext';

interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const { sidebarExpanded } = useAppContext();

  return (
    <main className="flex-1 relative">
      <div className="h-2 bg-primary w-full fixed z-10" />
      <div 
        className={`w-full min-h-screen pt-10 pb-6 transition-all duration-300
          ${sidebarExpanded ? 'ml-[260px]' : 'ml-16'}`}
      >
        <div className="px-6">
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
