import { LucideIcon } from "lucide-react";
import { Text } from "./ui/Text";
import { Button } from "./ui/Button";

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  className?: string;
  iconSize?: string;
  textClassName?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: "ghost" | "outline";
  colorScheme?: "blue" | "purple" | "red" | "green" | "gray";
}

const colorSchemes = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  red: "text-red-600",
  green: "text-green-700",
  gray: "text-gray-600",
};

export default function ActionButton({
  icon: Icon,
  onClick,
  title,
  className = "",
  iconSize = "",
  textClassName = "",
  disabled = false,
  children,
  variant,
  colorScheme,
}: ActionButtonProps) {
  const buttonVariant = variant ?? (children ? "outline" : "ghost");

  const sizeClass = children ? "h-7 px-2" : "h-7 w-7 p-0";

  const colorClass = colorScheme ? colorSchemes[colorScheme] : "";

  return (
    <Button
      variant={buttonVariant}
      size="sm"
      onClick={onClick}
      className={`${sizeClass} ${colorClass} ${className}`.trim()}
      title={title}
      disabled={disabled}
    >
      <Icon
        className={`${iconSize || "w-3.5 h-3.5"} ${children ? "mr-1" : ""}`}
      />
      {children && (
        <Text variant="macro" className={`font-medium ${textClassName}`}>
          {children}
        </Text>
      )}
    </Button>
  );
}
