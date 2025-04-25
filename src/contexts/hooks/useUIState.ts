
import { useState } from 'react';
import { SidePanel } from '@/types';
import { AppContextType } from '../types';

export const useUIState = () => {
  const [sidePanel, setSidePanel] = useState<SidePanel>({
    isOpen: false,
    type: 'view',
    entityType: 'track'
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const openSidePanel = (type: 'create' | 'edit' | 'view', entityType: AppContextType['sidePanel']['entityType'], data?: any) => {
    setSidePanel({ isOpen: true, type, entityType, data });
  };

  const closeSidePanel = () => {
    setSidePanel(prev => ({ ...prev, isOpen: false }));
  };

  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  return {
    sidePanel,
    sidebarExpanded,
    openSidePanel,
    closeSidePanel,
    toggleSidebar
  };
};
