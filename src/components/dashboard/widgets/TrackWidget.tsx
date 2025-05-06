
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WidgetHeader from '../WidgetHeader';
import MiniBarChart from "@/components/charts/MiniBarChart";
import { Track } from '@/types';

interface TrackWidgetProps {
  tracks: Track[];
  resizeWidget: (id: string, newSize: string) => void;
}

const TrackWidget: React.FC<TrackWidgetProps> = ({ tracks, resizeWidget }) => {
  const trackDistributionData = tracks.slice(0, 4).map(track => ({
    name: track.name,
    value: track.totalEmissions
  }));

  return (
    <Card className="h-full border shadow-sm">
      <WidgetHeader title="Total Tracks" id="tracks" resizeWidget={resizeWidget} />
      <CardContent className="p-4">
        <div className="flex flex-col h-full justify-between">
          <div className="text-2xl font-semibold">{tracks.length}</div>
          <div className="text-sm text-muted-foreground">Active emission tracking categories</div>
          <div className="mt-2">
            <MiniBarChart data={trackDistributionData} color="#10B981" height={60} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackWidget;
