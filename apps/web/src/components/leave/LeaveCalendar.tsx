import { useState } from "react";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  subDays,
  addDays,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { useListEventCalendarsByRange } from "@ttm/api/modules/eventCalendar";
import { EventCalendar } from "@ttm/api/types/models/eventCalendar";
import { EventType } from "@ttm/api/types/enums";
import CustomToolbar from "./CustomToolbar";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Text } from "../ui/Text";
import "@/calendar.css";

export const LEAVE_TYPES: Record<string, string> = {
  "Public Holiday": "#059669", // Deep Emerald
  Event: "#7c3aed", // Deep Violet
  Deadline: "#ea580c", // Rich Orange
  "Emergency Leave": "#be123c", // Deep Rose
  "Annual Leave": "#0284c7", // Ocean Blue
  "Medical Leave": "#92400e", // Dark Amber
  "Birthday Leave": "#c026d3", // Fuchsia
  "Replacement Leave": "#4b5563", // Slate Gray
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

export default function LeaveCalendar() {
  const navigate = useNavigate();
  const teamId = localStorage.getItem("teamId");
  const [currentRange, setCurrentRange] = useState({
    start: format(subDays(startOfMonth(new Date()), 7), "yyyy-MM-dd"),
    end: format(addDays(endOfMonth(new Date()), 7), "yyyy-MM-dd"),
  });
  const [viewDate, setViewDate] = useState(new Date());

  const { data, isLoading, isFetching, isError, refetch } =
    useListEventCalendarsByRange(
      [currentRange.start, currentRange.end],
      {
        params: {
          start_date: currentRange.start,
          end_date: currentRange.end,
        },
        include: ["user.*"],
      },
      {
        user: "users",
      },
    );

  const formattedEvents =
    data?.event_calendars?.map((item: EventCalendar) => {
      var eventType = "";

      if (
        item.type === EventType.EMERGENCY_LEAVE ||
        item.type === EventType.EMERGENCY_LEAVE_AM ||
        item.type === EventType.EMERGENCY_LEAVE_PM
      ) {
        eventType = EventType.EMERGENCY_LEAVE;
      } else if (
        item.type === EventType.ANNUAL_LEAVE ||
        item.type === EventType.ANNUAL_LEAVE_AM ||
        item.type === EventType.ANNUAL_LEAVE_PM
      ) {
        eventType = EventType.ANNUAL_LEAVE;
      } else {
        eventType = item.type;
      }

      return {
        id: item.id,
        title:
          eventType === EventType.PUBLIC_HOLIDAY ||
          eventType === EventType.EVENT ||
          eventType === EventType.DEADLINE
            ? item.description || EventType.PUBLIC_HOLIDAY
            : item.user?.fullname || "",

        start: new Date(item.start_date),
        end: new Date(item.end_date),

        type: eventType,
        allDay: true,
      };
    }) || [];

  const handleSelectEvent = (event: any) => {
    navigate({
      to: "/leave/$leaveId",
      params: { leaveId: event.id.toString() },
    });
  };

  const handleNavigate = (newDate: Date) => {
    setViewDate(newDate);
    const expandedStart = format(
      subDays(startOfMonth(newDate), 7),
      "yyyy-MM-dd",
    );
    const expandedEnd = format(addDays(endOfMonth(newDate), 7), "yyyy-MM-dd");
    setCurrentRange({
      start: expandedStart,
      end: expandedEnd,
    });
  };

  if (!teamId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <AlertCircle className="h-16 w-16 text-danger-500" />
          <div className="space-y-2">
            <Text variant="h2">Team Check-In Required</Text>
            <div>
              <Text variant="default" className="text-gray-600">
                Please check in to a team from the sidebar before viewing the
                leave listing calendar.
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center bg-white/50 backdrop-blur-[1px] h-screen">
        <div className="flex flex-col items-center gap-2">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm font-medium text-slate-500">Loading Event...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Error Loading Leave Calendar"
        message="We encountered an error while loading the leave calendar. Please try again."
        onRetry={refetch}
        retryText="Reload Data"
      />
    );
  }

  return (
    <div className="h-screen">
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        defaultView="month"
        views={["month", "week"]}
        onSelectEvent={handleSelectEvent}
        popup={true} // This enables the built-in "more" popup
        date={viewDate}
        onNavigate={handleNavigate}
        eventPropGetter={(event: any) => {
          const backgroundColor = LEAVE_TYPES[event.type] || "#475569";
          const isOutOfRange = !isSameMonth(event.start, viewDate);
          return {
            className: "!border-none !shadow-sm transition-opacity",
            style: {
              backgroundColor: backgroundColor,
              color: "#ffffff",
              borderRadius: "6px",
              fontWeight: "500",
              fontSize: "16px",
              padding: "2px 6px",
              opacity: isOutOfRange ? 0.4 : 1,
              pointerEvents: isOutOfRange ? "none" : "auto",
            },
          };
        }}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
