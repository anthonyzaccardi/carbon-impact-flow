
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
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/useAppContext";

interface ValueFieldsProps {
  form: UseFormReturn<TargetFormData>;
  isViewMode: boolean;
}

export const ValueFields = ({ form, isViewMode }: ValueFieldsProps) => {
  const { tracks } = useAppContext();
  const [isTrackSelected, setIsTrackSelected] = useState(false);
  
  // Watch for track selection changes
  const selectedTrackId = form.watch('trackId');
  
  // Update baseline value when track changes
  useEffect(() => {
    if (selectedTrackId) {
      const selectedTrack = tracks.find(track => track.id === selectedTrackId);
      if (selectedTrack) {
        form.setValue('baselineValue', selectedTrack.totalEmissions);
        setIsTrackSelected(true);
      }
    } else {
      setIsTrackSelected(false);
    }
  }, [selectedTrackId, tracks, form]);
  
  // Update target value calculation when baseline or percentage changes
  useEffect(() => {
    const baselineValue = form.watch('baselineValue');
    const targetPercentage = form.watch('targetPercentage');
    
    if (baselineValue !== undefined && targetPercentage) {
      // Convert percentage string to number
      const percentageValue = parseInt(targetPercentage);
      // Calculate target value: baseline - (baseline * percentage/100)
      const calculatedValue = baselineValue * (1 + percentageValue / 100);
      
      // We're not setting a targetValue field directly as it's calculated on the server
      // This is just for display/preview
    }
  }, [form.watch('baselineValue'), form.watch('targetPercentage'), form]);

  return (
    <>
      <div>
        <FormField
          control={form.control}
          name="baselineValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baseline Value (tCO₂e)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  disabled={true}
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                Using track's total emissions as baseline
              </p>
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

      {isTrackSelected && (
        <div>
          <FormItem>
            <FormLabel>Target Value (tCO₂e)</FormLabel>
            <div className="border rounded-md p-2 bg-muted/30">
              <span>
                {form.watch('baselineValue') * (1 + parseInt(form.watch('targetPercentage') || "-5") / 100)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Calculated from baseline and target percentage
            </p>
          </FormItem>
        </div>
      )}
    </>
  );
};
