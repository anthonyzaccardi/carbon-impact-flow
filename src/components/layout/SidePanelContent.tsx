import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import TrackForm from '@/components/forms/TrackForm';
import FactorForm from '@/components/forms/FactorForm';
import MeasurementForm from '@/components/forms/MeasurementForm';
import TargetForm from '@/components/forms/TargetForm';
import InitiativeForm from '@/components/forms/initiatives/InitiativeForm';
import ScenarioForm from '@/components/forms/ScenarioForm';
import SupplierForm from '@/components/forms/SupplierForm';
import { SidePanel } from '@/types';
import { useAppContext } from '@/contexts/useAppContext';

interface SidePanelContentProps {
  sidePanel: SidePanel;
  onClose: () => void;
}

const SidePanelContent = ({ sidePanel, onClose }: SidePanelContentProps) => {
  const { type, entityType, data } = sidePanel;
  const { 
    deleteTrack, 
    deleteFactor, 
    deleteMeasurement, 
    deleteTarget, 
    deleteInitiative, 
    deleteScenario,
    deleteSupplier,
    openSidePanel,
    measurements,
    targets,
    initiatives,
    getInitiativesByTargetId
  } = useAppContext();
  
  const handleDelete = () => {
    if (!data) return;
    
    switch (entityType) {
      case 'track':
        deleteTrack(data.id);
        break;
      case 'factor':
        deleteFactor(data.id);
        break;
      case 'measurement':
        deleteMeasurement(data.id);
        break;
      case 'target':
        deleteTarget(data.id);
        break;
      case 'initiative':
        deleteInitiative(data.id);
        break;
      case 'scenario':
        deleteScenario(data.id);
        break;
      case 'supplier':
        deleteSupplier(data.id);
        break;
    }
    onClose();
  };
  
  const handleEdit = () => {
    if (!data) return;
    openSidePanel('edit', entityType, data);
  };
  
  const renderActionButtons = () => {
    if (type !== 'view') return null;
    
    return (
      <div className="flex gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center" 
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center" 
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    );
  };
  
  const renderRelatedEntities = () => {
    if (type !== 'view' || !data) return null;
    
    switch (entityType) {
      case 'factor':
        const factorMeasurements = measurements.filter(m => m.factorId === data.id);
        if (factorMeasurements.length === 0) return null;
        
        return (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Related Measurements</h3>
            <div className="space-y-2">
              {factorMeasurements.map(measurement => (
                <div 
                  key={measurement.id} 
                  className="p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted"
                  onClick={() => openSidePanel('view', 'measurement', measurement)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{new Date(measurement.date).toLocaleDateString()}</div>
                    <div>{measurement.quantity} {measurement.unit}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Calculated: {measurement.calculatedValue} tCO₂e
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'target':
        const targetInitiatives = getInitiativesByTargetId(data.id);
        if (targetInitiatives.length === 0) return null;
        
        return (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Related Initiatives</h3>
            <div className="space-y-2">
              {targetInitiatives.map(initiative => (
                <div 
                  key={initiative.id} 
                  className="p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted"
                  onClick={() => openSidePanel('view', 'initiative', initiative)}
                >
                  <div className="font-medium">{initiative.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Plan: {initiative.plan} • Status: {initiative.status.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  let formComponent = null;
  
  if (entityType === 'track') {
    formComponent = (
      <>
        {renderActionButtons()}
        <TrackForm 
          mode={type} 
          initialData={data} 
          onClose={onClose}
        />
        {renderRelatedEntities()}
      </>
    );
  }
  
  else if (entityType === 'factor') {
    formComponent = (
      <>
        {renderActionButtons()}
        <FactorForm 
          mode={type} 
          initialData={data} 
          onClose={onClose}
        />
        {renderRelatedEntities()}
      </>
    );
  }
  
  else if (entityType === 'measurement') {
    formComponent = (
      <>
        {renderActionButtons()}
        <MeasurementForm 
          mode={type} 
          initialData={data} 
          onClose={onClose}
        />
        {renderRelatedEntities()}
      </>
    );
  }
  
  else if (entityType === 'target') {
    formComponent = (
      <>
        {renderActionButtons()}
        <TargetForm 
          mode={type} 
          initialData={data} 
          onClose={onClose}
        />
        {renderRelatedEntities()}
      </>
    );
  }
  
  else if (entityType === 'initiative') {
    formComponent = (
      <>
        {renderActionButtons()}
        <InitiativeForm 
          mode={type} 
          initialData={data} 
          onClose={onClose}
        />
        {renderRelatedEntities()}
      </>
    );
  }
  
  else if (entityType === 'scenario') {
    formComponent = (
      <>
        {renderActionButtons()}
        <ScenarioForm 
          mode={type} 
          initialData={data} 
          onClose={onClose}
        />
        {renderRelatedEntities()}
      </>
    );
  }
  
  else if (entityType === 'supplier') {
    formComponent = (
      <>
        {renderActionButtons()}
        <SupplierForm 
          mode={type} 
          initialData={data} 
          onClose={onClose}
        />
        {renderRelatedEntities()}
      </>
    );
  }
  
  return formComponent;
};

export default SidePanelContent;
