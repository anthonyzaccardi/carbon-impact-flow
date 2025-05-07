
import React, { useState, useRef, useCallback } from 'react';
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SortableTableProps } from './types';
import { useColumnDrag } from './use-column-drag';
import { useColumnResize } from './use-column-resize';
import { useTableSort } from './use-table-sort';
import { SortableTableHeader } from './table-header';
import { SortableTableBody } from './table-body';

export type { SortableColumn } from './types';

export function SortableTable<T>({
  data,
  columns: initialColumns,
  onRowClick,
  className
}: SortableTableProps<T>) {
  // Column management state
  const [columns, setColumns] = useState(initialColumns);
  const [columnWidths, setColumnWidths] = useState<Record<string, number | string>>(
    Object.fromEntries(initialColumns.map((col, index) => [index, col.width || 'auto']))
  );
  
  const tableRef = useRef<HTMLDivElement>(null);

  // Initialize hooks
  const { sortColumn, sortDirection, handleSort, getSortedData } = useTableSort<T>();
  
  const { 
    draggedColumnIndex, 
    dragOverColumnIndex, 
    handleDragStart, 
    handleDragOver,
    handleDrop: baseDrop,
    setDraggedColumnIndex,
    setDragOverColumnIndex 
  } = useColumnDrag<T>(initialColumns);
  
  const {
    isResizing,
    resizingColumnIndex,
    handleResizeStart: baseResizeStart,
    handleResizeMove: baseResizeMove,
    handleResizeEnd
  } = useColumnResize();

  // Hook wrapper functions with dependencies injected
  const handleResizeStart = useCallback((e: React.MouseEvent, index: number) => {
    baseResizeStart(e, index, columnWidths);
  }, [columnWidths]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    baseResizeMove(e, columnWidths, setColumnWidths);
  }, [columnWidths, setColumnWidths]);

  const handleDropWrapper = useCallback((e: React.DragEvent) => {
    baseDrop(e, columns, setColumns, columnWidths, setColumnWidths);
  }, [columns, columnWidths]);

  // Use useCallback to create stable function references
  const handleTableSort = useCallback((column: keyof T | undefined, index: number) => {
    handleSort(column, index, columns);
  }, [columns]);

  return (
    <div className="rounded-md border relative" ref={tableRef}>
      <div className="overflow-auto">
        <Table className={cn("relative", className)}>
          <SortableTableHeader<T>
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            columnWidths={columnWidths}
            handleSort={handleTableSort}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDropWrapper}
            handleResizeStart={handleResizeStart}
            dragOverColumnIndex={dragOverColumnIndex}
          />
          <SortableTableBody<T>
            data={getSortedData(data)}
            columns={columns}
            columnWidths={columnWidths}
            onRowClick={onRowClick}
          />
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
