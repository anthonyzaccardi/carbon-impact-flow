
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
import { Measurement } from "@/types";
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

const formSchema = z.object({
  trackId: z.string().min(1, {
    message: "Please select a track.",
  }),
  factorId: z.string().min(1, {
    message: "Please select a factor.",
  }),
  supplierId: z.string().optional(),
  date: z.date({
    required_error: "Date is required.",
  }),
  quantity: z.coerce.number().positive({
    message: "Quantity must be a positive number.",
  }),
  unit: z.string().min(1, {
    message: "Unit is required.",
  }),
  notes: z.string().optional(),
  status: z.enum(["active", "pending", "completed", "cancelled"]),
});

type FormData = z.infer<typeof formSchema>;

interface MeasurementFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Measurement;
  onClose: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({
  mode,
  initialData,
  onClose,
}) => {
  const isViewMode = mode === "view";
  const { 
    createMeasurement, 
    updateMeasurement, 
    tracks, 
    factors,
    suppliers 
  } = useAppContext();
  
  const [availableFactors, setAvailableFactors] = useState(factors);
  const [selectedTrackUnit, setSelectedTrackUnit] = useState("");
  const [calculatedValue, setCalculatedValue] = useState(0);

  // Parse dates for the form
  const formattedData = initialData
    ? {
        ...initialData,
        date: new Date(initialData.date),
      }
    : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formattedData || {
      trackId: "",
      factorId: "",
      date: new Date(),
      quantity: 0,
      unit: "",
      status: "active",
    },
  });

  // Watch for changes in trackId and quantity and factorId to update calculations
  const watchTrackId = form.watch("trackId");
  const watchQuantity = form.watch("quantity");
  const watchFactorId = form.watch("factorId");

  // Filter factors when track changes
  useEffect(() => {
    if (watchTrackId) {
      const filteredFactors = factors.filter(
        (factor) => factor.trackId === watchTrackId
      );
      setAvailableFactors(filteredFactors);

      // Update the track unit
      const selectedTrack = tracks.find((track) => track.id === watchTrackId);
      if (selectedTrack) {
        setSelectedTrackUnit(selectedTrack.unit);
        
        // Set the default unit from the track
        form.setValue("unit", selectedTrack.unit);
      }

      // Clear factor selection if the current one doesn't belong to the new track
      const currentFactor = form.getValues("factorId");
      if (currentFactor && !filteredFactors.some(f => f.id === currentFactor)) {
        form.setValue("factorId", "");
      }
    }
  }, [watchTrackId, factors, tracks, form]);

  // Calculate measurement value
  useEffect(() => {
    if (watchFactorId && watchQuantity) {
      const factor = factors.find((f) => f.id === watchFactorId);
      if (factor) {
        const calculatedValue = watchQuantity * factor.value;
        setCalculatedValue(calculatedValue);
      }
    }
  }, [watchFactorId, watchQuantity, factors]);

  function onSubmit(data: FormData) {
    const formattedData = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    if (mode === "create") {
      createMeasurement(formattedData);
    } else if (mode === "edit" && initialData) {
      updateMeasurement(initialData.id, formattedData);
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

        <FormField
          control={form.control}
          name="factorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Factor</FormLabel>
              <Select
                disabled={isViewMode || availableFactors.length === 0}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select factor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableFactors.map((factor) => (
                    <SelectItem key={factor.id} value={factor.id}>
                      {factor.name} ({factor.value} {factor.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {availableFactors.length === 0 && watchTrackId && (
                <p className="text-sm text-amber-500 mt-1">
                  No factors available for this track. Please create a factor first.
                </p>
              )}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} disabled={isViewMode} />
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
                <FormControl>
                  <Input {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Calculation card */}
        {watchFactorId && watchQuantity > 0 && (
          <Card className="bg-accent/50">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium mb-2">Calculation Preview</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium">{watchQuantity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Factor:</span>
                  <p className="font-medium">
                    {factors.find((f) => f.id === watchFactorId)?.value || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Result:</span>
                  <p className="font-medium">
                    {calculatedValue.toFixed(2)} {selectedTrackUnit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isViewMode && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!watchTrackId || !watchFactorId || watchQuantity <= 0}
            >
              Save
            </Button>
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

export default MeasurementForm;
