import { FunctionComponent } from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Icon } from "./Icon";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  showRetry?: boolean;
  className?: string;
}

const ErrorDisplay: FunctionComponent<ErrorDisplayProps> = ({
  title = "Something went wrong",
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
  retryText = "Try Again",
  showRetry = true,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4">
          <Icon
            name="alert-circle"
            size="lg"
            color="danger"
            className="h-12 w-12"
          />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-6 max-w-md text-sm text-gray-600">{message}</p>
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon name="refresh-cw" size="sm" />
            {retryText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
