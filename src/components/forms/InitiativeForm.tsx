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
import { useAppContext } from "@/contexts/useAppContext";
import { Initiative, InitiativeStatus, PlanType, TrajectoryType } from "@/types";
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
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const formSchema = z.object({
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
  status: z.enum(["not_started", "in_progress", "completed", "committed"], {
    required_error: "Status is required.",
  }),
  spend: z.coerce.number().nonnegative({
    message: "Spend amount must be a non-negative number.",
  }),
  trajectory: z.enum(["every_year", "linear"], {
    required_error: "Trajectory type is required.",
  }),
  plan: z.enum(["-2%", "-4%", "-6%", "-8%", "-10%"], {
    required_error: "Reduction plan is required.",
  }),
  currency: z.string().min(1, {
    message: "Currency is required.",
  }),
  targetIds: z.array(z.string()).optional(),
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
const statusColorMap: Record<InitiativeStatus, string> = {
  not_started: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  committed: 'bg-purple-100 text-purple-800',
};

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
    extractPercentage,
    calculateTrackMeasurementsValue
  } = useAppContext();

  const formattedData = initialData
    ? {
        ...initialData,
        startDate: new Date(initialData.startDate),
        endDate: new Date(initialData.endDate),
        targetIds: initialData.targetIds || [],
      }
    : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formattedData || {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: "not_started",
      spend: 0,
      trajectory: "linear",
      plan: "-6%",
      currency: "USD",
      targetIds: [],
    },
  });

  const watchTargetIds = form.watch("targetIds");
  const watchPlan = form.watch("plan");
  const watchSpend = form.watch("spend");

  const [calculatedAbsolute, setCalculatedAbsolute] = useState(0);
  const [selectedTargets, setSelectedTargets] = useState<any[]>([]);

  useEffect(() => {
    if (watchTargetIds && watchTargetIds.length > 0) {
      const targetsData = targets.filter(t => watchTargetIds.includes(t.id));
      setSelectedTargets(targetsData);

      let absoluteValue = 0;
      
      if (targetsData.length > 0) {
        absoluteValue = targetsData.reduce((sum, target) => {
          if (target.trackId) {
            const trackMeasurementsValue = calculateTrackMeasurementsValue(target.trackId);
            return sum + (trackMeasurementsValue * Math.abs(extractPercentage(watchPlan as PlanType)));
          }
          return sum;
        }, 0);
        
        if (targetsData.length > 1) {
          absoluteValue /= targetsData.length;
        }
      }
      
      setCalculatedAbsolute(absoluteValue);
    } else {
      setSelectedTargets([]);
      setCalculatedAbsolute(0);
    }
  }, [watchTargetIds, watchPlan, targets, calculateTrackMeasurementsValue, extractPercentage]);

  function onSubmit(data: FormData) {
    const formattedData = {
      ...data,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
      name: data.name,
      description: data.description,
      status: data.status as InitiativeStatus,
      spend: data.spend,
      trajectory: data.trajectory as TrajectoryType,
      plan: data.plan as PlanType,
      currency: data.currency,
      targetIds: data.targetIds || [],
      absolute: calculatedAbsolute,
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
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="committed">Committed</SelectItem>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reduction Plan</FormLabel>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="-2%">-2%</SelectItem>
                    <SelectItem value="-4%">-4%</SelectItem>
                    <SelectItem value="-6%">-6%</SelectItem>
                    <SelectItem value="-8%">-8%</SelectItem>
                    <SelectItem value="-10%">-10%</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trajectory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trajectory</FormLabel>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trajectory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="every_year">Every Year</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isViewMode && selectedTargets.length > 0 && (
          <Card className="bg-accent/50">
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium mb-2">Impact Calculation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reduction Plan:</span>
                  <p className="font-medium">{form.getValues().plan}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Absolute Value:</span>
                  <p className="font-medium">{calculatedAbsolute.toFixed(2)} tCO₂e</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="spend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spend</FormLabel>
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

        {!isViewMode && (
          <FormField
            control={form.control}
            name="targetIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associated Targets</FormLabel>
                <div className="border rounded-md p-4 space-y-2">
                  {targets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No targets available</p>
                  ) : (
                    <div className="space-y-2">
                      {targets.map((target) => {
                        const isSelected = field.value?.includes(target.id) || false;
                        return (
                          <div 
                            key={target.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-md",
                              isSelected ? "bg-primary/10" : "hover:bg-muted cursor-pointer"
                            )}
                            onClick={() => {
                              const currentTargets = field.value || [];
                              const newTargets = isSelected 
                                ? currentTargets.filter(id => id !== target.id)
                                : [...currentTargets, target.id];
                              field.onChange(newTargets);
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                              <span className="text-sm font-medium">{target.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {target.targetPercentage}% reduction
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              By {format(new Date(target.targetDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isViewMode && initialData?.targetIds.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Associated Targets</h3>
            <div className="border rounded-md p-4 space-y-2">
              {selectedTargets.map((target) => (
                <div 
                  key={target.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{target.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {target.targetPercentage}% reduction
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    By {format(new Date(target.targetDate), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
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
