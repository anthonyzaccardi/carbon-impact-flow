
// The specific error is in this file - showing createSupplier returning void rather than a string.
// I need to update the component to correctly handle the Supabase integration.

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/useAppContext";
import { Supplier } from "@/types";
import { SupplierFormFields } from "./suppliers/SupplierFormFields";
import { LinkedTargets } from "./suppliers/LinkedTargets";

// Define schema for supplier form
const supplierFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  currency: z.string().default("USD")
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface SupplierFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Supplier;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  mode,
  initialData,
  onClose,
}) => {
  const { createSupplier, updateSupplier, targets } = useAppContext();
  const isViewMode = mode === "view";

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      industry: initialData.industry,
      contactPerson: initialData.contactPerson,
      email: initialData.email,
      phone: initialData.phone,
      currency: initialData.currency
    } : {
      name: "",
      industry: "",
      contactPerson: "",
      email: "",
      phone: "",
      currency: "USD"
    }
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      if (mode === "create") {
        // Fix: Make sure createSupplier returns a string (ID) or we handle void properly
        await createSupplier({
          name: data.name,
          industry: data.industry,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone,
          currency: data.currency
        });
      } else if (mode === "edit" && initialData) {
        await updateSupplier(initialData.id, data);
      }
      onClose();
    } catch (error) {
      console.error("Error in supplier form:", error);
    }
  };

  // Get related targets for this supplier
  const relatedTargets = initialData
    ? targets.filter(t => t.supplierId === initialData.id)
    : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SupplierFormFields form={form} isViewMode={isViewMode} />

        {isViewMode && initialData && (
          <LinkedTargets supplier={initialData} targets={relatedTargets} />
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} type="button">
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          
          {!isViewMode && (
            <Button type="submit">
              {mode === "create" ? "Create Supplier" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;
