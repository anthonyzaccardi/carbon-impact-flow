
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { SortableColumn, SortDirection } from './types';

interface TableHeaderProps<T> {
  columns: SortableColumn<T>[];
  sortColumn: keyof T | null;
  sortDirection: SortDirection;
  columnWidths: Record<string, number | string>;
  handleSort: (column: keyof T | undefined, index: number) => void;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleResizeStart: (e: React.MouseEvent, index: number) => void;
  dragOverColumnIndex: number | null;
}

export function SortableTableHeader<T>({
  columns,
  sortColumn,
  sortDirection,
  columnWidths,
  handleSort,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleResizeStart,
  dragOverColumnIndex
}: TableHeaderProps<T>) {
  return (
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
  );
}
