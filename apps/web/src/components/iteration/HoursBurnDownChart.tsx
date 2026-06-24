import { ResponsiveLine } from "@nivo/line";
import { getHoursBurndownChart } from "@ttm/api";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Text } from "../ui/Text";

interface BurndownChartProps {
  iterationId: string;
}

export function HoursBurnDownChart({ iterationId }: BurndownChartProps) {
  const { data, isLoading, isError, refetch } = getHoursBurndownChart(
    ["burndown-chart", iterationId],
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
            text="Loading burndown chart..."
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
        title="Error Loading Burndown Chart"
        message="We encountered an error while loading the burndown chart."
        onRetry={() => refetch()}
        retryText="Reload Chart"
      />
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center text-gray-500">
          <Text>No burndown data available</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Hours Burndown Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 120, bottom: 60, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="linear"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Days",
              legendOffset: 45,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Hours Remaining",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableSlices="x"
            colors={["#3b82f6", "#ef4444"]}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 12,
                  },
                },
                legend: {
                  text: {
                    fontSize: 14,
                    fontWeight: 600,
                  },
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
