import {
  CheckCircle2,
  Info,
  Loader,
  XOctagon,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <XOctagon className="h-4 w-4" />,
        loading: <Loader className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "bg-green-600 text-white border-green-700 group-[.toast]:text-white",
          error:
            "bg-red-600 text-white border-red-700 group-[.toast]:text-white",
          warning:
            "bg-amber-500 text-black border-amber-600 group-[.toast]:text-black",
          info: "bg-blue-600 text-white border-blue-700 group-[.toast]:text-white",
          loading:
            "bg-gray-700 text-white border-gray-800 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
