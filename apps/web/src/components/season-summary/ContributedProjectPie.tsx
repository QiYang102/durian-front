import { ResponsivePie } from "@nivo/pie";
import { Season } from "@ttm/api/types/models/season-summary";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export default function ContributedProjectPie({
  season,
}: {
  season: Season | undefined;
}) {
  const chartData = season?.report_data.top_projects ?? [];

  const transformedData = chartData.map((item: any) => {
    const cleanName = item.project_name.split(" - ")[0];
    return {
      id: cleanName,
      label: cleanName,
      value: item.total_hours,
    };
  });

  // Sum total hours
  const totalHours = transformedData.reduce(
    (sum: number, item: any) => sum + item.value,
    0,
  );

  // Centered metric layer
  const CenteredMetric = ({
    centerX,
    centerY,
  }: {
    centerX: number;
    centerY: number;
  }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "20px", fontWeight: "bold" }}
    >
      {totalHours && totalHours > 0
        ? `${totalHours.toFixed(2)} Hours`
        : "No Hours Yet"}
    </text>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributed Project</CardTitle>
      </CardHeader>
      <CardContent className="h-96 shadow-sm">
        <ResponsivePie
          data={transformedData}
          margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
          innerRadius={0.7}
          padAngle={2}
          cornerRadius={8}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "paired" }}
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          layers={[
            "arcs",
            "arcLabels",
            "legends",
            "arcLinkLabels",
            CenteredMetric,
          ]}
        />
      </CardContent>
    </Card>
  );
}
