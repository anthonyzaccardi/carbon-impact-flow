
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortDirection = "asc" | "desc" | null;

export interface SortableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface SortableTableProps<T> {
  data: T[];
  columns: SortableColumn<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function SortableTable<T>({
  data,
  columns,
  onRowClick,
  className
}: SortableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: keyof T | undefined) => {
    if (!column || columns.find(col => col.accessorKey === column)?.sortable === false) return;
    
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

  return (
    <div className="rounded-md border">
      <Table className={cn(className)}>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead 
                key={index} 
                className={cn(
                  column.accessorKey && column.sortable !== false ? "cursor-pointer select-none" : "",
                  "whitespace-nowrap"
                )}
                onClick={() => handleSort(column.accessorKey)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.accessorKey && column.sortable !== false && (
                    <div className="flex flex-col">
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
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {getSortedData().map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={onRowClick ? "cursor-pointer" : ""}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, cellIndex) => (
                <TableCell key={cellIndex}>
                  {column.cell 
                    ? column.cell(row) 
                    : column.accessorKey 
                      ? String(row[column.accessorKey] || '')
                      : ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default SortableTable;
