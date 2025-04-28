
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SupplierFormFieldsProps {
  isViewMode: boolean;
}

const industries = ["Agriculture", "Construction", "Education", "Energy", "Financial Services", "Healthcare", "Hospitality", "Information Technology", "Manufacturing", "Mining", "Real Estate", "Retail", "Transportation", "Utilities", "Waste Management"];
const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY"];

export const SupplierFormFields = ({
  isViewMode
}: SupplierFormFieldsProps) => {
  const {
    control
  } = useFormContext();
  
  return (
    <>
      <FormField control={control} name="name" render={({
      field
    }) => <FormItem>
            <FormLabel>Company name</FormLabel>
            <FormControl>
              <Input {...field} disabled={isViewMode} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="industry" render={({
        field
      }) => <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select disabled={isViewMode} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industries.map(industry => <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>} />

        <FormField control={control} name="currency" render={({
        field
      }) => <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select disabled={isViewMode} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map(currency => <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="contactPerson" render={({
        field
      }) => <FormItem>
              <FormLabel>Contact person</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={control} name="email" render={({
        field
      }) => <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={control} name="phone" render={({
        field
      }) => <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>
    </>
  );
};
