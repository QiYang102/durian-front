import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { icons, PlusCircleIcon, View } from "lucide-react";

import WhatsappSvg from "@/assets/custom-icons/WhatsappSvg";
import { cn } from "@/lib/utils";

export interface IconProps
  extends Omit<ComponentProps<typeof View>, "color" | "size">,
    VariantProps<typeof iconVariants> {
  name: string;
  fill?: any;
}

const formatIconName = (iconName: string): string => {
  return iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      default: "h-6 w-6",
      md: "h-6 w-6",
      lg: "h-7 w-7",
      xl: "h-8 w-8",
      "2xl": "h-9 w-9",
      "3xl": "h-10 w-10",
      "4xl": "h-11 w-11",
      "5xl": "h-12 w-12",
      "6xl": "h-16 w-16",
      "7xl": "h-20 w-20",
    },
    color: {
      default: "text-default",
      primary: "text-primary",
      secondary: "text-secondary-300",
      accent: "text-accent",
      hero: "text-hero",
      link: "text-link",
      success: "text-success",
      danger: "text-red-500",
      warning: "text-warning-500",
      info: "text-info",
      muted: "text-muted",
      black: "text-black",
      white: "text-white",
      closed: "text-black",
      gray: "text-gray-500",
      "gray-light": "text-gray-200",
      blue: "text-blue-900",
      fuchsia: "text-fuchsia-500",
      cyan: "text-cyan-500",
    },
    fill: {
      success: "#007B0C",
      danger: "#EB1C22",
      disabled: "#959595",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

//reference: https://lucide.dev/icons/

export const Icon: React.FC<IconProps> = ({
  name,
  fill = "transparent",
  size,
  color = "black",
  className,
  ...props
}) => {
  const formattedName = formatIconName(name);
  const LucideIcon = icons[formattedName]
    ? icons[formattedName]
    : icons["HelpCircle"];

  let fillColor = "transparent";

  if (fill === "success") {
    fillColor = "#007B0C";
  }

  if (fill === "danger") {
    fillColor = "#EB1C22";
  }

  if (fill === "disabled") {
    fillColor = "#e5e7eb";
  }

  if (name === "whatsapp") {
    return <WhatsappSvg size={24} fill={color} {...props} className={"mr-2"} />;
  }

  // PlusCircleIcon
  return (
    <LucideIcon
      fill={fillColor}
      // strokeWidth={1}
      className={cn(
        iconVariants({
          size,
          color,
          className,
        }),
      )}
      {...props}
    />
  );
};

Icon.displayName = "Icon";
