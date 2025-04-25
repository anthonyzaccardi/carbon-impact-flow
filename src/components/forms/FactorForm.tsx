
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
import { Factor, Measurement } from "@/types";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

const formSchema = z.object({
  trackId: z.string().min(1, {
    message: "Please select a track.",
  }),
  name: z.string().min(3, {
    message: "Factor name must be at least 3 characters.",
  }),
  value: z.coerce.number().positive({
    message: "Value must be a positive number.",
  }),
  unit: z.string().min(1, {
    message: "Unit is required.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  })
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  "Stationary Combustion",
  "Mobile Combustion",
  "Purchased Electricity",
  "Business Travel",
  "Employee Commuting",
  "Waste Disposal",
  "Water",
  "Materials",
  "Transportation",
  "Processing",
];

const units = [
  "kgCO2e/kWh",
  "kgCO2e/L",
  "kgCO2e/km",
  "kgCO2e/kg",
  "kgCO2e/m³",
  "tCO2e/tonne",
];

interface FactorFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Factor;
  onClose: () => void;
}

const FactorForm: React.FC<FactorFormProps> = ({ mode, initialData, onClose }) => {
  const isViewMode = mode === "view";
  const { createFactor, updateFactor, deleteFactor, tracks, measurements, openSidePanel } = useAppContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Get measurements that use this factor
  const relatedMeasurements = initialData 
    ? measurements.filter(m => m.factorId === initialData.id) 
    : [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      trackId: "",
      name: "",
      value: 0,
      unit: "",
      category: "",
    },
  });

  function onSubmit(data: FormData) {
    if (mode === "create") {
      // Ensure all required properties are provided for a new factor
      const newFactor: Omit<Factor, "id" | "createdAt" | "updatedAt"> = {
        trackId: data.trackId,
        name: data.name,
        value: data.value,
        unit: data.unit,
        category: data.category,
      };
      createFactor(newFactor);
    } else if (mode === "edit" && initialData) {
      updateFactor(initialData.id, data);
    }
    onClose();
  }

  function onDelete() {
    if (initialData) {
      deleteFactor(initialData.id);
      onClose();
    }
  }

  function handleEdit() {
    if (initialData) {
      openSidePanel('edit', 'factor', initialData);
    }
  }

  function viewMeasurement(measurement: Measurement) {
    openSidePanel('view', 'measurement', measurement);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">
          {isViewMode ? initialData?.name : `${mode === 'create' ? 'Create' : 'Edit'} Factor`}
        </h3>
        {isViewMode && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {!isViewMode ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="trackId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track</FormLabel>
                  <Select
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
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
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Track</p>
              <p>
                {(() => {
                  const track = tracks.find(t => t.id === initialData?.trackId);
                  return track ? (
                    <span className="flex items-center">
                      <span className="mr-1">{track.emoji}</span> {track.name}
                    </span>
                  ) : initialData?.trackId;
                })()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p>{initialData?.category}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Value</p>
              <p>{initialData?.value} {initialData?.unit}</p>
            </div>
          </div>
            
          {relatedMeasurements.length > 0 && (
            <div className="mt-8">
              <h4 className="text-md font-medium mb-2">Measurements using this factor</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Calculated Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedMeasurements.map((measurement) => (
                    <TableRow 
                      key={measurement.id} 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => viewMeasurement(measurement)}
                    >
                      <TableCell>
                        {new Date(measurement.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {measurement.quantity} {measurement.unit}
                      </TableCell>
                      <TableCell>
                        {measurement.calculatedValue.toLocaleString()} {initialData?.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose} type="button">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {relatedMeasurements.length > 0 
                ? `This factor cannot be deleted because it's used by ${relatedMeasurements.length} measurements.` 
                : "This action cannot be undone. This will permanently delete the factor."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {relatedMeasurements.length === 0 && (
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FactorForm;
