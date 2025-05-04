
import { useState, useMemo } from 'react';
import { Initiative } from '@/types';

export const useInitiativeFilter = (initiatives: Initiative[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInitiatives = useMemo(() => {
    return initiatives.filter(
      (initiative) => initiative.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initiatives, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredInitiatives
  };
};
