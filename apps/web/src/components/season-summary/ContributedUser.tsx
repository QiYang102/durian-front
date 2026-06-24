import { Season } from "@ttm/api/types/models/season-summary";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ResponsiveBar } from "@nivo/bar";

export default function ContributedUser({
  season,
}: {
  season: Season | undefined;
}) {
  const chartData = season?.report_data.total_hours_committed_by_user ?? [];

  const top = chartData ? [...chartData].reverse() : [];
  console.log(top);

  const transformedData = top.map((item: any) => ({
    id: item.user_id,
    label:
      item.fullname.length > 15
        ? item.fullname.slice(0, 14) + "…"
        : item.fullname,
    value: item.total_hour,
    full_name: item.fullname,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributed User</CardTitle>
      </CardHeader>
      <CardContent className="h-96 shadow-sm">
        <ResponsiveBar
          data={transformedData}
          indexBy="label"
          layout="horizontal"
          padding={0.25}
          enableGridY={false}
          enableLabel={true}
          labelSkipWidth={12}
          labelSkipHeight={12}
          colors={{ scheme: "paired" }}
          colorBy="indexValue"
          margin={{ top: 20, right: 130, bottom: 50, left: 100 }}
          axisBottom={{
            legend: "Total Hours",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          tooltip={({ value, color, data }) => (
            <div
              style={{
                padding: 10,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                width: "max-content",
              }}
            >
              <div className="flex flex-row gap-3 items-center">
                <div
                  style={{ height: 12, width: 12, backgroundColor: color }}
                />
                <span>{data.full_name}:</span>
                <strong>{value}</strong>
              </div>
            </div>
          )}
          legends={[
            {
              dataFrom: "indexes",
              anchor: "bottom-right",
              direction: "column",
              translateX: 120,
              itemsSpacing: 5,
              itemWidth: 100,
              itemHeight: 16,
              symbolSize: 12,
              symbolShape: "circle",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
