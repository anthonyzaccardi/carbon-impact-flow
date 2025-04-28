
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

interface EntityActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const EntityActions = ({ onEdit, onDelete }: EntityActionsProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center" 
        onClick={onEdit}
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        className="flex items-center" 
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};
