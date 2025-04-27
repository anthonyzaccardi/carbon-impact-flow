
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { InitiativeFormData } from "../schema";
import { Target } from "@/types";
import { TargetSelector } from "../TargetSelector";
import { AssociatedTargets } from "../AssociatedTargets";

interface TargetSelectionSectionProps {
  form: UseFormReturn<InitiativeFormData>;
  selectedTargets: Target[];
  isViewMode: boolean;
}

export const TargetSelectionSection = ({
  form,
  selectedTargets,
  isViewMode
}: TargetSelectionSectionProps) => {
  if (isViewMode) {
    return <AssociatedTargets targets={selectedTargets} isViewMode />;
  }

  return (
    <FormField
      control={form.control}
      name="targetIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Associated Targets</FormLabel>
          <div className="border rounded-md p-4">
            <TargetSelector
              targets={selectedTargets}
              selectedTargets={field.value || []}
              onSelect={(targetId) => {
                const currentTargets = field.value || [];
                const newTargets = currentTargets.includes(targetId)
                  ? currentTargets.filter(id => id !== targetId)
                  : [...currentTargets, targetId];
                field.onChange(newTargets);
              }}
              disabled={isViewMode}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
