
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WidgetHeader from '../WidgetHeader';
import MiniBarChart from "@/components/charts/MiniBarChart";
import { Initiative } from '@/types';

interface InitiativesWidgetProps {
  initiatives: Initiative[];
  resizeWidget: (id: string, newSize: string) => void;
}

const InitiativesWidget: React.FC<InitiativesWidgetProps> = ({ initiatives, resizeWidget }) => {
  return (
    <Card className="h-full border shadow-sm">
      <WidgetHeader title="Ongoing Initiatives" id="initiatives" resizeWidget={resizeWidget} />
      <CardContent className="p-4">
        <div className="flex flex-col h-full justify-between">
          <div className="text-2xl font-semibold">{initiatives.length}</div>
          <div className="text-sm text-muted-foreground">Active reduction programs</div>
          <div className="mt-2">
            <MiniBarChart 
              data={initiatives.slice(0, 5).map((i, idx) => ({ 
                name: `Initiative ${idx + 1}`, 
                value: Math.random() * 100 
              }))}
              color="#F97316" 
              height={60} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InitiativesWidget;
