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
import { Supplier } from "@/types";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Supplier name must be at least 3 characters.",
  }),
  industry: z.string().min(1, {
    message: "Industry is required.",
  }),
  location: z.string().min(1, {
    message: "Location is required.",
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
  status: z.enum(["active", "pending", "completed", "cancelled"]),
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
  const { createSupplier, updateSupplier } = useAppContext();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      industry: "",
      location: "",
      contactPerson: "",
      email: "",
      phone: "",
      currency: "USD",
      status: "active",
    },
  });

  function onSubmit(data: FormData) {
    // Ensure all required fields are explicitly included
    const formattedData = {
      name: data.name,
      industry: data.industry,
      location: data.location,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      currency: data.currency,
      status: data.status
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                disabled={isViewMode}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isViewMode && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        )}
        
        {isViewMode && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose} type="button">
              Close
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default SupplierForm;
