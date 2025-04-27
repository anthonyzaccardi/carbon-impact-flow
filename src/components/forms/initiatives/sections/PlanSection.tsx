
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { InitiativeFormData } from "../schema";

interface PlanSectionProps {
  form: UseFormReturn<InitiativeFormData>;
  isViewMode: boolean;
}

export const PlanSection = ({ form, isViewMode }: PlanSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reduction Plan</FormLabel>
            <Select
              disabled={isViewMode}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="-2%">-2%</SelectItem>
                <SelectItem value="-4%">-4%</SelectItem>
                <SelectItem value="-6%">-6%</SelectItem>
                <SelectItem value="-8%">-8%</SelectItem>
                <SelectItem value="-10%">-10%</SelectItem>
                <SelectItem value="-15%">-15%</SelectItem>
                <SelectItem value="-5%">-5%</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trajectory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trajectory</FormLabel>
            <Select
              disabled={isViewMode}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select trajectory" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="every_year">Every Year</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
