
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, GripVertical } from "lucide-react";

interface WidgetHeaderProps {
  title: string;
  id: string;
  resizeWidget: (id: string, newSize: string) => void;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({ title, id, resizeWidget }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <div className="flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded-sm hover:bg-gray-100">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => resizeWidget(id, "3x3")}>Small (3×3)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeWidget(id, "6x3")}>Wide (6×3)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeWidget(id, "3x6")}>Tall (3×6)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeWidget(id, "6x6")}>Medium (6×6)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeWidget(id, "9x3")}>Extra Wide (9×3)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeWidget(id, "3x9")}>Extra Tall (3×9)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeWidget(id, "9x6")}>Large Wide (9×6)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => resizeWidget(id, "6x9")}>Large Tall (6×9)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="cursor-grab p-1 rounded-sm hover:bg-gray-100 drag-handle">
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </CardHeader>
  );
};

export default WidgetHeader;
