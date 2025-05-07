
import { useState } from 'react';

export function useColumnDrag<T>(initialColumns: any[]) {
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedColumnIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedColumnIndex === null || draggedColumnIndex === index) return;
    setDragOverColumnIndex(index);
  };

  const handleDrop = (e: React.DragEvent, columns: any[], setColumns: React.Dispatch<React.SetStateAction<any[]>>, columnWidths: Record<string, number | string>, setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number | string>>>) => {
    e.preventDefault();
    if (draggedColumnIndex === null || dragOverColumnIndex === null) return;
    
    // Reorder columns by creating a new array
    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedColumnIndex, 1);
    newColumns.splice(dragOverColumnIndex, 0, draggedColumn);
    
    // Update column widths to match the new order
    const newColumnWidths: Record<string, number | string> = {};
    newColumns.forEach((col, index) => {
      const oldIndex = columns.findIndex(c => c.header === col.header);
      newColumnWidths[index] = columnWidths[oldIndex] || 'auto';
    });
    
    setColumns(newColumns);
    setColumnWidths(newColumnWidths);
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
  };

  return {
    draggedColumnIndex,
    dragOverColumnIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setDraggedColumnIndex,
    setDragOverColumnIndex
  };
}
