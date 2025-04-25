
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAppContext } from '@/contexts/AppContext';
import SidePanel from '@/components/ui/side-panel';
import TrackForm from '@/components/forms/TrackForm';
import FactorForm from '@/components/forms/FactorForm';
import MeasurementForm from '@/components/forms/MeasurementForm';
import TargetForm from '@/components/forms/TargetForm';
import InitiativeForm from '@/components/forms/InitiativeForm';
import ScenarioForm from '@/components/forms/ScenarioForm';
import SupplierForm from '@/components/forms/SupplierForm';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarExpanded, sidePanel, closeSidePanel } = useAppContext();

  const renderSidePanelContent = () => {
    const { type, entityType, data } = sidePanel;

    if (entityType === 'track') {
      return (
        <TrackForm 
          mode={type} 
          initialData={data} 
          onClose={closeSidePanel}
        />
      );
    }
    
    if (entityType === 'factor') {
      return (
        <FactorForm 
          mode={type} 
          initialData={data} 
          onClose={closeSidePanel}
        />
      );
    }
    
    if (entityType === 'measurement') {
      return (
        <MeasurementForm 
          mode={type} 
          initialData={data} 
          onClose={closeSidePanel}
        />
      );
    }
    
    if (entityType === 'target') {
      return (
        <TargetForm 
          mode={type} 
          initialData={data} 
          onClose={closeSidePanel}
        />
      );
    }
    
    if (entityType === 'initiative') {
      return (
        <InitiativeForm 
          mode={type} 
          initialData={data} 
          onClose={closeSidePanel}
        />
      );
    }
    
    if (entityType === 'scenario') {
      return (
        <ScenarioForm 
          mode={type} 
          initialData={data} 
          onClose={closeSidePanel}
        />
      );
    }
    
    if (entityType === 'supplier') {
      return (
        <SupplierForm 
          mode={type} 
          initialData={data} 
          onClose={closeSidePanel}
        />
      );
    }
    
    return null;
  };
  
  const getPanelTitle = () => {
    const { type, entityType } = sidePanel;
    const action = type === 'create' ? 'Create' : type === 'edit' ? 'Edit' : 'View';
    const entity = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    
    return `${action} ${entity}`;
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main 
        className={`flex-1 overflow-auto content-transition
        ${sidebarExpanded ? 'ml-60' : 'ml-16'}`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
      
      <SidePanel
        title={getPanelTitle()}
        isOpen={sidePanel.isOpen}
        onClose={closeSidePanel}
      >
        {renderSidePanelContent()}
      </SidePanel>
    </div>
  );
};

export default MainLayout;
