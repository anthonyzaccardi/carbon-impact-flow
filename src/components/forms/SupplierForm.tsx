
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAppContext } from '@/contexts/useAppContext';
import { Supplier } from "@/types";
import { SupplierFormFields } from "./suppliers/SupplierFormFields";
import { LinkedTargets } from "./suppliers/LinkedTargets";
import { FormActions } from "./initiatives/sections/FormActions";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Supplier name must be at least 3 characters.",
  }),
  industry: z.string().min(1, {
    message: "Industry is required.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Phone number is required.",
  }),
  currency: z.string().min(1, {
    message: "Currency is required.",
  }),
});

type FormData = z.infer<typeof formSchema>;

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
  const isViewMode = mode === "view";
  const { createSupplier, updateSupplier, targets, updateTarget } = useAppContext();
  
  // Keep track of targets to link to the supplier being created
  const [pendingTargetIds, setPendingTargetIds] = useState<string[]>([]);
  
  const linkedTargets = initialData 
    ? targets.filter(target => target.supplierId === initialData.id)
    : [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      industry: "",
      contactPerson: "",
      email: "",
      phone: "",
      currency: "USD",
    },
  });

  function onSubmit(data: FormData) {
    const formattedData = {
      name: data.name,
      industry: data.industry,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      currency: data.currency
    };

    if (mode === "create") {
      // Create the supplier first, then update targets with the new supplier ID
      const newSupplierId = createSupplier(formattedData);
      
      // Attach any pending targets to the newly created supplier
      pendingTargetIds.forEach(targetId => {
        const target = targets.find(t => t.id === targetId);
        if (target) {
          updateTarget(targetId, { ...target, supplierId: newSupplierId });
        }
      });
      
      return newSupplierId;
    } else if (mode === "edit" && initialData) {
      updateSupplier(initialData.id, formattedData);
      return initialData.id;
    }
    
    return "";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SupplierFormFields isViewMode={isViewMode} />
        
        <LinkedTargets 
          targets={linkedTargets} 
          supplierId={initialData?.id} 
          isViewMode={isViewMode}
          pendingTargetIds={pendingTargetIds}
          setPendingTargetIds={setPendingTargetIds}
        />
        
        <FormActions isViewMode={isViewMode} onClose={onClose} />
      </form>
    </Form>
  );
};

export default SupplierForm;
