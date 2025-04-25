
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { Supplier, Target } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
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

const industries = [
  "Agriculture",
  "Construction",
  "Education",
  "Energy",
  "Financial Services",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Manufacturing",
  "Mining",
  "Real Estate",
  "Retail",
  "Transportation",
  "Utilities",
  "Waste Management",
];

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY"];

const SupplierForm: React.FC<SupplierFormProps> = ({
  mode,
  initialData,
  onClose,
}) => {
  const isViewMode = mode === "view";
  const { createSupplier, updateSupplier, deleteSupplier, openSidePanel, targets } = useAppContext();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Get targets linked to this supplier
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
    // Ensure all required fields are explicitly included
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
  
  function handleEdit() {
    if (initialData) {
      openSidePanel('edit', 'supplier', initialData);
    }
  }
  
  function handleDelete() {
    if (initialData) {
      deleteSupplier(initialData.id);
      onClose();
    }
  }
  
  function viewTarget(target: Target) {
    openSidePanel('view', 'target', target);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Linked Targets Section */}
        {isViewMode && initialData && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Linked Targets</h3>
            {linkedTargets.length > 0 ? (
              <div className="border rounded-md divide-y">
                {linkedTargets.map((target) => (
                  <div 
                    key={target.id} 
                    className="p-3 hover:bg-accent/50 cursor-pointer"
                    onClick={() => viewTarget(target)}
                  >
                    <div className="font-medium">{target.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {target.targetPercentage}% reduction by {new Date(target.targetDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No targets linked to this supplier</div>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        {!isViewMode && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        )}
        
        {isViewMode && (
          <div className="flex justify-end space-x-2">
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this supplier?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the supplier
                    and remove the data from the server.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={handleEdit} size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default SupplierForm;
