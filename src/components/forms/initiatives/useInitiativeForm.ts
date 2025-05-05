
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Initiative } from "@/types";
import { InitiativeFormData, initiativeFormSchema } from "./schema";
import { useAppContext } from "@/contexts/useAppContext";
import { useTargetSelection } from "./hooks/useTargetSelection";
import { prepareInitialValues } from "./utils/formUtils";
import { formatDateForApi } from "./utils/dateUtils";
import { format, isValid } from "date-fns";

interface UseInitiativeFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Initiative;
  onClose: () => void;
}

export const useInitiativeForm = ({ mode, initialData, onClose }: UseInitiativeFormProps) => {
  const { createInitiative, updateInitiative } = useAppContext();
  
  // Define defaultValues with proper type casting and date validation
  const defaultValues = prepareInitialValues(initialData);

  const form = useForm<InitiativeFormData>({
    resolver: zodResolver(initiativeFormSchema),
    defaultValues,
  });

  const watchTargetIds = form.watch("targetIds");
  const watchPlan = form.watch("plan");

  const { selectedTargets, calculatedAbsolute } = useTargetSelection({
    targetIds: watchTargetIds || [], 
    plan: watchPlan
  });

  const onSubmit = (data: InitiativeFormData) => {
    // Ensure we have valid dates before formatting
    const startDate = isValid(data.startDate) 
      ? format(data.startDate, "yyyy-MM-dd") 
      : format(new Date(), "yyyy-MM-dd");
      
    const endDate = isValid(data.endDate) 
      ? format(data.endDate, "yyyy-MM-dd") 
      : format(new Date(new Date().setMonth(new Date().getMonth() + 6)), "yyyy-MM-dd");

    const formattedData = {
      ...data,
      startDate,
      endDate,
    };

    if (mode === "create") {
      createInitiative({
        name: formattedData.name,
        description: formattedData.description,
        startDate: formattedData.startDate,
        endDate: formattedData.endDate,
        status: formattedData.status,
        spend: formattedData.spend,
        trajectory: formattedData.trajectory,
        plan: formattedData.plan,
        currency: formattedData.currency,
        targetIds: formattedData.targetIds || []
      });
    } else if (mode === "edit" && initialData) {
      updateInitiative(initialData.id, formattedData);
    }
    onClose();
  };

  return {
    form,
    selectedTargets,
    calculatedAbsolute,
    onSubmit,
    isViewMode: mode === "view",
  };
};
