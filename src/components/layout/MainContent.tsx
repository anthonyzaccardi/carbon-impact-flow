
import { ReactNode } from 'react';
import { useAppContext } from '@/contexts/useAppContext';

interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const { sidebarExpanded } = useAppContext();

  return (
    <main className="flex-1 relative ml-[230px]">
      {/* Trial notification banner */}
      <div className="trial-notification">
        <span>You have 7 days left in your Advanced trial</span>
        <button className="bg-[#333336] text-white px-3 py-1 rounded-md text-xs">Buy Intercom</button>
      </div>
      
      <div className="w-full p-6">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
