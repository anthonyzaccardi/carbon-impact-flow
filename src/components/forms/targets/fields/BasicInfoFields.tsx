
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
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="trackId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium">Track</FormLabel>
            <Select
              disabled={isViewMode}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full border-input hover:border-eco-purple/70 focus:border-eco-purple transition-colors">
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tracks.map((track) => (
                  <SelectItem key={track.id} value={track.id} className="hover:bg-eco-purple/10 focus:bg-eco-purple/10">
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
            <FormLabel className="font-medium">Supplier (Optional)</FormLabel>
            <Select
              disabled={isViewMode}
              onValueChange={field.onChange}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger className="w-full border-input hover:border-eco-purple/70 focus:border-eco-purple transition-colors">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no-supplier" className="hover:bg-eco-purple/10 focus:bg-eco-purple/10">No supplier</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id} className="hover:bg-eco-purple/10 focus:bg-eco-purple/10">
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
            <FormLabel className="font-medium">Name</FormLabel>
            <FormControl>
              <Input
                disabled={isViewMode}
                placeholder="Enter target name"
                className="hover:border-eco-purple/70 focus:border-eco-purple transition-colors"
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
            <FormLabel className="font-medium">Description</FormLabel>
            <FormControl>
              <Textarea
                disabled={isViewMode}
                placeholder="Enter target description"
                className="hover:border-eco-purple/70 focus:border-eco-purple transition-colors resize-none"
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
