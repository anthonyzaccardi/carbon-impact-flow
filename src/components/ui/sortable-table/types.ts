
import { ReactNode } from 'react';

export type SortDirection = "asc" | "desc" | null;

export interface SortableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: number | string;
}

export interface SortableTableProps<T> {
  data: T[];
  columns: SortableColumn<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
}
