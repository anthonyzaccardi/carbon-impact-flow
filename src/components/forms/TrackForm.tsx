import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { Track } from "@/types";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Track name must be at least 3 characters.",
  }),
  emoji: z.string().min(1, {
    message: "Please select an emoji.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  totalEmissions: z.coerce.number().nonnegative({
    message: "Total emissions must be a non-negative number.",
  }),
  unit: z.string().min(1, {
    message: "Unit is required.",
  }),
  status: z.enum(["active", "pending", "completed", "cancelled"]),
});

type FormData = z.infer<typeof formSchema>;

const emojis = ["🏭", "⚡", "🌐", "💧", "🗑️", "🌱", "🚗", "✈️", "🏢", "🌲"];
const units = ["tCO2e", "kgCO2e", "gCO2e", "m³", "kWh", "tonnes", "liters"];

interface TrackFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Track;
  onClose: () => void;
}

const TrackForm: React.FC<TrackFormProps> = ({ mode, initialData, onClose }) => {
  const isViewMode = mode === "view";
  const { createTrack, updateTrack } = useAppContext();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      emoji: "",
      description: "",
      totalEmissions: 0,
      unit: "",
      status: "active",
    },
  });

  function onSubmit(data: FormData) {
    // Ensure all required fields are explicitly included
    const formattedData = {
      name: data.name,
      emoji: data.emoji,
      description: data.description,
      totalEmissions: data.totalEmissions,
      unit: data.unit,
      status: data.status
    };

    if (mode === "create") {
      createTrack(formattedData);
    } else if (mode === "edit" && initialData) {
      updateTrack(initialData.id, formattedData);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  defaultValue={field.value}
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="totalEmissions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Emissions</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
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
        </div>

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

export default TrackForm;
