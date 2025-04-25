
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
import { Initiative } from "@/types";
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
  targetId: z.string().min(1, {
    message: "Please select a target.",
  }),
  name: z.string().min(3, {
    message: "Initiative name must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  impactPercentage: z.coerce.number().min(0).max(100, {
    message: "Impact percentage must be between 0 and 100.",
  }),
  budget: z.coerce.number().nonnegative({
    message: "Budget must be a non-negative number.",
  }),
  spent: z.coerce.number().nonnegative({
    message: "Spent amount must be a non-negative number.",
  }),
  currency: z.string().min(1, {
    message: "Currency is required.",
  }),
  status: z.enum(["active", "pending", "completed", "cancelled"]),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormData = z.infer<typeof formSchema>;

interface InitiativeFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Initiative;
  onClose: () => void;
}

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY"];

const InitiativeForm: React.FC<InitiativeFormProps> = ({
  mode,
  initialData,
  onClose,
}) => {
  const isViewMode = mode === "view";
  const { 
    createInitiative, 
    updateInitiative, 
    targets,
  } = useAppContext();

  const formattedData = initialData
    ? {
        ...initialData,
        startDate: new Date(initialData.startDate),
        endDate: new Date(initialData.endDate),
      }
    : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formattedData || {
      targetId: "",
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      impactPercentage: 0,
      budget: 0,
      spent: 0,
      currency: "USD",
      status: "active",
    },
  });

  const watchTargetId = form.watch("targetId");
  const watchImpactPercentage = form.watch("impactPercentage");
  const watchBudget = form.watch("budget");
  const watchSpent = form.watch("spent");

  const [calculatedValue, setCalculatedValue] = useState(0);
  const [targetDetails, setTargetDetails] = useState({
    baselineValue: 0,
    unit: "",
    track: "",
  });

  useEffect(() => {
    if (watchTargetId) {
      const selectedTarget = targets.find(t => t.id === watchTargetId);
      if (selectedTarget) {
        const impactValue = selectedTarget.baselineValue * (watchImpactPercentage / 100);
        setCalculatedValue(impactValue);
        
        setTargetDetails({
          baselineValue: selectedTarget.baselineValue,
          unit: "", // You might want to get the unit from the track associated with the target
          track: selectedTarget.trackId || "" // Add the track property
        });
      }
    }
  }, [watchTargetId, watchImpactPercentage, targets]);

  function onSubmit(data: FormData) {
    const formattedData = {
      ...data,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
      targetId: data.targetId,
      name: data.name,
      description: data.description,
      impactPercentage: data.impactPercentage,
      budget: data.budget,
      spent: data.spent,
      currency: data.currency,
      status: data.status
    };

    if (mode === "create") {
      createInitiative(formattedData);
    } else if (mode === "edit" && initialData) {
      updateInitiative(initialData.id, formattedData);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="targetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target</FormLabel>
              <Select
                disabled={isViewMode}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {targets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      {target.name} ({target.targetPercentage}% reduction)
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
          name="impactPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Impact Percentage (% of target's baseline)
              </FormLabel>
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
                    step={0.1}
                    {...field} 
                    disabled={isViewMode} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchTargetId && watchImpactPercentage > 0 && (
          <Card className="bg-accent/50">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium mb-2">Impact Calculation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Baseline:</span>
                  <p className="font-medium">
                    {targetDetails.baselineValue} {targetDetails.unit}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initiative Impact:</span>
                  <p className="font-medium">
                    {watchImpactPercentage}% = {calculatedValue.toFixed(2)} {targetDetails.unit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
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

          <FormField
            control={form.control}
            name="spent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spent</FormLabel>
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

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchBudget > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Progress</span>
              <span>
                {watchSpent} / {watchBudget} ({((watchSpent / watchBudget) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${Math.min((watchSpent / watchBudget) * 100, 100)}%` }}
              ></div>
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

export default InitiativeForm;
