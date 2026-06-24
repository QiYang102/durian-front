import { useMemo } from "react";

import { ResponsivePie } from "@nivo/pie";

import { Card, CardContent } from "../ui/Card";
import {
  CapacityReport,
  ProjectEstimate,
} from "@ttm/api/types/models/reporting";

interface ProjectPieProps {
  capacityReportData: CapacityReport;
  viewMode: "daily" | "weekly";
}

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#0ea5e9", // Sky
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#3b82f6", // Blue
  "#d946ef", // Fuchsia
  "#06b6d4", // Cyan
  "#eab308", // Yellow
  "#64748b", // Slate
];

function ProjectPieChart({ capacityReportData, viewMode }: ProjectPieProps) {
  const chartData = useMemo(() => {
    const projectEstimates = capacityReportData?.project_estimates || [];

    if (projectEstimates.length === 0) return [];

    return projectEstimates.map((item: ProjectEstimate, index: number) => {
      const cleanName = item.project_name
        ? item.project_name.split(" - ")[0]
        : "Unknown Project";
      return {
        id: cleanName,
        label: cleanName,
        value: item.total_estimate_per_project || 0,
        color: COLORS[index % COLORS.length],
      };
    });
  }, [capacityReportData]);

  return (
    <Card>
      <CardContent className="flex flex-col lg:flex-row items-center gap-12 shadow-md">
        <div className="w-full lg:w-1/3 h-[300px] relative">
          {chartData.length > 0 ? (
            <ResponsivePie
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.6}
              padAngle={1}
              cornerRadius={6}
              activeOuterRadiusOffset={8}
              colors={(datum) => datum.data.color}
              enableArcLinkLabels={false}
              enableArcLabels={false}
              layers={["arcs"]}
              tooltip={({ datum }) => (
                <div
                  style={{
                    padding: "8px 12px",
                    minWidth: "max-content",
                    display: "inline-block",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                    color: "#333",
                  }}
                >
                  <strong>{datum.id}</strong>: {datum.value.toFixed(2)} h
                </div>
              )}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium italic text-center px-4">
              No project estimates available for this period
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/3 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Contributed Projects
            </h3>
            <p className="text-gray-500 text-sm">
              Reviewing total estimated hours per project for the{" "}
              <span className="font-semibold text-slate-700">{viewMode}</span>{" "}
              sprint data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            {chartData.length > 0 ? (
              chartData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-slate-50 pb-2 transition-colors hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {item.value.toFixed(2)}h
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-full py-2 text-sm text-slate-400 italic">
                No estimates to display.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectPieChart;
