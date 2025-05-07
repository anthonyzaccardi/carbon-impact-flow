
import React from 'react';
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SortableColumn } from './types';

interface TableBodyProps<T> {
  data: T[];
  columns: SortableColumn<T>[];
  columnWidths: Record<string, number | string>;
  onRowClick?: (item: T) => void;
}

export function SortableTableBody<T>({
  data,
  columns,
  columnWidths,
  onRowClick
}: TableBodyProps<T>) {
  if (data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {data.map((row, rowIndex) => (
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
      ))}
    </TableBody>
  );
}
