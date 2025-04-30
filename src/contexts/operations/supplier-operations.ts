
import { toast } from 'sonner';
import { Supplier } from '@/types';
import { generateId, getCurrentTimestamp } from '../utils';

export const createSupplierOperation = (
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void,
  supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>
): string => {
  const id = generateId('supplier');
  const newSupplier: Supplier = {
    ...supplier,
    id,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  setSuppliers([...suppliers, newSupplier]);
  toast.success(`Created supplier: ${supplier.name}`);
  return id;
};

export const updateSupplierOperation = (
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void,
  id: string,
  supplier: Partial<Supplier>
) => {
  setSuppliers(suppliers.map(s =>
    s.id === id ? { ...s, ...supplier, updatedAt: getCurrentTimestamp() } : s
  ));
  toast.success(`Updated supplier: ${supplier.name || id}`);
};

export const deleteSupplierOperation = (
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void,
  id: string
) => {
  setSuppliers(suppliers.filter(s => s.id !== id));
  toast.success(`Deleted supplier: ${id}`);
};
