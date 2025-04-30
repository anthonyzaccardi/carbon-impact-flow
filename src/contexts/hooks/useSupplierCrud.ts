
import { useState } from 'react';
import { Supplier } from '@/types';
import { createNewSupplier, updateExistingSupplier, deleteExistingSupplier } from '../operations/supplier-operations';
import { useAppContext } from '../useAppContext';

export const useSupplierCrud = () => {
  const { suppliers, setSuppliers } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSupplier = async (supplier: Omit<Supplier, 'id'>): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const newSupplier = createNewSupplier(supplier);
      setSuppliers([...suppliers, newSupplier]);
      setIsLoading(false);
      return newSupplier.id; // Return the ID as a string
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const updateSupplier = async (supplierId: string, supplier: Partial<Supplier>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSupplier = updateExistingSupplier(supplierId, supplier);
      setSuppliers(suppliers.map(s => s.id === supplierId ? updatedSupplier : s));
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const deleteSupplier = async (supplierId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteExistingSupplier(supplierId);
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return {
    suppliers,
    isLoading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier
  };
};
