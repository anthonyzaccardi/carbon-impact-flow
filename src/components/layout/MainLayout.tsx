
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useAppContext } from '@/contexts/AppContext';
import SidePanel from '@/components/ui/side-panel';
import SidePanelContent from './SidePanelContent';
import { getSidePanelTitle } from '@/utils/side-panel-utils';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidePanel, closeSidePanel } = useAppContext();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <MainContent>{children}</MainContent>
      
      <SidePanel
        title={getSidePanelTitle(sidePanel)}
        isOpen={sidePanel.isOpen}
        onClose={closeSidePanel}
      >
        <SidePanelContent 
          sidePanel={sidePanel} 
          onClose={closeSidePanel}
        />
      </SidePanel>
    </div>
  );
};

export default MainLayout;
