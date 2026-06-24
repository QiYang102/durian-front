import { X } from "lucide-react";
import { Badge } from "../ui/Badge";

interface RemovableBadgeProps {
  label: string;
  onRemove: () => void;
  color: string;
}

export const RemovableTag = ({
  label,
  onRemove,
  color,
}: RemovableBadgeProps) => {
  return (
    <Badge className="max-w-fit" color={color}>
      {label}
      <button
        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-ring focus:ring-2 focus:ring-offset-2"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={onRemove}
      >
        <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
      </button>
    </Badge>
  );
};
