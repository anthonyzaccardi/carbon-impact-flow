
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/useAppContext";
import { Track, Factor, Measurement, Target } from "@/types";
import { trackFormSchema, TrackFormData } from "./tracks/schema";
import TrackStats from "./tracks/TrackStats";
import TrackFormFields from "./tracks/TrackFormFields";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrackFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Track;
  onClose: () => void;
}

const TrackForm: React.FC<TrackFormProps> = ({ mode, initialData, onClose }) => {
  const isViewMode = mode === "view";
  const { createTrack, updateTrack, factors, measurements, targets } = useAppContext();

  const form = useForm<TrackFormData>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      emoji: initialData.emoji,
    } : {
      name: "",
      emoji: "",
    },
  });

  function onSubmit(data: TrackFormData) {
    if (mode === "create") {
      createTrack({
        name: data.name,
        emoji: data.emoji,
      });
    } else if (mode === "edit" && initialData) {
      updateTrack(initialData.id, data);
    }
    onClose();
  }

  // Get related entities for this track
  const trackFactors = initialData ? factors.filter(f => f.trackId === initialData.id) : [];
  const trackMeasurements = initialData ? measurements.filter(m => m.trackId === initialData.id) : [];
  const trackTargets = initialData ? targets.filter(t => t.trackId === initialData.id) : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TrackFormFields form={form} isViewMode={isViewMode} />

        {isViewMode && initialData && (
          <TrackStats track={initialData} />
        )}

        {isViewMode && initialData && (
          <div className="space-y-6 mt-6">
            {/* Related Factors List */}
            <div className="border rounded-lg">
              <div className="px-4 py-3 border-b bg-muted/30">
                <h3 className="font-medium">Emission Factors</h3>
              </div>
              <ScrollArea className="h-[200px]">
                {trackFactors.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No emission factors found</div>
                ) : (
                  <div className="p-1">
                    {trackFactors.map((factor: Factor) => (
                      <div key={factor.id} className="p-3 border-b last:border-0">
                        <div className="font-medium">{factor.name}</div>
                        <div className="text-sm text-muted-foreground flex justify-between">
                          <span>{factor.category}</span>
                          <span>{factor.value} {factor.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Related Measurements List */}
            <div className="border rounded-lg">
              <div className="px-4 py-3 border-b bg-muted/30">
                <h3 className="font-medium">Measurements</h3>
              </div>
              <ScrollArea className="h-[200px]">
                {trackMeasurements.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No measurements found</div>
                ) : (
                  <div className="p-1">
                    {trackMeasurements.map((measurement: Measurement) => (
                      <div key={measurement.id} className="p-3 border-b last:border-0">
                        <div className="font-medium">
                          {new Date(measurement.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground flex justify-between">
                          <span>
                            {factors.find(f => f.id === measurement.factorId)?.name || 'Unknown factor'}
                          </span>
                          <span>{measurement.quantity} {measurement.unit}</span>
                        </div>
                        <div className="text-xs text-right text-muted-foreground">
                          {measurement.calculatedValue} tCO₂e
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Related Targets List */}
            <div className="border rounded-lg">
              <div className="px-4 py-3 border-b bg-muted/30">
                <h3 className="font-medium">Targets</h3>
              </div>
              <ScrollArea className="h-[200px]">
                {trackTargets.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No targets found</div>
                ) : (
                  <div className="p-1">
                    {trackTargets.map((target: Target) => (
                      <div key={target.id} className="p-3 border-b last:border-0">
                        <div className="font-medium">{target.name}</div>
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Baseline</span> 
                            <span>{target.baselineValue.toLocaleString()} tCO₂e</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Target</span> 
                            <span>{target.targetValue.toLocaleString()} tCO₂e</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reduction</span> 
                            <span>{target.targetPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}

        {!isViewMode && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        )}
        
        {isViewMode && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose} type="button">
              Close
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TrackForm;
