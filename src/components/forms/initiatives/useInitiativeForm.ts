
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Initiative, Target } from "@/types";
import { InitiativeFormData, initiativeFormSchema } from "./schema";
import { useAppContext } from "@/contexts/useAppContext";

interface UseInitiativeFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Initiative;
  onClose: () => void;
}

export const useInitiativeForm = ({ mode, initialData, onClose }: UseInitiativeFormProps) => {
  const { createInitiative, updateInitiative, targets, calculateTrackMeasurementsValue, extractPercentage } = useAppContext();
  const [selectedTargets, setSelectedTargets] = useState<Target[]>([]);
  const [calculatedAbsolute, setCalculatedAbsolute] = useState(0);

  const defaultValues = initialData
    ? {
        ...initialData,
        startDate: new Date(initialData.startDate),
        endDate: new Date(initialData.endDate),
        targetIds: initialData.targetIds || [],
        description: initialData.description || ""
      }
    : {
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        status: "not_started",
        spend: 0,
        trajectory: "linear",
        plan: "-6%",
        currency: "USD",
        targetIds: [],
      };

  const form = useForm<InitiativeFormData>({
    resolver: zodResolver(initiativeFormSchema),
    defaultValues,
  });

  const watchTargetIds = form.watch("targetIds");
  const watchPlan = form.watch("plan");

  useEffect(() => {
    if (watchTargetIds && watchTargetIds.length > 0) {
      const targetsData = targets.filter(t => watchTargetIds.includes(t.id));
      setSelectedTargets(targetsData);

      let absoluteValue = 0;
      
      if (targetsData.length > 0) {
        absoluteValue = targetsData.reduce((sum, target) => {
          if (target.trackId) {
            const trackMeasurementsValue = calculateTrackMeasurementsValue(target.trackId);
            return sum + (trackMeasurementsValue * Math.abs(extractPercentage(watchPlan)));
          }
          return sum;
        }, 0);
        
        if (targetsData.length > 1) {
          absoluteValue /= targetsData.length;
        }
      }
      
      setCalculatedAbsolute(absoluteValue);
    } else {
      setSelectedTargets([]);
      setCalculatedAbsolute(0);
    }
  }, [watchTargetIds, watchPlan, targets, calculateTrackMeasurementsValue, extractPercentage]);

  const onSubmit = (data: InitiativeFormData) => {
    const formattedData = {
      ...data,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
    };

    if (mode === "create") {
      createInitiative(formattedData);
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
