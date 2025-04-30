
import { useState } from 'react';
import { Supplier } from '@/types';
import { 
  createNewSupplier, 
  updateExistingSupplier,
  deleteExistingSupplier
} from '../operations/supplier-operations';

export const useSupplierCrud = (suppliers: Supplier[], setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>) => {
  const createSupplier = (supplier: Omit<Supplier, 'id'>): string => {
    const newSupplier = createNewSupplier(supplier);
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier.id;
  };
  
  const updateSupplier = (supplierId: string, supplier: Partial<Supplier>) => {
    const updatedSupplier = updateExistingSupplier(supplierId, supplier);
    setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, ...supplier } : s));
  };
  
  const deleteSupplier = async (supplierId: string) => {
    await deleteExistingSupplier(supplierId);
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  };
  
  return {
    createSupplier,
    updateSupplier,
    deleteSupplier
  };
};
