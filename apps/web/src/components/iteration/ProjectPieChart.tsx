import { ResponsivePie } from "@nivo/pie";
import { getPieChartProjects } from "@ttm/api";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Text } from "../ui/Text";

interface ProjectPieChartProps {
  iterationId: string;
}

export function ProjectPieChart({ iterationId }: ProjectPieChartProps) {
  const { data, isLoading, isError, refetch } = getPieChartProjects(
    ["pie-chart-projects", iterationId],
    { iteration: iterationId },
    { enabled: !!iterationId },
  );

  const chartData = data?.result;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center">
          <Loading
            showText
            text="Loading pie chart..."
            size="lg"
            className="items-center justify-center"
          />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Error Loading Project Pie Chart"
        message="We encountered an error while loading the pie chart."
        onRetry={() => refetch()}
        retryText="Reload Chart"
      />
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center text-gray-500">
          <Text>No project data available</Text>
        </CardContent>
      </Card>
    );
  }

  const transformedData = chartData.map((item: any) => ({
    id: item.id,
    label: item.name || item.id,
    value: item.value,
  }));

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Project Pie Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsivePie
            data={transformedData}
            margin={{ top: 10, right: 120, bottom: 80, left: 10 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            // enableArcLabels={false}
            enableArcLinkLabels={false}
            colors={{ scheme: "nivo" }}
            legends={[
              {
                anchor: "bottom",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 60,
                itemsSpacing: 4,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 12,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
            theme={{
              labels: {
                text: {
                  fontSize: 14,
                  fontWeight: 600,
                },
              },
              legends: {
                text: {
                  fontSize: 12,
                },
              },
              tooltip: {
                container: {
                  background: "#ffffff",
                  fontSize: 12,
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
