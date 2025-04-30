
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Status, InitiativeStatus, MeasurementStatus } from '@/types';

interface Column<T> {
  header: string;
  accessorKey: string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

const measurementStatusColorMap: Record<MeasurementStatus, string> = {
  active: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-error/10 text-error',
};

const statusColorMap: Record<Status, string> = {
  not_started: 'bg-secondary text-text-secondary',
  in_progress: 'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
};

const initiativeStatusColorMap: Record<InitiativeStatus, string> = {
  not_started: 'bg-secondary text-text-secondary',
  in_progress: 'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
  committed: 'bg-primary/10 text-primary'
};

function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className="bg-muted text-text-secondary font-medium">{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center p-4 text-text-tertiary">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={onRowClick ? 'cursor-pointer hover:bg-secondary/50 transition-colors' : ''}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.cell ? column.cell(item) : (
                      column.accessorKey === 'status' ? (
                        // Check which status type we're dealing with
                        typeof item[column.accessorKey] === 'string' && (
                          <Badge 
                            className={
                              item.hasOwnProperty('targetIds') 
                                ? initiativeStatusColorMap[item[column.accessorKey] as InitiativeStatus] || 'bg-secondary text-text-secondary'
                                : item.hasOwnProperty('calculatedValue')
                                  ? measurementStatusColorMap[item[column.accessorKey] as MeasurementStatus] || 'bg-secondary text-text-secondary'
                                  : statusColorMap[item[column.accessorKey] as Status] || 'bg-secondary text-text-secondary'
                            }
                            variant="outline"
                          >
                            {item[column.accessorKey].replace('_', ' ')}
                          </Badge>
                        )
                      ) : (
                        item[column.accessorKey]
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
