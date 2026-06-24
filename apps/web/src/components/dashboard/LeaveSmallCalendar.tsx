import { useState } from "react";

import { format, subDays, startOfMonth, addDays, endOfMonth } from "date-fns";

import { Card, CardContent } from "../ui/Card";
import { Calendar, CalendarDayButton } from "../ui/CalendarV1";
import { EventType } from "@ttm/api/types/enums";
import { EventCalendar } from "@ttm/api/types/models/eventCalendar";
import ErrorDisplay from "../ui/ErrorDisplay";
import { LEAVE_TYPES } from "../leave/LeaveCalendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { useListEventCalendarsByRange } from "@ttm/api/modules/eventCalendar";

function LeaveSmallCalendar() {
  const teamId = localStorage.getItem("teamId");

  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
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

  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const getAllEventsForDate = (date: Date) => {
    const targetTime = normalizeDate(date);
    return formattedEvents.filter((e) => {
      const startTime = normalizeDate(e.start);
      const endTime = normalizeDate(e.end);
      return targetTime >= startTime && targetTime <= endTime;
    });
  };

  const getEventType = (date: Date) => {
    const matchingEvents = getAllEventsForDate(date);
    if (matchingEvents.some((e) => e.type === EventType.PUBLIC_HOLIDAY)) {
      return EventType.PUBLIC_HOLIDAY;
    }
    if (matchingEvents.some((e) => e.type === EventType.EVENT)) {
      return EventType.EVENT;
    }
    if (matchingEvents.some((e) => e.type === EventType.DEADLINE)) {
      return EventType.DEADLINE;
    }
    return matchingEvents.length > 0 ? "Other" : undefined;
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
    return null;
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex h-72 items-center justify-center bg-white/50 backdrop-blur-[1px] border">
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
    <Card>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          numberOfMonths={1}
          className="w-full"
          captionLayout="dropdown-months"
          month={viewDate}
          onMonthChange={handleNavigate}
          classNames={{
            table: "border-separate border-spacing-1",
          }}
          modifiers={{
            holiday: (date) => getEventType(date) === EventType.PUBLIC_HOLIDAY,
            event: (date) => getEventType(date) === EventType.EVENT,
            deadline: (date) => getEventType(date) === EventType.DEADLINE,
            otherLeave: (date) => {
              const type = getEventType(date);
              return type ? type !== EventType.PUBLIC_HOLIDAY : false;
            },
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const dayEvents = getAllEventsForDate(day.date);
              let backgroundStyle = undefined;
              let textColor = undefined;

              if (modifiers.selected) {
                textColor = "white";
              }
              if (modifiers.holiday) {
                backgroundStyle = LEAVE_TYPES["Public Holiday"];
              } else if (modifiers.otherLeave) {
                backgroundStyle = "#fcd34d";
              }
              if (modifiers.event) {
                backgroundStyle = LEAVE_TYPES["Event"];
              }
              if (modifiers.deadline) {
                backgroundStyle = LEAVE_TYPES["Deadline"];
              }
              if (
                (modifiers.holiday ||
                  modifiers.event ||
                  modifiers.deadline ||
                  modifiers.otherLeave) &&
                modifiers.selected
              ) {
                textColor = "black";
              }

              const buttonContent = (
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  {...props}
                  style={{ background: backgroundStyle, color: textColor }}
                  className="flex flex-col items-center justify-center rounded-md w-full h-full"
                >
                  <span className="font-semibold">{children}</span>
                </CalendarDayButton>
              );

              return dayEvents.length > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full cursor-pointer">
                      {buttonContent}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="flex flex-col gap-1 p-2 min-w-32"
                  >
                    <p className="text-[10px] font-semibold border-b pb-1 mb-1 uppercase">
                      {day.date.toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>

                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="px-2 py-1 rounded text-[10px] font-semibold text-white"
                        style={{
                          backgroundColor: LEAVE_TYPES[event.type] || "#fcd34d",
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </TooltipContent>
                </Tooltip>
              ) : (
                buttonContent
              );
            },
          }}
        />

        {/* Legend Section */}
        <div className="p-4 border-t border-border bg-slate-50/50 rounded-b-xl transition-all">
          <div className="flex flex-wrap items-center gap-4">
            {/* Always Visible: Public Holiday, Event, Deadline */}
            {Object.entries(LEAVE_TYPES)
              .filter(([key]) =>
                ["Public Holiday", "Event", "Deadline"].includes(key),
              )
              .map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="size-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-tight">
                    {label}
                  </span>
                </div>
              ))}

            {/* Toggle Button for everything else */}
            <button
              onClick={() => setIsLegendExpanded(!isLegendExpanded)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <div
                className="size-3 rounded-sm"
                style={{ background: "#fcd34d" }}
              />{" "}
              {/* Neutral icon color */}
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-tight">
                Other Leave {isLegendExpanded ? "▲" : "▼"}
              </span>
            </button>
          </div>

          {/* Expanded Section */}
          {isLegendExpanded && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-200/50">
              {Object.entries(LEAVE_TYPES)
                .filter(
                  ([key]) =>
                    !["Public Holiday", "Event", "Deadline"].includes(key),
                )
                .map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-muted-foreground font-medium truncate">
                      {type}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default LeaveSmallCalendar;
