
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/types";
import { toast } from "sonner";

export async function fetchSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching suppliers:', error);
    toast.error('Failed to load suppliers');
    return [];
  }

  return data ? data.map(s => ({
    id: s.id,
    name: s.name,
    industry: s.industry,
    contactPerson: s.contact_person,
    email: s.email,
    phone: s.phone,
    currency: s.currency,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  })) : [];
}

export async function createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier | null> {
  const newSupplier = {
    name: supplier.name,
    industry: supplier.industry,
    contact_person: supplier.contactPerson,
    email: supplier.email,
    phone: supplier.phone,
    currency: supplier.currency
  };

  const { data, error } = await supabase
    .from('suppliers')
    .insert([newSupplier])
    .select()
    .single();

  if (error) {
    console.error('Error creating supplier:', error);
    toast.error(`Failed to create supplier: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    industry: data.industry,
    contactPerson: data.contact_person,
    email: data.email,
    phone: data.phone,
    currency: data.currency,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier | null> {
  const updates = {
    ...(supplier.name && { name: supplier.name }),
    ...(supplier.industry && { industry: supplier.industry }),
    ...(supplier.contactPerson && { contact_person: supplier.contactPerson }),
    ...(supplier.email && { email: supplier.email }),
    ...(supplier.phone && { phone: supplier.phone }),
    ...(supplier.currency && { currency: supplier.currency })
  };

  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating supplier:', error);
    toast.error(`Failed to update supplier: ${error.message}`);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    industry: data.industry,
    contactPerson: data.contact_person,
    email: data.email,
    phone: data.phone,
    currency: data.currency,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteSupplier(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting supplier:', error);
    toast.error(`Failed to delete supplier: ${error.message}`);
    return false;
  }

  return true;
}
