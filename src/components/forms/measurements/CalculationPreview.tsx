
import { Card, CardContent } from "@/components/ui/card";
import { Factor } from "@/types";

interface CalculationPreviewProps {
  quantity: number;
  factorId: string;
  factors: Factor[];
  calculatedValue: number;
  selectedTrackUnit: string;
}

const CalculationPreview = ({
  quantity,
  factorId,
  factors,
  calculatedValue,
  selectedTrackUnit,
}: CalculationPreviewProps) => {
  if (!factorId || quantity <= 0) return null;

  return (
    <Card className="bg-accent/50">
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium mb-2">Calculation Preview</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Quantity:</span>
            <p className="font-medium">{quantity}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Factor:</span>
            <p className="font-medium">
              {factors.find((f) => f.id === factorId)?.value || 0}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Result:</span>
            <p className="font-medium">
              {calculatedValue.toFixed(2)} {selectedTrackUnit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationPreview;

