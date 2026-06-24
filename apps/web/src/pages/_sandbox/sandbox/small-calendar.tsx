"use client";

import * as React from "react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CalendarDayButton } from "@/components/ui/CalendarV1";
import { Card, CardContent } from "@/components/ui/Card";
import { LEAVE_TYPES } from "@/components/leave/LeaveCalendar";
import { EventType } from "@ttm/api/types/enums";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export function CalendarCustomDays() {
  const [events] = useState([
    {
      id: 1,
      title: "Sarah",
      start: new Date(2026, 0, 26),
      end: new Date(2026, 0, 27),
      type: "Emergency Leave",
    },
    {
      id: 2,
      title: "Mike",
      start: new Date(2026, 0, 29),
      end: new Date(2026, 0, 30),
      type: "Annual Leave",
    },
    {
      id: 3,
      title: "Public",
      start: new Date(2026, 0, 1),
      end: new Date(2026, 0, 1),
      type: "Public Holiday",
    },
    {
      id: 4,
      title: "Jane",
      start: new Date(2026, 0, 15),
      end: new Date(2026, 0, 15),
      type: "Medical Leave",
    },
    {
      id: 5,
      title: "Jane",
      start: new Date(2026, 0, 15),
      end: new Date(2026, 0, 15),
      type: "Medical Leave",
    },
    {
      id: 5,
      title: "Split",
      start: new Date(2026, 0, 28),
      end: new Date(2026, 0, 28),
      type: "Emergency Leave",
    },
  ]);

  const getAllEventsForDate = (date: Date) => {
    return events.filter((e) => date >= e.start && date <= e.end);
  };

  const getEventType = (date: Date) => {
    const matchingEvents = getAllEventsForDate(date);
    if (matchingEvents.some((e) => e.type === EventType.PUBLIC_HOLIDAY)) {
      return EventType.PUBLIC_HOLIDAY;
    }
    return matchingEvents.length > 0 ? "Other" : undefined;
  };

  return (
    <TooltipProvider delayDuration={1}>
      <Card className="mx-auto p-0 w-80">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            numberOfMonths={1}
            className="w-full"
            classNames={{
              table: "border-separate border-spacing-1",
            }}
            modifiers={{
              holiday: (date) =>
                getEventType(date) === EventType.PUBLIC_HOLIDAY,
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

                // ... Keep your existing backgroundStyle and textColor logic here ...
                if (modifiers.selected) {
                  textColor = "white";
                }
                if (modifiers.holiday) {
                  backgroundStyle = LEAVE_TYPES["Public Holiday"];
                } else if (modifiers.otherLeave) {
                  backgroundStyle = "#fcd34d";
                }
                if (
                  (modifiers.holiday || modifiers.otherLeave) &&
                  !modifiers.selected
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
                      <p className="text-[10px] font-bold border-b pb-1 mb-1 uppercase">
                        {day.date.toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>

                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="px-2 py-1 rounded text-[10px] font-bold text-white"
                          style={{
                            backgroundColor:
                              LEAVE_TYPES[event.type] || "#fcd34d",
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
          <div className="flex items-center gap-4 p-4 border-t border-border bg-slate-50/50 rounded-b-xl">
            <div className="flex items-center gap-1.5">
              <div
                className="size-3 rounded-sm"
                style={{ backgroundColor: LEAVE_TYPES["Public Holiday"] }}
              />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                Holiday
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-sm bg-[#fcd34d]" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                Other Leave
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/small-calendar")({
  component: CalendarCustomDays,
});
