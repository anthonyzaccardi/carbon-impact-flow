
import React from "react";
import { Scenario, Track, Target } from "@/types";
import { ScenarioCard } from "./ScenarioCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedScenariosProps {
  scenarios: Scenario[];
  onScenarioClick: (scenario: Scenario) => void;
  targets?: Target[];
  tracks?: Track[];
}

export const FeaturedScenarios = ({
  scenarios,
  onScenarioClick,
  targets = [],
  tracks = [],
}: FeaturedScenariosProps) => {
  if (!scenarios.length) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <h3 className="text-lg font-medium mb-2">No scenarios found</h3>
        <p className="text-muted-foreground">
          Create your first scenario to get started.
        </p>
      </div>
    );
  }

  // Process scenario data
  const scenarioData = scenarios.map(scenario => {
    const scenarioTargets = targets.filter(t => t.scenarioId === scenario.id);
    
    // Group targets by track
    const trackGroups = tracks
      .filter(track => scenarioTargets.some(target => target.trackId === track.id))
      .map(track => {
        const trackTargets = scenarioTargets.filter(t => t.trackId === track.id);
        const totalReduction = trackTargets.reduce(
          (sum, target) => sum + (target.baselineValue - target.targetValue), 
          0
        );
        
        return {
          track,
          targets: trackTargets,
          totalReduction
        };
      })
      .sort((a, b) => b.totalReduction - a.totalReduction);
    
    // Calculate statistics
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
      scenario,
      trackGroups,
      stats: {
        totalTargets,
        totalReduction,
        uniqueTracks,
        startYear: minYear,
        endYear: maxYear
      }
    };
  });

  return (
    <div className="my-8">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {scenarioData.map(({ scenario, trackGroups, stats }) => (
            <CarouselItem 
              key={scenario.id} 
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <ScenarioCard
                  scenario={scenario}
                  trackGroups={trackGroups}
                  stats={stats}
                  onClick={() => onScenarioClick(scenario)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};
