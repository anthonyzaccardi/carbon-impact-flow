
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAppContext } from '@/contexts/useAppContext';
import { Supplier } from "@/types";
import { SupplierFormFields } from "./suppliers/SupplierFormFields";
import { LinkedTargets } from "./suppliers/LinkedTargets";

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
  const { createSupplier, updateSupplier, targets } = useAppContext();
  
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
      createSupplier(formattedData);
    } else if (mode === "edit" && initialData) {
      updateSupplier(initialData.id, formattedData);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SupplierFormFields isViewMode={isViewMode} />
        
        {isViewMode && <LinkedTargets targets={linkedTargets} />}
        
        {!isViewMode && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default SupplierForm;
