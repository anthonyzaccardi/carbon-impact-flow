
import React from "react";
import { useAppContext } from "@/contexts/useAppContext";
import { TrendingUp } from "lucide-react";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { GridContainer } from "@/components/dashboard/GridLayout";
import TrackWidget from "@/components/dashboard/widgets/TrackWidget";
import MeasurementsWidget from "@/components/dashboard/widgets/MeasurementsWidget";
import TargetsWidget from "@/components/dashboard/widgets/TargetsWidget";
import InitiativesWidget from "@/components/dashboard/widgets/InitiativesWidget";
import EmissionsWidget from "@/components/dashboard/widgets/EmissionsWidget";
import SourcesWidget from "@/components/dashboard/widgets/SourcesWidget";
import GoalsWidget from "@/components/dashboard/widgets/GoalsWidget";

const Overview = () => {
  const {
    tracks,
    measurements,
    targets,
    initiatives,
  } = useAppContext();
  
  // Calculate total emissions
  const totalEmissions = tracks.reduce((sum, track) => {
    const trackMeasurements = measurements.filter(m => m.trackId === track.id);
    const trackEmissions = trackMeasurements.reduce((trackSum, measurement) => trackSum + measurement.calculatedValue, 0);
    return sum + trackEmissions;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <BreadcrumbNav items={[{ label: "Overview", icon: <TrendingUp className="h-4 w-4" /> }]} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground max-w-3xl">
          Track your environmental impact metrics and progress toward reduction goals across all emission sources.
        </p>
      </div>
      
      {/* Grid Layout Container */}
      <GridContainer pageName="overview">
        {/* Tracks Widget */}
        <div key="tracks" className="z-10">
          <TrackWidget 
            tracks={tracks} 
            resizeWidget={() => {}} 
          />
        </div>
        
        {/* Measurements Widget */}
        <div key="measurements" className="z-10">
          <MeasurementsWidget 
            measurements={measurements} 
            resizeWidget={() => {}} 
          />
        </div>
        
        {/* Targets Widget */}
        <div key="targets" className="z-10">
          <TargetsWidget 
            targets={targets} 
            resizeWidget={() => {}} 
          />
        </div>
        
        {/* Initiatives Widget */}
        <div key="initiatives" className="z-10">
          <InitiativesWidget 
            initiatives={initiatives} 
            resizeWidget={() => {}} 
          />
        </div>
        
        {/* Emissions Widget */}
        <div key="emissions" className="z-10">
          <EmissionsWidget 
            tracks={tracks}
            measurements={measurements}
            resizeWidget={() => {}} 
          />
        </div>
        
        {/* Emission Sources Widget */}
        <div key="sources" className="z-10">
          <SourcesWidget 
            tracks={tracks} 
            totalEmissions={totalEmissions}
            resizeWidget={() => {}} 
          />
        </div>
        
        {/* Reduction Goals Widget */}
        <div key="goals" className="z-10">
          <GoalsWidget 
            targets={targets} 
            resizeWidget={() => {}} 
          />
        </div>
      </GridContainer>
    </div>
  );
};

export default Overview;
