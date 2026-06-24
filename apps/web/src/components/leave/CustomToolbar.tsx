import { ChevronLeft, ChevronRight } from "lucide-react";
import { LEAVE_TYPES } from "./LeaveCalendar";
import { useState } from "react";

export default function CustomToolbar(toolbar: any) {
  const [showAll, setShowAll] = useState(false);

  const goToToday = () => toolbar.onNavigate("TODAY");
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const handleViewChange = (e: any) => toolbar.onView(e.target.value);

  const priorityKeys = ["Public Holiday", "Event", "Deadline"];
  const allEntries = Object.entries(LEAVE_TYPES);
  const visibleEntries = showAll
    ? allEntries
    : allEntries.filter(([label]) => priorityKeys.includes(label));
  const hiddenCount = allEntries.length - priorityKeys.length;

  return (
    <div className="flex flex-col mb-4 bg-white">
      <div className="flex items-center justify-between pb-4">
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

      <div className="flex flex-wrap gap-2 px-2 mb-4 items-center">
        {visibleEntries.map(([label, color]) => (
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
        ))}

        {!showAll ? (
          <button
            onClick={() => setShowAll(true)}
            className="px-3 py-1.5 rounded-full border border-dashed border-slate-200 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors uppercase"
          >
            + {hiddenCount} More Leaves
          </button>
        ) : (
          <button
            onClick={() => setShowAll(false)}
            className="px-3 py-1.5 text-xs font-bold text-blue-500 hover:underline transition-colors uppercase"
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}
