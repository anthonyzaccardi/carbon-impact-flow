
import { SidePanel } from '@/types';

export const getSidePanelTitle = (sidePanel: SidePanel): string => {
  const { type, entityType } = sidePanel;
  const action = type === 'create' ? 'Create' : type === 'edit' ? 'Edit' : 'View';
  const entity = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  
  return `${action} ${entity}`;
};

export const getEntityDisplayName = (entityType: string): string => {
  switch (entityType) {
    case 'track':
      return 'Track';
    case 'factor':
      return 'Factor';
    case 'measurement':
      return 'Measurement';
    case 'target':
      return 'Target';
    case 'initiative':
      return 'Initiative';
    case 'scenario':
      return 'Scenario';
    case 'supplier':
      return 'Supplier';
    default:
      return entityType.charAt(0).toUpperCase() + entityType.slice(1);
  }
};
