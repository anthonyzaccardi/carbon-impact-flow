
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
import { Track } from "@/types";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Track name must be at least 3 characters.",
  }),
  emoji: z.string().min(1, {
    message: "Please select an emoji.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const emojis = ["🏭", "⚡", "🌐", "💧", "🗑️", "🌱", "🚗", "✈️", "🏢", "🌲"];

interface TrackFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Track;
  onClose: () => void;
}

const TrackForm: React.FC<TrackFormProps> = ({ mode, initialData, onClose }) => {
  const isViewMode = mode === "view";
  const { createTrack, updateTrack, getTrackStats } = useAppContext();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      emoji: initialData.emoji,
    } : {
      name: "",
      emoji: "",
    },
  });

  function onSubmit(data: FormData) {
    if (mode === "create") {
      createTrack(data);
    } else if (mode === "edit" && initialData) {
      updateTrack(initialData.id, data);
    }
    onClose();
  }

  // Get track stats for view mode
  const trackStats = initialData ? getTrackStats(initialData.id) : { factorsCount: 0, measurementsCount: 0, targetsCount: 0 };

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

        {isViewMode && initialData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Factors</div>
              <div className="text-lg font-semibold">{trackStats.factorsCount}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Measurements</div>
              <div className="text-lg font-semibold">{trackStats.measurementsCount}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Targets</div>
              <div className="text-lg font-semibold">{trackStats.targetsCount}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-muted-foreground">Total Emissions</div>
              <div className="text-lg font-semibold">{initialData.totalEmissions.toLocaleString()} tCO₂e</div>
            </div>
          </div>
        )}

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
