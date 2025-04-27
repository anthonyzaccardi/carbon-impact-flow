
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { InitiativeFormData } from "../schema";
import { Target } from "@/types";

interface ImpactCalculationSectionProps {
  form: UseFormReturn<InitiativeFormData>;
  selectedTargets: Target[];
  calculatedAbsolute: number;
}

export const ImpactCalculationSection = ({ 
  form, 
  selectedTargets, 
  calculatedAbsolute 
}: ImpactCalculationSectionProps) => {
  if (!selectedTargets.length) return null;

  return (
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
  );
};
