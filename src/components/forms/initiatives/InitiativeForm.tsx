
import { Initiative } from "@/types";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useInitiativeForm } from "./useInitiativeForm";
import { AssociatedTargets } from "./AssociatedTargets";
import { TargetSelector } from "./TargetSelector";
import { Textarea } from "@/components/ui/textarea";
import { BasicInformationSection } from "./sections/BasicInformationSection";
import { DatesSection } from "./sections/DatesSection";
import { PlanSection } from "./sections/PlanSection";
import { FinancialSection } from "./sections/FinancialSection";
import { FormActions } from "./sections/FormActions";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface InitiativeFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Initiative;
  onClose: () => void;
}

const InitiativeForm = ({ mode, initialData, onClose }: InitiativeFormProps) => {
  const { form, selectedTargets, calculatedAbsolute, onSubmit, isViewMode } = useInitiativeForm({
    mode,
    initialData,
    onClose,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInformationSection form={form} isViewMode={isViewMode} />

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

        <DatesSection form={form} isViewMode={isViewMode} />
        <PlanSection form={form} isViewMode={isViewMode} />
        <FinancialSection form={form} isViewMode={isViewMode} />

        {/* Impact Calculation Card */}
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

        {/* Target Selection */}
        {!isViewMode ? (
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
        ) : (
          <AssociatedTargets targets={selectedTargets} isViewMode />
        )}

        <FormActions isViewMode={isViewMode} onClose={onClose} />
      </form>
    </Form>
  );
};

export default InitiativeForm;
