import { Card, CardContent } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { useState } from "react";
import { Calendar, User, ChevronDown } from "lucide-react";
import { listEventCalendars } from "@ttm/api/modules/eventCalendar";
import { formatDisplayDate } from "@ttm/utils";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";

interface LeaveSummaryProps {
  iterationId: string;
  startDate: string;
  endDate: string;
}

export function LeaveSummary({
  iterationId,
  startDate,
  endDate,
}: LeaveSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Fetch event calendars filtered by iteration date range
  const { data, isLoading, isError, refetch } = listEventCalendars(
    ["leave-summary", iterationId, startDate, endDate],
    {
      per_page: 100,
      include: ["user.*"],
      filter: {
        "start_date.lte": endDate,
        "end_date.gte": startDate,
      },
    },
    {
      user: "users",
    },
  );

  const eventCalendars = data?.event_calendars || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Loading showText text="Loading leave summary..." />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Error Loading Leave Summary"
        message="Failed to load leave summary."
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-0">
        <div
          className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Leave Summary
          </Text>
          <Text className="text-xs text-gray-500 ml-auto">
            Total {eventCalendars.length}
          </Text>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isCollapsed ? "-rotate-90" : "rotate-0"
            }`}
          />
        </div>

        {!isCollapsed && (
          <div className="mt-3">
            {eventCalendars.length === 0 ? (
              <div className="text-center py-4">
                <Text className="text-xs text-gray-500">
                  No scheduled leaves
                </Text>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {eventCalendars.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.user ? (
                        item.user.image ? (
                          <img
                            src={getHttpsImageUrl(item.user.image)}
                            // src={item.user.image}
                            alt={item.user.fullname || "User"}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          // Fallback to user icon if no image
                          <div className="p-1 rounded flex-shrink-0 bg-blue-500">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )
                      ) : (
                        // Public holiday icon
                        <div className="p-1 rounded flex-shrink-0 bg-orange-500">
                          <Calendar className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.user?.fullname ||
                          item.description ||
                          "Public Holiday"}
                      </Text>
                    </div>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatDisplayDate(item.start_date || "")} -{" "}
                      {formatDisplayDate(item.end_date || "")}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
