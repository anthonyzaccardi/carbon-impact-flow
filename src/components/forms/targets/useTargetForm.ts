
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/contexts/useAppContext";
import { Target, Status, TargetPercentage } from "@/types";
import { targetFormSchema, type TargetFormData } from "./schema";
import { useEffect } from "react";

interface UseTargetFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Target;
  onClose: () => void;
}

export const useTargetForm = ({ mode, initialData, onClose }: UseTargetFormProps) => {
  const { createTarget, updateTarget, tracks } = useAppContext();

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

  // Update baseline value when track changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'trackId' && value.trackId) {
        const selectedTrack = tracks.find(t => t.id === value.trackId);
        if (selectedTrack) {
          form.setValue('baselineValue', selectedTrack.totalEmissions);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, tracks]);

  const onSubmit = (data: TargetFormData) => {
    // Calculate target value based on baseline and percentage (correct formula)
    const targetPercentageNum = parseInt(data.targetPercentage);
    const targetValue = data.baselineValue * (1 - targetPercentageNum / 100);

    const targetData = {
      ...data,
      targetPercentage: parseInt(data.targetPercentage),
      targetValue: targetValue, // Corrected target value calculation
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
