import { useEffect, useRef, useState } from "react";

import { CapacityReport } from "@ttm/api/types/models/reporting";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

interface TotalInformationProps {
  capacityReportData: CapacityReport;
  viewMode: "daily" | "weekly";
}

export function TotalInformation({
  capacityReportData,
  viewMode,
}: TotalInformationProps) {
  // Setup animated state for: [total_capacity, total_estimate, total_committed]
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0]);

  // Use a ref to track the "previous" start values for the next animation cycle
  const prevValuesRef = useRef([0, 0, 0]);

  const targetValues = [
    capacityReportData?.total_capacity ?? 0,
    capacityReportData?.total_estimate ?? 0,
    capacityReportData?.total_committed ?? 0,
  ];

  useEffect(() => {
    const duration = 500;
    const startTime = performance.now();
    const startValues = [...prevValuesRef.current];

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentStepValues = startValues.map((start, i) => {
        const target = targetValues[i];
        return start + (target - start) * easeProgress;
      });

      setAnimatedValues(currentStepValues);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        prevValuesRef.current = targetValues;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [capacityReportData, viewMode]); // Triggers animation on data change

  const animatedCapacity = animatedValues[0];
  const widthPercent = Math.min(
    (animatedCapacity / (capacityReportData?.capacity ?? 1)) * 100,
    100,
  );

  const getStatusTextColor = (percent: number) => {
    if (percent >= 100) return "text-green-500"; // Perfect
    if (percent >= 50) return "text-yellow-500"; // Warning
    return "text-red-600"; // Low
  };

  const getStatusBgColor = (percent: number) => {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="">
            {viewMode === "daily" ? "Today's Capacity" : "Weekly Capacity"}{" "}
            <span className="text-sm font-bold text-gray-200">
              (completed tasks)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col gap-3">
          <div className="flex flex-row justify-start items-end">
            <p
              className={`text-3xl font-bold ${getStatusTextColor(widthPercent)}`}
            >
              {animatedValues[0].toFixed(2)}{" "}
              <span className="text-lg font-bold text-gray-200">
                / {capacityReportData?.capacity?.toFixed(2)}h
              </span>
            </p>
          </div>
          <div className="">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`${getStatusBgColor(widthPercent)} h-full transition-all duration-700 ease-out`}
                style={{ width: widthPercent + "%" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="">Total Estimate Hours</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col gap-3 justify-evenly">
          <div className="flex flex-row justify-start items-end">
            <p className="text-3xl font-bold">
              {animatedValues[1].toFixed(2)}{" "}
              <span className="text-lg font-bold text-gray-200">h</span>
            </p>
          </div>
          <div>
            <p className="p-0 text-xs font-semibold text-gray-200">
              Estimated across active stories
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="">Total Committed Hours</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col gap-3 justify-evenly">
          <div className="flex flex-row justify-start items-end">
            <p className="text-3xl font-bold">
              {animatedValues[2].toFixed(2)}{" "}
              <span className="text-lg font-bold text-gray-200">h</span>
            </p>
          </div>
          <div>
            <p className="p-0 text-xs font-semibold text-gray-200">
              Estimated across active stories
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
