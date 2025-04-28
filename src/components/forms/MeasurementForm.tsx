
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAppContext } from "@/contexts/useAppContext";
import { Measurement, MeasurementStatus } from "@/types";
import { useEffect, useState } from "react";
import { measurementFormSchema, type MeasurementFormData } from "./measurements/schema";
import MeasurementFormFields from "./measurements/MeasurementFormFields";

interface MeasurementFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Measurement;
  onClose: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({
  mode,
  initialData,
  onClose,
}) => {
  const isViewMode = mode === "view";
  const { createMeasurement, updateMeasurement, tracks, factors, suppliers } = useAppContext();
  
  const [availableFactors, setAvailableFactors] = useState(factors);
  const [selectedTrackUnit, setSelectedTrackUnit] = useState("");
  const [calculatedValue, setCalculatedValue] = useState(0);

  const formattedData = initialData
    ? {
        ...initialData,
        date: new Date(initialData.date),
      }
    : undefined;

  const form = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: formattedData || {
      trackId: "",
      factorId: "",
      date: new Date(),
      quantity: 0,
      unit: "",
      status: "active" as MeasurementStatus,
    },
  });

  const watchTrackId = form.watch("trackId");
  const watchQuantity = form.watch("quantity");
  const watchFactorId = form.watch("factorId");

  useEffect(() => {
    if (watchTrackId) {
      const filteredFactors = factors.filter(
        (factor) => factor.trackId === watchTrackId
      );
      setAvailableFactors(filteredFactors);
      setSelectedTrackUnit("tCO₂e");
      form.setValue("unit", "tCO₂e");

      const currentFactor = form.getValues("factorId");
      if (currentFactor && !filteredFactors.some(f => f.id === currentFactor)) {
        form.setValue("factorId", "");
      }
    }
  }, [watchTrackId, factors, form]);

  useEffect(() => {
    if (watchFactorId && watchQuantity) {
      const factor = factors.find((f) => f.id === watchFactorId);
      if (factor) {
        const calculatedValue = watchQuantity * factor.value;
        setCalculatedValue(calculatedValue);
      }
    }
  }, [watchFactorId, watchQuantity, factors]);

  function onSubmit(data: MeasurementFormData) {
    const formattedData = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
      trackId: data.trackId,
      factorId: data.factorId,
      quantity: data.quantity,
      unit: data.unit,
      status: data.status as MeasurementStatus,
      notes: data.notes,
      supplierId: data.supplierId
    };

    if (mode === "create") {
      createMeasurement(formattedData);
    } else if (mode === "edit" && initialData) {
      updateMeasurement(initialData.id, formattedData);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <MeasurementFormFields
          form={form}
          isViewMode={isViewMode}
          tracks={tracks}
          factors={factors}
          suppliers={suppliers}
          availableFactors={availableFactors}
          selectedTrackUnit={selectedTrackUnit}
          calculatedValue={calculatedValue}
        />

        {!isViewMode && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!watchTrackId || !watchFactorId || watchQuantity <= 0}
            >
              Save
            </Button>
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

export default MeasurementForm;
