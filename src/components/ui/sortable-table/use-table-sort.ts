
import { useState } from 'react';
import { SortDirection } from './types';

export function useTableSort<T>() {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: keyof T | undefined, index: number, columns: any[]) => {
    if (!column || columns[index].sortable === false) return;
    
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedData = (data: T[]) => {
    if (!sortColumn || !sortDirection) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const compareResult = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  };

  return {
    sortColumn,
    sortDirection,
    handleSort,
    getSortedData
  };
}
