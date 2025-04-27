
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { InitiativeFormData } from "../schema";

interface FinancialSectionProps {
  form: UseFormReturn<InitiativeFormData>;
  isViewMode: boolean;
}

export const FinancialSection = ({ form, isViewMode }: FinancialSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="spend"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spend</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} disabled={isViewMode} />
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
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
                <SelectItem value="CNY">CNY</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
