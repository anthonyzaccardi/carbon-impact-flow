
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isViewMode: boolean;
  onClose: () => void;
}

export const FormActions = ({ isViewMode, onClose }: FormActionsProps) => {
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
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={onClose} type="button">
        Cancel
      </Button>
      <Button type="submit" className="px-6">Save</Button>
    </div>
  );
};
