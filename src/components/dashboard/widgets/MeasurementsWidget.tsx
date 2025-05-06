
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WidgetHeader from '../WidgetHeader';
import MiniSparkline from "@/components/charts/MiniSparkline";
import { Measurement } from '@/types';

interface MeasurementsWidgetProps {
  measurements: Measurement[];
  resizeWidget: (id: string, newSize: string) => void;
}

const MeasurementsWidget: React.FC<MeasurementsWidgetProps> = ({ measurements, resizeWidget }) => {
  const measurementTrendsData = [
    { name: 'Week 1', value: 25 },
    { name: 'Week 2', value: 40 },
    { name: 'Week 3', value: 30 },
    { name: 'Week 4', value: 45 },
  ];

  return (
    <Card className="h-full border shadow-sm">
      <WidgetHeader title="Active Measurements" id="measurements" resizeWidget={resizeWidget} />
      <CardContent className="p-4">
        <div className="flex flex-col h-full justify-between">
          <div className="text-2xl font-semibold">{measurements.length}</div>
          <div className="text-sm text-muted-foreground">Total recorded measurements</div>
          <div className="mt-2">
            <MiniSparkline data={measurementTrendsData} color="#1EAEDB" height={60} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeasurementsWidget;
