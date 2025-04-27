
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Track, Factor, Supplier } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { MeasurementFormData } from "./schema";
import CalculationPreview from "./CalculationPreview";

interface MeasurementFormFieldsProps {
  form: UseFormReturn<MeasurementFormData>;
  isViewMode: boolean;
  tracks: Track[];
  factors: Factor[];
  suppliers: Supplier[];
  availableFactors: Factor[];
  selectedTrackUnit: string;
  calculatedValue: number;
}

const MeasurementFormFields = ({
  form,
  isViewMode,
  tracks,
  factors,
  suppliers,
  availableFactors,
  selectedTrackUnit,
  calculatedValue,
}: MeasurementFormFieldsProps) => {
  const watchTrackId = form.watch("trackId");
  const watchQuantity = form.watch("quantity");
  const watchFactorId = form.watch("factorId");

  return (
    <>
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

      <CalculationPreview
        quantity={watchQuantity}
        factorId={watchFactorId}
        factors={factors}
        calculatedValue={calculatedValue}
        selectedTrackUnit={selectedTrackUnit}
      />
    </>
  );
};

export default MeasurementFormFields;

