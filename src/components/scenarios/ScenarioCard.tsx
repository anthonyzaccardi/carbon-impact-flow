
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Track, Scenario, Target } from "@/types";

interface ScenarioCardProps {
  scenario: Scenario;
  trackGroups: {
    track: Track | undefined;
    targets: Target[];
    totalReduction: number;
  }[];
  stats: {
    totalTargets: number;
    totalReduction: number;
    uniqueTracks: number;
    startYear: number | null;
    endYear: number | null;
  };
  onClick: () => void;
}

export const ScenarioCard = ({ scenario, trackGroups, stats, onClick }: ScenarioCardProps) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer animate-scale-in overflow-hidden"
      onClick={onClick}
    >
      <div className="h-2 w-full bg-gradient-purple"></div>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{scenario.name}</CardTitle>
        <CardDescription>
          {stats.startYear && stats.endYear ? 
            `${stats.startYear} - ${stats.endYear}` : 
            "No targets"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Targets:</div>
            {trackGroups.length > 0 ? (
              <ul className="space-y-2">
                {trackGroups.map(({ track, totalReduction }) => track && (
                  <li key={track.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="mr-1">{track.emoji}</span>
                      <span>{track.name}</span>
                    </div>
                    <span className="text-green-500 font-medium">
                      -{totalReduction.toLocaleString()} tCO2e
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No targets assigned</p>
            )}
          </div>
          
          <div className="pt-2 mt-2 border-t flex justify-between text-sm">
            <span className="font-medium">Total Reduction:</span>
            <span className="font-bold text-eco-darkPurple">{stats.totalReduction.toLocaleString()} tCO2e</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
