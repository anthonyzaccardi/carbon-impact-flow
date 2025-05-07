
import { useState, useEffect } from 'react';

export function useColumnResize() {
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleResizeStart = (e: React.MouseEvent, index: number, columnWidths: Record<string, number | string>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingColumnIndex(index);
    setStartX(e.clientX);
    
    const width = columnWidths[index];
    setStartWidth(typeof width === 'number' ? width : 100); // Default if not numeric
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent, columnWidths: Record<string, number | string>, setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number | string>>>) => {
    if (!isResizing || resizingColumnIndex === null) return;
    
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px
    
    setColumnWidths({
      ...columnWidths,
      [resizingColumnIndex]: newWidth
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizingColumnIndex(null);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  return {
    isResizing,
    resizingColumnIndex,
    handleResizeStart,
    handleResizeEnd,
    handleResizeMove,
    setIsResizing,
    setResizingColumnIndex
  };
}
