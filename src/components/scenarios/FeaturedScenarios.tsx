
import { Track, Scenario, Target } from "@/types";
import { ScenarioCard } from "./ScenarioCard";

interface FeaturedScenariosProps {
  scenarios: Scenario[];
  tracks: Track[];
  targets: Target[];
  onScenarioClick: (scenario: Scenario) => void;
}

export const FeaturedScenarios = ({ scenarios, tracks, targets, onScenarioClick }: FeaturedScenariosProps) => {
  const getScenarioStats = (scenarioId: string) => {
    const scenarioTargets = targets.filter(t => t.scenarioId === scenarioId);
    const totalTargets = scenarioTargets.length;
    const totalReduction = scenarioTargets.reduce(
      (sum, target) => sum + (target.baselineValue - target.targetValue), 
      0
    );
    const uniqueTracks = new Set(scenarioTargets.map(t => t.trackId)).size;
    
    const startDates = scenarioTargets.map(t => new Date(t.targetDate).getFullYear());
    const minYear = startDates.length > 0 ? Math.min(...startDates) : null;
    const maxYear = startDates.length > 0 ? Math.max(...startDates) : null;
    
    return { 
      totalTargets, 
      totalReduction, 
      uniqueTracks,
      startYear: minYear,
      endYear: maxYear
    };
  };

  const scenarioCards = scenarios.slice(0, 3).map(scenario => {
    const stats = getScenarioStats(scenario.id);
    const scenarioTargets = targets.filter(t => t.scenarioId === scenario.id);
    
    const trackGroups: {
      track: Track | undefined;
      targets: Target[];
      totalReduction: number;
    }[] = [];

    const groupedTargets = scenarioTargets.reduce((acc, target) => {
      if (!acc[target.trackId]) {
        acc[target.trackId] = {
          track: tracks.find(t => t.id === target.trackId),
          targets: [],
          totalReduction: 0
        };
      }
      acc[target.trackId].targets.push(target);
      acc[target.trackId].totalReduction += (target.baselineValue - target.targetValue);
      return acc;
    }, {} as Record<string, typeof trackGroups[0]>);

    return {
      scenario,
      stats,
      trackGroups: Object.values(groupedTargets)
    };
  });

  if (scenarioCards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {scenarioCards.map(({ scenario, stats, trackGroups }) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          stats={stats}
          trackGroups={trackGroups}
          onClick={() => onScenarioClick(scenario)}
        />
      ))}
    </div>
  );
};
