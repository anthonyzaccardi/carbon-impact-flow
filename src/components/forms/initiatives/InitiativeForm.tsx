
import { Initiative } from "@/types";
import { Form } from "@/components/ui/form";
import { useInitiativeForm } from "./useInitiativeForm";
import { BasicInformationSection } from "./sections/BasicInformationSection";
import { DatesSection } from "./sections/DatesSection";
import { PlanSection } from "./sections/PlanSection";
import { FinancialSection } from "./sections/FinancialSection";
import { FormActions } from "./sections/FormActions";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ImpactCalculationSection } from "./sections/ImpactCalculationSection";
import { TargetSelectionSection } from "./sections/TargetSelectionSection";

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

        {isViewMode && selectedTargets.length > 0 && (
          <ImpactCalculationSection
            form={form}
            selectedTargets={selectedTargets}
            calculatedAbsolute={calculatedAbsolute}
          />
        )}

        <TargetSelectionSection
          form={form}
          selectedTargets={selectedTargets}
          isViewMode={isViewMode}
        />

        <FormActions isViewMode={isViewMode} onClose={onClose} />
      </form>
    </Form>
  );
};

export default InitiativeForm;
