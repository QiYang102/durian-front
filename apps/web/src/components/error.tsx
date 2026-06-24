import { FunctionComponent } from "react";

interface ErrorComponentProps {
  errorMessage?: string;
}

const ErrorComponent: FunctionComponent<ErrorComponentProps> = ({
  errorMessage = "Something went wrong",
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1>{errorMessage}</h1>
    </div>
  );
};

export default ErrorComponent;
