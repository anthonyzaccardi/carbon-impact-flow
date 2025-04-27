
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/useAppContext";
import { Target } from "@/types";
import { targetFormSchema, type TargetFormData } from "./targets/schema";

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
  const { createTarget, updateTarget } = useAppContext();

  const formattedData = initialData
    ? {
        ...initialData,
      }
    : undefined;

  const form = useForm<TargetFormData>({
    resolver: zodResolver(targetFormSchema),
    defaultValues: formattedData || {
      trackId: "",
      name: "",
      description: "",
      baselineValue: 0,
      targetPercentage: 0,
      targetDate: new Date().toISOString().split('T')[0], // Format date as YYYY-MM-DD string
      status: "active",
    },
  });

  function onSubmit(data: TargetFormData) {
    // Ensure we have all required fields for a target
    const targetData: Omit<Target, 'id' | 'createdAt' | 'updatedAt' | 'targetValue'> = {
      trackId: data.trackId,
      name: data.name,
      description: data.description,
      baselineValue: data.baselineValue,
      targetPercentage: data.targetPercentage,
      targetDate: data.targetDate,
      status: data.status,
      // Include optional fields if they exist
      ...(data.scenarioId && { scenarioId: data.scenarioId }),
      ...(data.supplierId && { supplierId: data.supplierId })
    };
    
    if (mode === "create") {
      createTarget(targetData);
    } else if (mode === "edit" && initialData) {
      updateTarget(initialData.id, targetData);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="trackId">Track ID</Label>
          <Input id="trackId" {...form.register("trackId")} disabled={isViewMode} />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} disabled={isViewMode} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...form.register("description")} disabled={isViewMode} />
        </div>
        <div>
          <Label htmlFor="baselineValue">Baseline Value</Label>
          <Input
            type="number"
            id="baselineValue"
            {...form.register("baselineValue", { valueAsNumber: true })}
            disabled={isViewMode}
          />
        </div>
        <div>
          <Label htmlFor="targetPercentage">Target Percentage</Label>
          <Input
            type="number"
            id="targetPercentage"
            {...form.register("targetPercentage", { valueAsNumber: true })}
            disabled={isViewMode}
          />
        </div>
        <div>
          <Label htmlFor="targetDate">Target Date</Label>
          <Input type="date" id="targetDate" {...form.register("targetDate")} disabled={isViewMode} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Input id="status" {...form.register("status")} disabled={isViewMode} />
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

export default TargetForm;
