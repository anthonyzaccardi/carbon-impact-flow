
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TargetFormData } from "../schema";

interface BasicInfoFieldsProps {
  form: UseFormReturn<TargetFormData>;
  isViewMode: boolean;
}

export const BasicInfoFields = ({ form, isViewMode }: BasicInfoFieldsProps) => {
  return (
    <>
      <div>
        <FormField
          control={form.control}
          name="trackId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track ID</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
