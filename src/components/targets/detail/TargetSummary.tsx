import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Track } from "@/types";

interface TargetSummaryProps {
  target: Target;
  track: Track | undefined;
  totalImpact: number;
  totalSpend: number;
}

export const TargetSummary = ({ target, track, totalImpact, totalSpend }: TargetSummaryProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Target Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Track</p>
                <p className="text-lg font-medium flex items-center">
                  {track && (
                    <>
                      <span className="mr-1">{track.emoji}</span>
                      <span>{track.name}</span>
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target reduction</p>
                <p className="text-lg font-medium">{target.targetPercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Baseline</p>
                <p className="text-lg font-medium">{target.baselineValue.toLocaleString()} tCO2e</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target value</p>
                <p className="text-lg font-medium">{target.targetValue.toLocaleString()} tCO2e</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target date</p>
                <p className="text-lg font-medium">{new Date(target.targetDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-medium">{target.status}</p>
              </div>
            </div>
            {target.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{target.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Initiatives impact</CardTitle>
          <CardDescription>
            Current initiatives coverage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Coverage</span>
                <span className="text-sm font-medium">
                  {target.targetValue > 0 
                    ? Math.min(100, Math.round((totalImpact / target.targetValue) * 100)) 
                    : 0}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(100, Math.round((totalImpact / target.targetValue) * 100))}%` }} 
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Impact</p>
              <p className="text-2xl font-medium">
                {totalImpact.toLocaleString()} tCO2e
              </p>
              <p className="text-sm text-muted-foreground">
                of {target.targetValue.toLocaleString()} tCO2e target
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total investment</p>
              <p className="text-2xl font-medium">
                ${totalSpend.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
