
import React from 'react';
import { SidePanel } from '@/types';
import { useAppContext } from '@/contexts/useAppContext';
import { EntityActions } from './EntityActions';
import { RelatedEntities } from './RelatedEntities';
import { InitiativeTargetSelector } from '../initiatives/InitiativeTargetSelector';
import TrackForm from '@/components/forms/TrackForm';
import FactorForm from '@/components/forms/FactorForm';
import MeasurementForm from '@/components/forms/MeasurementForm';
import TargetForm from '@/components/forms/TargetForm';
import InitiativeForm from '@/components/forms/initiatives/InitiativeForm';
import ScenarioForm from '@/components/forms/ScenarioForm';
import SupplierForm from '@/components/forms/SupplierForm';

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
    openSidePanel('edit', entityType as any, data);
  };

  const handleEntityClick = (type: string, entityData: any) => {
    openSidePanel('view', type as any, entityData);
  };

  const renderActionButtons = () => {
    if (type !== 'view') return null;
    return <EntityActions onEdit={handleEdit} onDelete={handleDelete} />;
  };

  const renderForm = () => {
    switch (entityType) {
      case 'track':
        return (
          <>
            {renderActionButtons()}
            <TrackForm mode={type} initialData={data} onClose={onClose} />
            <RelatedEntities entityType={entityType} data={data} onEntityClick={handleEntityClick} />
          </>
        );
      case 'factor':
        return (
          <>
            {renderActionButtons()}
            <FactorForm mode={type} initialData={data} onClose={onClose} />
            <RelatedEntities entityType={entityType} data={data} onEntityClick={handleEntityClick} />
          </>
        );
      case 'measurement':
        return (
          <>
            {renderActionButtons()}
            <MeasurementForm mode={type} initialData={data} onClose={onClose} />
            <RelatedEntities entityType={entityType} data={data} onEntityClick={handleEntityClick} />
          </>
        );
      case 'target':
        return (
          <>
            {renderActionButtons()}
            <TargetForm mode={type} initialData={data} onClose={onClose} />
            <RelatedEntities entityType={entityType} data={data} onEntityClick={handleEntityClick} />
          </>
        );
      case 'initiative':
        return (
          <>
            {renderActionButtons()}
            <InitiativeForm mode={type} initialData={data} onClose={onClose} />
            <RelatedEntities entityType={entityType} data={data} onEntityClick={handleEntityClick} />
          </>
        );
      case 'scenario':
        return (
          <>
            {renderActionButtons()}
            <ScenarioForm mode={type} initialData={data} onClose={onClose} />
            <RelatedEntities entityType={entityType} data={data} onEntityClick={handleEntityClick} />
          </>
        );
      case 'supplier':
        return (
          <>
            {renderActionButtons()}
            <SupplierForm mode={type} initialData={data} onClose={onClose} />
            <RelatedEntities entityType={entityType} data={data} onEntityClick={handleEntityClick} />
          </>
        );
      case 'initiative-targets':
        if (data) {
          return (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Manage Targets</h2>
              <p className="text-sm text-muted-foreground">Select targets to attach to this initiative</p>
              <InitiativeTargetSelector initiativeId={data.id} onClose={onClose} />
            </div>
          );
        }
        break;
    }
    return null;
  };

  return renderForm();
};

export default SidePanelContent;
