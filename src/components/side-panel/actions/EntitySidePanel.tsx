
import React from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { EntityActions } from '../EntityActions';
import { RelatedEntities } from '../RelatedEntities';
import TrackForm from '@/components/forms/TrackForm';
import FactorForm from '@/components/forms/FactorForm';
import MeasurementForm from '@/components/forms/MeasurementForm';
import TargetForm from '@/components/forms/TargetForm';
import InitiativeForm from '@/components/forms/initiatives/InitiativeForm';
import ScenarioForm from '@/components/forms/ScenarioForm';
import SupplierForm from '@/components/forms/SupplierForm';
import { SidePanel } from '@/types';

interface EntitySidePanelProps {
  type: 'view' | 'create' | 'edit';
  entityType: string;
  data?: any;
  onClose: () => void;
}

export const EntitySidePanel: React.FC<EntitySidePanelProps> = ({
  type,
  entityType,
  data,
  onClose
}) => {
  const { openSidePanel } = useAppContext();
  
  const handleEntityClick = (type: string, entityData: any) => {
    // Cast the entityType to the appropriate type expected by openSidePanel
    openSidePanel('view', type as SidePanel['entityType'], entityData);
  };

  const renderActionButtons = () => {
    if (type !== 'view') return null;
    return (
      <EntityActions 
        onEdit={() => openSidePanel('edit', entityType as SidePanel['entityType'], data)}
        onDelete={onClose} 
      />
    );
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
      default:
        return null;
    }
  };

  return renderForm();
};
