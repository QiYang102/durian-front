import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// Package Installation:
//npm install react-chartjs-2 chart.js

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My Pie Chart",
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <Pie data={data} />;
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/pieChart")({
  component: PieChart,
});
