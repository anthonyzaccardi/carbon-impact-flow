
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useAppContext } from "@/contexts/useAppContext";
import { TargetFormData } from "../schema";

interface BasicInfoFieldsProps {
  form: UseFormReturn<TargetFormData>;
  isViewMode: boolean;
}

export const BasicInfoFields = ({ form, isViewMode }: BasicInfoFieldsProps) => {
  const { tracks, suppliers } = useAppContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="trackId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Track</FormLabel>
            <Select
              disabled={isViewMode}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tracks.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.name}
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
        name="supplierId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supplier (Optional)</FormLabel>
            <Select
              disabled={isViewMode}
              onValueChange={field.onChange}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">No supplier</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                disabled={isViewMode}
                placeholder="Enter target name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                disabled={isViewMode}
                placeholder="Enter target description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
