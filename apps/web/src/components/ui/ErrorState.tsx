import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  isRetrying = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 space-y-4",
        className,
      )}
    >
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load data
        </h3>
        <p className="text-gray-600 mb-4">
          We couldn't found the data. Please try again.
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            className="inline-flex items-center gap-2"
            disabled={isRetrying}
          >
            <RefreshCw
              className={cn("h-4 w-4", isRetrying && "animate-spin")}
            />
            {isRetrying ? "Retrying..." : "Try Again"}
          </Button>
        )}
      </div>
    </div>
    
  );
};
