import { CapacityReport } from "@ttm/api/types/models/reporting";
import ProjectPieChart from "./ProjectPieChart";
import { TotalInformation } from "./TotalInformation";
import TaskList from "./TaskList";

interface MyTaskDisplayProps {
  capacityReportData: CapacityReport;
  viewMode: "daily" | "weekly";
}

export function MyTaskDisplay({
  capacityReportData,
  viewMode,
}: MyTaskDisplayProps) {
  return (
    <>
      <TotalInformation
        capacityReportData={capacityReportData}
        viewMode={viewMode}
      />
      <ProjectPieChart
        capacityReportData={capacityReportData}
        viewMode={viewMode}
      />
      <TaskList
        key={`${capacityReportData.iteration}-${viewMode}`}
        capacityReportData={capacityReportData}
        viewMode={viewMode}
      />
    </>
  );
}
