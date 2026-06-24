import React from "react";
import { ResponsiveBar } from "@nivo/bar";

interface NivoBarChartProps {
  data: { group: string; count: number }[];
}

const NivoBarChart :  React.FC<NivoBarChartProps>= ({ data }) => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={data}
        keys={[
            'count',
        ]}
        indexBy="group"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={"#ffb200"}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          truncateTickAt: 0,
          tickValues: data.map((d) => d.count).filter((v, i, arr) => arr.indexOf(v) === i), // Ensures whole numbers only
          format: (value) => Math.round(value),
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        role="application"
      />
    </div>
  );
};

export default NivoBarChart;