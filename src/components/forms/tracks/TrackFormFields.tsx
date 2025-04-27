
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { emojis } from "./schema";
import { UseFormReturn } from "react-hook-form";
import { TrackFormData } from "./schema";

interface TrackFormFieldsProps {
  form: UseFormReturn<TrackFormData>;
  isViewMode: boolean;
}

const TrackFormFields = ({ form, isViewMode }: TrackFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <FormField
        control={form.control}
        name="emoji"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emoji</FormLabel>
            <Select
              disabled={isViewMode}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an emoji" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {emojis.map((emoji) => (
                  <SelectItem key={emoji} value={emoji}>
                    {emoji}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TrackFormFields;
