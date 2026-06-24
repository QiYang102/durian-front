import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isToday } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../../../calendar.css";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import { Card, CardContent } from "@/components/ui/Card";

const LEAVE_TYPES: Record<string, string> = {
  "Emergency Leave": "#dc2626", // Red-600
  "Annual Leave": "#2563eb", // Blue-600
  "Medical Leave": "#d97706", // Amber-600
  "Public Holiday": "#059669", // Emerald-600
  "Birthday Leave": "#db2777", // Pink-600
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const CustomToolbar = (toolbar: any) => {
  const goToToday = () => toolbar.onNavigate("TODAY");
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const handleViewChange = (e: any) => toolbar.onView(e.target.value);

  return (
    <div className="flex flex-col mb-4 bg-white">
      {/* Top Row: Navigation and View Selection */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            Today
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={goToBack}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-800 ml-2">
            {toolbar.label}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={toolbar.view}
            onChange={handleViewChange}
            className="bg-slate-50 border-none text-slate-600 text-sm font-medium rounded-lg px-3 py-2 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-2 mb-4">
        {Object.entries(LEAVE_TYPES).map(([label, color]) => {
          return (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:scale-105"
            >
              <div className="relative flex items-center justify-center">
                <div
                  className="w-2.5 h-2.5 rounded-full z-10"
                  style={{ backgroundColor: color }}
                />
                <div
                  className="absolute w-4 h-4 rounded-full opacity-20"
                  style={{ backgroundColor: color }}
                />
              </div>
              <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function GoogleCalendar() {
  const [events] = useState([
    {
      id: 1,
      title: "Sarah - Emergency Leave",
      start: new Date(2026, 0, 26),
      end: new Date(2026, 0, 28),
      type: "Emergency Leave",
      allDay: true,
    },
    {
      id: 2,
      title: "Sarah - Emergency Leave 2",
      start: new Date(2026, 0, 26),
      end: new Date(2026, 0, 28),
      type: "Emergency Leave",
      allDay: true,
    },
    {
      id: 3,
      title: "Sarah - Emergency Leave 3",
      start: new Date(2026, 0, 26),
      end: new Date(2026, 0, 28),
      type: "Emergency Leave",
      allDay: true,
    },
    {
      id: 4,
      title: "Sarah - Emergency Leave 4",
      start: new Date(2026, 0, 26),
      end: new Date(2026, 0, 28),
      type: "Emergency Leave",
      allDay: true,
    },
    {
      id: 5,
      title: "Mike - Annual Leave",
      start: new Date(2026, 0, 28),
      end: new Date(2026, 0, 30),
      type: "Annual Leave",
      allDay: true,
    },
    {
      id: 6,
      title: "Public Holiday",
      start: new Date(2026, 0, 1),
      end: new Date(2026, 0, 1),
      type: "Public Holiday",
      allDay: true,
    },
    {
      id: 7,
      title: "Jane - Medical Leave",
      start: new Date(2026, 0, 15),
      end: new Date(2026, 0, 15),
      type: "Medical Leave",
      allDay: true,
    },
  ]);

  const handleSelectEvent = (event: any) => {
    alert(`
      Event: ${event.title}
      Type: ${event.type}
      Dates: ${format(event.start, "PPP")} - ${format(event.end, "PPP")}
    `);
  };

  return (
    <ClassicLayout
      title="Testing"
      content={
        <Card>
          <CardContent className="h-screen">
            <Calendar
              localizer={localizer}
              events={events}
              defaultView="month"
              views={["month", "week"]}
              onSelectEvent={handleSelectEvent}
              popup={true} // This enables the built-in "more" popup
              eventPropGetter={(event: any) => {
                const backgroundColor = LEAVE_TYPES[event.type] || "#475569"; // Default to Slate-600

                return {
                  className: "!border-none !shadow-sm",
                  style: {
                    backgroundColor: backgroundColor,
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontWeight: "500",
                    fontSize: "12px",
                    padding: "2px 6px",
                  },
                };
              }}
              components={{
                toolbar: CustomToolbar,
              }}
            />
          </CardContent>
        </Card>
      }
    />
  );
}

export const Route = createFileRoute("/_app/testing/")({
  component: GoogleCalendar,
});
