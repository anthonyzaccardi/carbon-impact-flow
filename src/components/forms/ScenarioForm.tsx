
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
import { useAppContext } from "@/contexts/useAppContext";
import { Scenario } from "@/types";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Scenario name must be at least 3 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface ScenarioFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Scenario;
  onClose: () => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({
  mode,
  initialData,
  onClose,
}) => {
  const isViewMode = mode === "view";
  const { 
    createScenario, 
    updateScenario,
    targets,
  } = useAppContext();
  
  const [scenarioTargets, setScenarioTargets] = useState<typeof targets>([]);

  useEffect(() => {
    if (initialData) {
      const associatedTargets = targets.filter(target => target.scenarioId === initialData.id);
      setScenarioTargets(associatedTargets);
    }
  }, [initialData, targets]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  function onSubmit(data: FormData) {
    if (mode === "create") {
      createScenario({
        name: data.name,
      });
    } else if (mode === "edit" && initialData) {
      updateScenario(initialData.id, {
        name: data.name,
      });
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Associated targets in view mode */}
        {isViewMode && scenarioTargets.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Associated Targets</h3>
            <ul className="space-y-1">
              {scenarioTargets.map(target => (
                <li key={target.id} className="text-sm bg-accent/30 p-2 rounded-md">
                  <div className="font-medium">{target.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {target.targetPercentage}% reduction by {new Date(target.targetDate).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
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

export default ScenarioForm;
