
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TargetFormData } from "../schema";

interface ValueFieldsProps {
  form: UseFormReturn<TargetFormData>;
  isViewMode: boolean;
  isFromCatalog?: boolean;
}

export const ValueFields = ({ form, isViewMode, isFromCatalog = false }: ValueFieldsProps) => {
  return (
    <>
      <div>
        <FormField
          control={form.control}
          name="baselineValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baseline Value</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  disabled={isViewMode || isFromCatalog} 
                  className={isFromCatalog ? "bg-muted" : ""}
                />
              </FormControl>
              <FormMessage />
              {isFromCatalog && (
                <p className="text-xs text-muted-foreground mt-1">
                  Using track's total emissions as baseline
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="targetPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Percentage</FormLabel>
              <Select
                disabled={isViewMode}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="-5">-5%</SelectItem>
                  <SelectItem value="-10">-10%</SelectItem>
                  <SelectItem value="-20">-20%</SelectItem>
                  <SelectItem value="-30">-30%</SelectItem>
                  <SelectItem value="-40">-40%</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
