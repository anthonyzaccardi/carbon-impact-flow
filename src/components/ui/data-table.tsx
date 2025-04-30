
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
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColorMap: Record<Status, string> = {
  not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const initiativeStatusColorMap: Record<InitiativeStatus, string> = {
  not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  committed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
};

function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center p-4 text-muted-foreground">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={onRowClick ? 'cursor-pointer table-row hover:bg-muted/50' : ''}
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
                                ? initiativeStatusColorMap[item[column.accessorKey] as InitiativeStatus] || 'bg-gray-100 text-gray-800'
                                : item.hasOwnProperty('calculatedValue')
                                  ? measurementStatusColorMap[item[column.accessorKey] as MeasurementStatus] || 'bg-gray-100 text-gray-800'
                                  : statusColorMap[item[column.accessorKey] as Status] || 'bg-gray-100 text-gray-800'
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
