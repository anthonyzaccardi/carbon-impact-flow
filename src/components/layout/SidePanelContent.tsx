import TrackForm from '@/components/forms/TrackForm';
import FactorForm from '@/components/forms/FactorForm';
import MeasurementForm from '@/components/forms/MeasurementForm';
import TargetForm from '@/components/forms/TargetForm';
import InitiativeForm from '@/components/forms/InitiativeForm';
import ScenarioForm from '@/components/forms/ScenarioForm';
import SupplierForm from '@/components/forms/SupplierForm';
import { SidePanel } from '@/types';

interface SidePanelContentProps {
  sidePanel: SidePanel;
  onClose: () => void;
}

const SidePanelContent = ({ sidePanel, onClose }: SidePanelContentProps) => {
  const { type, entityType, data } = sidePanel;
  
  if (entityType === 'track') {
    return (
      <TrackForm 
        mode={type} 
        initialData={data} 
        onClose={onClose}
      />
    );
  }
  
  if (entityType === 'factor') {
    return (
      <FactorForm 
        mode={type} 
        initialData={data} 
        onClose={onClose}
      />
    );
  }
  
  if (entityType === 'measurement') {
    return (
      <MeasurementForm 
        mode={type} 
        initialData={data} 
        onClose={onClose}
      />
    );
  }
  
  if (entityType === 'target') {
    return (
      <TargetForm 
        mode={type} 
        initialData={data} 
        onClose={onClose}
      />
    );
  }
  
  if (entityType === 'initiative') {
    return (
      <InitiativeForm 
        mode={type} 
        initialData={data} 
        onClose={onClose}
      />
    );
  }
  
  if (entityType === 'scenario') {
    return (
      <ScenarioForm 
        mode={type} 
        initialData={data} 
        onClose={onClose}
      />
    );
  }
  
  if (entityType === 'supplier') {
    return (
      <SupplierForm 
        mode={type} 
        initialData={data} 
        onClose={onClose}
      />
    );
  }
  
  return null;
};

export default SidePanelContent;
