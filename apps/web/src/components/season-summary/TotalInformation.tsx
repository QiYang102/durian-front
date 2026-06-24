import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Text } from "../ui/Text";
import {
  BadgeCheck,
  Bug,
  BookOpen,
  CalendarClock,
  ClipboardList,
  Microscope,
  Layers,
  ArrowRight,
} from "lucide-react";

const USER_FIELDS = [
  { key: "total_story", label: "Total Stories", icon: BookOpen },
  { key: "total_tasks_by_users", label: "Total Tasks", icon: ClipboardList },
  {
    key: "total_hours_committed_by_user",
    label: "Total Hours (Hours)",
    icon: CalendarClock,
  },
  { key: "total_rnd_by_users", label: "Total RnD", icon: Microscope },
  { key: "total_verified_by_users", label: "Total Verified", icon: BadgeCheck },
  { key: "total_bug_by_users", label: "Total Bugs", icon: Bug },
];

export default function UserSummaryCards({ season }: { season: any }) {
  const reportData = season?.report_data;

  const [animatedTotals, setAnimatedTotals] = useState<number[]>(
    USER_FIELDS.map(() => 0),
  );

  // Compute current totals
  const sums = USER_FIELDS.map(({ key, label, icon }) => {
    const data = reportData?.[key];

    // If data is just a number (like total_story), return it directly
    if (typeof data === "number") {
      return {
        label,
        Icon: icon,
        total: data,
      };
    }

    // 2. If data is an array (like tasks by users), calculate the sum
    const arr = Array.isArray(data) ? data : [];

    const valueField = arr[0]
      ? Object.keys(arr[0]).find((f) => f !== "user_id" && f !== "fullname")
      : null;

    const total = valueField
      ? arr.reduce((sum: any, item: any) => sum + (item[valueField] || 0), 0)
      : 0;

    return {
      label,
      Icon: icon,
      total,
    };
  });

  // Animate number changes
  useEffect(() => {
    const duration = 500;
    const startTime = performance.now();
    const startValues = animatedTotals;
    const endValues = sums.map((s) => s.total);

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const newValues = startValues.map((start, i) => {
        const target = endValues[i];
        const value = start + (target - start) * progress;
        // keep decimals only for Total Hours
        return sums[i].label === "Total Hours (Hours)"
          ? parseFloat(value.toFixed(2))
          : Math.round(value);
      });
      setAnimatedTotals(newValues);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [season]); // runs when season changes

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="py-7 flex flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Season Report
              </span>
              <Text variant="h2" className="text-xl font-bold leading-none">
                {season?.season_name || "-"}
              </Text>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-8 bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-md border md:border-none border-gray-100">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Total Iterations
                </p>
                <p className="text-lg font-bold">
                  {season.report_data.total_iteration}
                </p>
              </div>

              <div className="w-px h-8 bg-gray-300 hidden md:block"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Duration
                </p>
                <div className="flex items-center gap-1.5 text-lg font-bold">
                  <span>{season.start_date}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span>{season.end_date}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sums.map(({ label, Icon }, index) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row justify-center items-start p-4 pb-8 gap-5 shadow-sm m-auto">
              <Icon className="w-8 h-8 mt-2 text-blue-600" />

              <div className="flex flex-col items-start">
                <span className="text-4xl font-bold">
                  {label === "Total Hours (Hours)"
                    ? animatedTotals[index].toFixed(2)
                    : animatedTotals[index]}
                </span>
                <span className="text-sm text-gray-500">{label}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
