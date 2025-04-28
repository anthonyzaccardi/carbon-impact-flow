
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/contexts/useAppContext";
import { Target, Status, TargetPercentage } from "@/types";
import { targetFormSchema, type TargetFormData } from "./schema";

interface UseTargetFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Target;
  onClose: () => void;
}

export const useTargetForm = ({ mode, initialData, onClose }: UseTargetFormProps) => {
  const { createTarget, updateTarget } = useAppContext();

  const formattedData = initialData
    ? {
        ...initialData,
        targetPercentage: String(initialData.targetPercentage) as TargetPercentage,
      }
    : undefined;

  const form = useForm<TargetFormData>({
    resolver: zodResolver(targetFormSchema),
    defaultValues: formattedData || {
      trackId: "",
      name: "",
      description: "",
      baselineValue: 0,
      targetPercentage: "-5" as TargetPercentage,
      targetDate: new Date().toISOString().split('T')[0],
      status: "not_started" as Status,
    },
  });

  const onSubmit = (data: TargetFormData) => {
    const targetData = {
      ...data,
      targetPercentage: parseInt(data.targetPercentage),
      name: data.name,
      trackId: data.trackId,
      description: data.description,
      baselineValue: data.baselineValue,
      status: data.status,
      targetDate: data.targetDate,
    };

    if (mode === "create") {
      createTarget(targetData);
    } else if (mode === "edit" && initialData) {
      updateTarget(initialData.id, targetData);
    }
    onClose();
  };

  return {
    form,
    onSubmit,
    isViewMode: mode === "view"
  };
};
