
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WidgetHeader from '../WidgetHeader';
import ProgressIndicator from "@/components/charts/ProgressIndicator";
import { Track } from '@/types';

interface SourcesWidgetProps {
  tracks: Track[];
  totalEmissions: number;
  resizeWidget: (id: string, newSize: string) => void;
}

const SourcesWidget: React.FC<SourcesWidgetProps> = ({ tracks, totalEmissions, resizeWidget }) => {
  return (
    <Card className="h-full border shadow-sm">
      <WidgetHeader title="Emission Sources" id="sources" resizeWidget={resizeWidget} />
      <CardContent className="p-4 overflow-auto">
        <div className="space-y-4">
          {tracks.slice(0, 5).map((track, idx) => (
            <div key={track.id} className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-md">
                {track.emoji}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">{track.name}</span>
                  <span>{track.totalEmissions.toLocaleString()} tCO₂e</span>
                </div>
                <ProgressIndicator 
                  current={track.totalEmissions}
                  target={totalEmissions}
                  color={['#10B981', '#1EAEDB', '#F97316', '#8B5CF6', '#FBBF24'][idx % 5]}
                  size="sm"
                  variant="slim"
                  showLabels={false}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcesWidget;
