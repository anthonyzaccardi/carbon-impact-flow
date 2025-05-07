
import React, { useState, useRef, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";

type SortDirection = "asc" | "desc" | null;

export interface SortableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: number | string;
}

interface SortableTableProps<T> {
  data: T[];
  columns: SortableColumn<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function SortableTable<T>({
  data,
  columns: initialColumns,
  onRowClick,
  className
}: SortableTableProps<T>) {
  // Column management state
  const [columns, setColumns] = useState<SortableColumn<T>[]>(initialColumns);
  const [columnWidths, setColumnWidths] = useState<Record<string, number | string>>(
    Object.fromEntries(initialColumns.map((col, index) => [index, col.width || 'auto']))
  );
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Column drag state
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);
  
  // Column resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  // Handle column sorting
  const handleSort = (column: keyof T | undefined, index: number) => {
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

  // Get sorted data based on current sort settings
  const getSortedData = () => {
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

  // Column dragging handlers
  const handleDragStart = (index: number) => {
    setDraggedColumnIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedColumnIndex === null || draggedColumnIndex === index) return;
    setDragOverColumnIndex(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedColumnIndex === null || dragOverColumnIndex === null) return;
    
    // Reorder columns by creating a new array
    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedColumnIndex, 1);
    newColumns.splice(dragOverColumnIndex, 0, draggedColumn);
    
    // Update column widths to match the new order
    const newColumnWidths: Record<string, number | string> = {};
    newColumns.forEach((col, index) => {
      const oldIndex = initialColumns.findIndex(c => c.header === col.header);
      newColumnWidths[index] = columnWidths[oldIndex] || 'auto';
    });
    
    setColumns(newColumns);
    setColumnWidths(newColumnWidths);
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
  };

  // Column resize handlers
  const handleResizeStart = (e: React.MouseEvent, index: number) => {
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

  const handleResizeMove = (e: MouseEvent) => {
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

  return (
    <div className="rounded-md border relative" ref={tableRef}>
      <div className="overflow-auto">
        <Table className={cn("relative", className)}>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={`${column.header}-${index}`} 
                  className={cn(
                    "group relative",
                    column.sortable !== false ? "cursor-pointer select-none" : "",
                    dragOverColumnIndex === index ? "bg-accent" : "",
                    "whitespace-nowrap"
                  )}
                  draggable={true}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  onClick={() => column.accessorKey && handleSort(column.accessorKey, index)}
                  style={{ 
                    width: columnWidths[index], 
                    position: 'relative', 
                    transition: 'background-color 0.2s' 
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-2 cursor-grab opacity-0 group-hover:opacity-50">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <span>{column.header}</span>
                    {column.accessorKey && column.sortable !== false && (
                      <div className="flex flex-col ml-1">
                        <ChevronUp
                          className={cn(
                            "h-3 w-3 text-muted-foreground",
                            sortColumn === column.accessorKey && sortDirection === "asc" 
                              ? "text-foreground" 
                              : "text-muted-foreground/40"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 text-muted-foreground",
                            sortColumn === column.accessorKey && sortDirection === "desc" 
                              ? "text-foreground" 
                              : "text-muted-foreground/40"
                          )}
                        />
                      </div>
                    )}
                  </div>
                  {/* Column resize handle */}
                  <div 
                    className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize group-hover:bg-accent/50"
                    onMouseDown={(e) => handleResizeStart(e, index)}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedData().length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              getSortedData().map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, cellIndex) => (
                    <TableCell 
                      key={`${rowIndex}-${cellIndex}`}
                      style={{ width: columnWidths[cellIndex] }}
                    >
                      {column.cell 
                        ? column.cell(row) 
                        : column.accessorKey 
                          ? String(row[column.accessorKey] || '')
                          : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Resizing overlay - prevents unwanted interactions during resize */}
      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}

export default SortableTable;
