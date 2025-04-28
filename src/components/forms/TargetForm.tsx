
import { Form } from "@/components/ui/form";
import { Target } from "@/types";
import { TargetFormFields } from "./targets/TargetFormFields";
import { TargetFormActions } from "./targets/TargetFormActions";
import { useTargetForm } from "./targets/useTargetForm";

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
  const { form, onSubmit, isViewMode } = useTargetForm({
    mode,
    initialData,
    onClose,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TargetFormFields form={form} isViewMode={isViewMode} />
        <TargetFormActions isViewMode={isViewMode} onClose={onClose} />
      </form>
    </Form>
  );
};

export default TargetForm;
