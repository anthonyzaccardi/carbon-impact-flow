
import { useState, useEffect, useCallback } from 'react';

export function useColumnResize() {
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [columnWidths, setColumnWidths] = useState<Record<string, number | string>>({});

  const handleResizeStart = (e: React.MouseEvent, index: number, initialColumnWidths: Record<string, number | string>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingColumnIndex(index);
    setStartX(e.clientX);
    setColumnWidths(initialColumnWidths);
    
    const width = initialColumnWidths[index];
    setStartWidth(typeof width === 'number' ? width : 100); // Default if not numeric
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || resizingColumnIndex === null) return;
    
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px
    
    setColumnWidths(prevWidths => ({
      ...prevWidths,
      [resizingColumnIndex]: newWidth
    }));
  }, [isResizing, resizingColumnIndex, startX, startWidth]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizingColumnIndex(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  return {
    isResizing,
    resizingColumnIndex,
    columnWidths,
    handleResizeStart,
    handleResizeEnd,
    setIsResizing,
    setResizingColumnIndex,
    setColumnWidths
  };
}
