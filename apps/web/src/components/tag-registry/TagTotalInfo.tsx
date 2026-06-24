import { BookOpen, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { TagReport } from "@ttm/api/types/models/story-tag";

const STATS_FIELDS = [
  { key: "total_stories", label: "Total Stories", icon: BookOpen },
  {
    key: "total_estimate_hours",
    label: "Total Estimated Time (Hours)",
    icon: Clock,
  },
];

export default function TagTotalInfo({
  result,
}: {
  result: TagReport | undefined;
}) {
  const [animatedTotals, setAnimatedTotals] = useState<number[]>(
    STATS_FIELDS.map(() => 0),
  );

  const stats = STATS_FIELDS.map(({ key, label, icon }) => {
    const total = (result as any)?.[key] ?? 0;

    return {
      label,
      Icon: icon,
      total,
    };
  });

  useEffect(() => {
    const duration = 500;
    const startTime = performance.now();
    const startValues = animatedTotals;
    const endValues = stats.map((s) => s.total);

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const newValues = startValues.map((start, i) => {
        const target = endValues[i];
        const value = start + (target - start) * progress;
        return stats[i].label === "Total Estimated Time (Hours)"
          ? parseFloat(value.toFixed(2))
          : Math.round(value);
      });
      setAnimatedTotals(newValues);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [result]);
  return (
    <>
      {stats.map(({ label, Icon }, index) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row justify-center items-start p-4 pb-8 gap-5">
            <Icon className="w-8 h-8 mt-2 text-blue-500" />
            <div className="flex flex-col items-start">
              <span className="text-4xl font-bold">
                {label === "Total Estimated Time"
                  ? animatedTotals[index].toFixed(2)
                  : animatedTotals[index]}
              </span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
