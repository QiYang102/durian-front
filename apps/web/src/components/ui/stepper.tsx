import React, { useEffect } from "react";

import { CheckIcon } from "lucide-react";

export interface Step {
  id: string;
  name: string;
  href: string;
  status: "complete" | "current" | "upcoming";
  stepIdx: number;
}

interface StepperProps {
  steps: Step[];
  onStepClick: (index: number) => void; // Add this line
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Stepper: React.FC<StepperProps> = ({ steps, onStepClick }) => {
  const [currentStep, setCurrentStep] = React.useState<Step[]>(steps);

  useEffect(() => {
    setCurrentStep(steps);
  }, [steps]);
  return (
    <nav aria-label="Progress" className="flex flex-1 flex-col">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="md:flex-1">
            {step.status === "complete" ? (
              <a
                onClick={() => onStepClick(stepIdx)}
                className="border-secondary group flex flex-col border-l-4 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-secondary text-sm font-medium group-hover:text-indigo-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : step.status === "current" ? (
              <a
                onClick={() => onStepClick(stepIdx)}
                className="border-secondary flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-secondary text-sm font-medium">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                onClick={() => onStepClick(stepIdx)}
                className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
