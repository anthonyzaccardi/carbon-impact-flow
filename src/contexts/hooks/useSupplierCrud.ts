
import { Supplier } from '@/types';
import { createSupplierOperation, updateSupplierOperation, deleteSupplierOperation } from '../operations';

export const useSupplierCrud = (
  suppliers: Supplier[],
  setSuppliers: (suppliers: Supplier[]) => void
) => {
  const createSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): string => {
    return createSupplierOperation(suppliers, setSuppliers, supplier);
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    updateSupplierOperation(suppliers, setSuppliers, id, supplier);
  };

  const deleteSupplier = (id: string) => {
    deleteSupplierOperation(suppliers, setSuppliers, id);
  };

  return {
    createSupplier,
    updateSupplier,
    deleteSupplier
  };
};
