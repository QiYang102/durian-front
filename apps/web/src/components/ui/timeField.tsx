import { useRef } from "react";

import { Time } from "@internationalized/date";
import { Clock } from "lucide-react";
import {
  AriaTimeFieldProps,
  TimeValue,
  useLocale,
  useTimeField,
} from "react-aria";
import { TimeFieldStateOptions, useTimeFieldState } from "react-stately";

import { cn } from "@/lib/utils";

import DateSegment from "./DateSegment";
import { Label } from "./Label";

export interface TimeFieldProps extends AriaTimeFieldProps<TimeValue> {
  hasError?: boolean;
  hour: number;
  minute: number;
}

function TimeField(props: TimeFieldProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
    defaultValue: new Time(props.hour, props.minute),
  });
  const {
    fieldProps: { ...fieldProps },
    labelProps,
  } = useTimeField(props, state, ref);

  return (
    <div {...fieldProps} ref={ref}>
      <Label
        className={`py-1 text-xs font-semibold ${props.hasError ? "text-red-500" : "text-gray-600"}`}
      >
        {props.label}
        {props.isRequired ? "*" : ""}
      </Label>
      <div
        className={`flex flex-row ${props.hasError ? "text-red-500" : "text-gray-600"}`}
      >
        <div
          className={cn(
            `relative inline-flex w-full flex-1 rounded-sm border border-gray-300 bg-transparent px-5 py-3 ${props.hasError ? "border-red-500" : "border-gray-300"}`,
            props.isDisabled ? "cursor-not-allowed opacity-50" : "",
          )}
        >
          <Clock className="mr-2 text-gray-500" />
          {state.segments.map((segment, i) => (
            <DateSegment key={i} segment={segment} state={state} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { TimeField };
