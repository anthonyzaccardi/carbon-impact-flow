
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/useAppContext";
import { Track } from "@/types";
import { trackFormSchema, TrackFormData } from "./tracks/schema";
import TrackStats from "./tracks/TrackStats";
import TrackFormFields from "./tracks/TrackFormFields";

interface TrackFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Track;
  onClose: () => void;
}

const TrackForm: React.FC<TrackFormProps> = ({ mode, initialData, onClose }) => {
  const isViewMode = mode === "view";
  const { createTrack, updateTrack } = useAppContext();

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TrackFormFields form={form} isViewMode={isViewMode} />

        {isViewMode && initialData && (
          <TrackStats track={initialData} />
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
