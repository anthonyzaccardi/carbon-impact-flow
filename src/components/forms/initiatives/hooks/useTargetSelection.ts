
import { useEffect, useState } from "react";
import { Target } from "@/types";
import { useAppContext } from "@/contexts/useAppContext";

interface UseTargetSelectionProps {
  targetIds: string[];
  plan: string;
}

export const useTargetSelection = ({ targetIds, plan }: UseTargetSelectionProps) => {
  const { targets, calculateTrackMeasurementsValue, extractPercentage } = useAppContext();
  const [selectedTargets, setSelectedTargets] = useState<Target[]>([]);
  const [calculatedAbsolute, setCalculatedAbsolute] = useState(0);

  useEffect(() => {
    if (targetIds && targetIds.length > 0) {
      const targetsData = targets.filter(t => targetIds.includes(t.id));
      setSelectedTargets(targetsData);

      let absoluteValue = 0;
      
      if (targetsData.length > 0) {
        absoluteValue = targetsData.reduce((sum, target) => {
          if (target.trackId) {
            const trackMeasurementsValue = calculateTrackMeasurementsValue(target.trackId);
            return sum + (trackMeasurementsValue * Math.abs(extractPercentage(plan)));
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
  }, [targetIds, plan, targets, calculateTrackMeasurementsValue, extractPercentage]);

  return {
    selectedTargets,
    calculatedAbsolute
  };
};
