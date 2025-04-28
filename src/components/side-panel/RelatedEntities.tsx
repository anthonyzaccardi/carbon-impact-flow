
import React from 'react';
import { Measurement, Initiative } from '@/types';
import { useAppContext } from '@/contexts/useAppContext';

interface RelatedEntitiesProps {
  entityType: string;
  data: any;
  onEntityClick: (type: string, data: any) => void;
}

export const RelatedEntities = ({ entityType, data, onEntityClick }: RelatedEntitiesProps) => {
  const { measurements, initiatives } = useAppContext();

  if (!data) return null;

  switch (entityType) {
    case 'factor': {
      const factorMeasurements = measurements.filter(m => m.factorId === data.id);
      if (factorMeasurements.length === 0) return null;
      
      return (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Related Measurements</h3>
          <div className="space-y-2">
            {factorMeasurements.map((measurement: Measurement) => (
              <div 
                key={measurement.id} 
                className="p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted"
                onClick={() => onEntityClick('measurement', measurement)}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{new Date(measurement.date).toLocaleDateString()}</div>
                  <div>{measurement.quantity} {measurement.unit}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Calculated: {measurement.calculatedValue} tCO₂e
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    case 'target': {
      const targetInitiatives = initiatives.filter(i => i.targetIds.includes(data.id));
      if (targetInitiatives.length === 0) return null;
      
      return (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Related Initiatives</h3>
          <div className="space-y-2">
            {targetInitiatives.map((initiative: Initiative) => (
              <div 
                key={initiative.id} 
                className="p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted"
                onClick={() => onEntityClick('initiative', initiative)}
              >
                <div className="font-medium">{initiative.name}</div>
                <div className="text-sm text-muted-foreground">
                  Plan: {initiative.plan} • Status: {initiative.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    default:
      return null;
  }
};
