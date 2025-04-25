
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AppContext";
import { Target } from "@/types";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  trackId: z.string().min(1, {
    message: "Please select a track.",
  }),
  scenarioId: z.string().optional(),
  supplierId: z.string().optional(),
  name: z.string().min(3, {
    message: "Target name must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  baselineValue: z.coerce.number().positive({
    message: "Baseline value must be a positive number.",
  }),
  targetValue: z.coerce.number().nonnegative({
    message: "Target value must be a non-negative number.",
  }),
  targetPercentage: z.coerce.number().min(0).max(100, {
    message: "Percentage must be between 0 and 100.",
  }),
  targetDate: z.date({
    required_error: "Target date is required.",
  }),
  status: z.enum(["active", "pending", "completed", "cancelled"]),
});

type FormData = z.infer<typeof formSchema>;

interface TargetFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Target;
  onClose: () => void;
}

const TargetForm: React.FC<TargetFormProps> = ({
  mode,
  initialData,
  onClose,
}) => {
  const isViewMode = mode === "view";
  const { 
    createTarget, 
    updateTarget, 
    tracks,
    scenarios,
    suppliers,
  } = useAppContext();

  // Parse dates for the form
  const formattedData = initialData
    ? {
        ...initialData,
        targetDate: new Date(initialData.targetDate),
      }
    : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formattedData || {
      trackId: "",
      name: "",
      description: "",
      baselineValue: 0,
      targetValue: 0,
      targetPercentage: 0,
      targetDate: new Date(),
      status: "active",
    },
  });

  // Watch for changes in relevant fields
  const watchBaselineValue = form.watch("baselineValue");
  const watchTargetPercentage = form.watch("targetPercentage");
  const watchTargetValue = form.watch("targetValue");
  const watchTrackId = form.watch("trackId");

  // Track unit state
  const [trackUnit, setTrackUnit] = useState("");

  // Update unit when track changes
  useEffect(() => {
    if (watchTrackId) {
      const selectedTrack = tracks.find((track) => track.id === watchTrackId);
      if (selectedTrack) {
        setTrackUnit(selectedTrack.unit);
      }
    }
  }, [watchTrackId, tracks]);

  // Sync percentage and target value
  useEffect(() => {
    if (form.formState.dirtyFields.baselineValue || form.formState.dirtyFields.targetPercentage) {
      // If baseline or percentage changed, update target value
      const newValue = watchBaselineValue * (1 - watchTargetPercentage / 100);
      form.setValue("targetValue", parseFloat(newValue.toFixed(2)), { shouldDirty: true });
    } else if (form.formState.dirtyFields.targetValue) {
      // If target value changed directly, update percentage
      const newPercentage = ((watchBaselineValue - watchTargetValue) / watchBaselineValue) * 100;
      form.setValue("targetPercentage", parseFloat(newPercentage.toFixed(2)), { shouldDirty: true });
    }
  }, [watchBaselineValue, watchTargetPercentage, watchTargetValue, form]);

  function onSubmit(data: FormData) {
    const formattedData = {
      ...data,
      targetDate: format(data.targetDate, "yyyy-MM-dd"),
    };

    if (mode === "create") {
      createTarget(formattedData);
    } else if (mode === "edit" && initialData) {
      updateTarget(initialData.id, formattedData);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="trackId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track</FormLabel>
              <Select
                disabled={isViewMode}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.emoji} {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scenarioId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scenario (Optional)</FormLabel>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        {scenario.name}
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        </div>

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
            name="targetDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Target Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewMode}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
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

        <FormField
          control={form.control}
          name="baselineValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baseline Value ({trackUnit})</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  disabled={isViewMode} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="targetPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reduction Percentage (%)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      disabled={isViewMode}
                      onValueChange={(vals) => {
                        field.onChange(vals[0]);
                      }}
                    />
                    <Input 
                      type="number" 
                      min={0}
                      max={100}
                      step="0.1"
                      {...field} 
                      disabled={isViewMode} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value ({trackUnit})</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field} 
                    disabled={isViewMode} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Calculation card */}
        {watchBaselineValue > 0 && watchTargetPercentage > 0 && (
          <Card className="bg-accent/50">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium mb-2">Reduction Overview</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Baseline:</span>
                  <p className="font-medium">{watchBaselineValue} {trackUnit}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reduction:</span>
                  <p className="font-medium">{watchTargetPercentage}% ({(watchBaselineValue * watchTargetPercentage / 100).toFixed(2)} {trackUnit})</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target:</span>
                  <p className="font-medium">{watchTargetValue} {trackUnit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

export default TargetForm;
