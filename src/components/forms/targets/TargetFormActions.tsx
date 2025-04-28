
import { Button } from "@/components/ui/button";

interface TargetFormActionsProps {
  isViewMode: boolean;
  onClose: () => void;
}

export const TargetFormActions = ({ isViewMode, onClose }: TargetFormActionsProps) => {
  if (isViewMode) {
    return (
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose} type="button">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose} type="button">
        Cancel
      </Button>
      <Button type="submit">Save</Button>
    </div>
  );
};
