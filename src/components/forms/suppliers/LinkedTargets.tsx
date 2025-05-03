
import { Target } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface LinkedTargetsProps {
  supplierId: string;
  targets: Target[];
  isViewMode?: boolean;
}

export const LinkedTargets = ({
  supplierId,
  targets,
  isViewMode = true
}: LinkedTargetsProps) => {
  if (targets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linked Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No targets linked to this supplier</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Targets</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {targets.map(target => (
            <li key={target.id} className="p-2 bg-accent/30 rounded-md">
              <div className="font-medium">{target.name}</div>
              <div className="text-sm text-muted-foreground">{target.targetPercentage}% reduction by {new Date(target.targetDate).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
