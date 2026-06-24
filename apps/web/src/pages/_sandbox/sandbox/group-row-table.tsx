import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

const randomKey = () => Math.random().toString(36).substring(7);

// Generate time slots in 30-minute intervals
const generateTimeSlots = (start: string, end: string, interval: number) => {
  const times = [];

  let [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (
    startHour < endHour ||
    (startHour === endHour && startMinute <= endMinute)
  ) {
    const formattedTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
    times.push(formattedTime);

    startMinute += interval;
    if (startMinute >= 60) {
      startMinute = 0;
      startHour += 1;
    }
  }

  return times;
};

// Time comparison
const compareTimes = (timeA: string, timeB: string) => {
  const [hoursA, minutesA] = timeA.split(":").map(Number);
  const [hoursB, minutesB] = timeB.split(":").map(Number);

  if (hoursA !== hoursB) {
    return hoursA - hoursB;
  }
  return minutesA - minutesB;
};

function GroupRowTableSample() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "time", desc: false },
  ]);
  const [grouping, setGrouping] = useState(["time"]);
  const [sortingColumn, setSortingColumn] = useState("time");

  // Customer data
  const data = useMemo(
    () =>
      [
        { day: "Mon 19/8", time: "10:00", customer: "Customer A" },
        { day: "Mon 19/8", time: "12:00", customer: "Customer J" },
        { day: "Mon 19/8", time: "10:00", customer: "Customer B" },
        { day: "Tue 20/8", time: "10:00", customer: "Customer C" },
        { day: "Wed 21/8", time: "10:30", customer: "Customer D" },
        { day: "Thu 22/8", time: "11:00", customer: "Customer E" },
        { day: "Fri 23/8", time: "11:00", customer: "Customer F" },
        { day: "Sat 24/8", time: "10:00", customer: "Customer G" },
        { day: "Sun 25/8", time: "10:00", customer: "Customer H" },
        { day: "Sun 25/8", time: "10:00", customer: "Customer I" },
      ].sort((a, b) => compareTimes(a.time, b.time)),
    [],
  );

  const timeSlots = useMemo(() => generateTimeSlots("10:00", "22:00", 30), []);

  const uniqueDays = useMemo(
    () => Array.from(new Set(data.map((entry) => entry.day))),
    [data],
  );

  const navigateToCustomerDetail = (customerId: any) => {
    //TODO: navigate to customer detail page
    console.log("customerId", customerId);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "time",
        header: "Time",
        cell: (info: any) => info.getValue(),
        getGroupingValue: (row: any) => row.time,
      },
      ...uniqueDays.map((day) => ({
        accessorKey: day,
        header: day,
        cell: (info: any) => {
          const rowTime = info.row.original.time;
          const day = info.column.id;

          const customersForThisSlot = data.filter(
            (entry) => entry.day === day && entry.time === rowTime,
          );

          return (
            <>
              {customersForThisSlot.map((entry) => (
                <div
                  key={entry.customer}
                  className="cursor-pointer items-start text-blue-600"
                  onClick={() => navigateToCustomerDetail(entry.customer)}
                >
                  {entry.customer}
                </div>
              ))}
            </>
          );
        },
      })),
    ],
    [data, uniqueDays],
  );

  const tableData = useMemo(
    () => timeSlots.map((time) => ({ time })),
    [timeSlots],
  );

  useEffect(() => {
    if (sorting && sorting.length > 0) {
      const sortingField = sorting[0];
      let value = "";

      if (sorting[0]?.desc === false) {
        value = sortingField?.id;
      } else {
        value = `-${sortingField?.id}`;
      }
      setSortingColumn(value);
    }
  }, [sorting]);

  const table = useReactTable({
    data: tableData,
    columns,
    manualSorting: false,
    state: {
      grouping,
      sorting,
    },
    onGroupingChange: setGrouping, // Handle grouping changes
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="w-full">
      <div className="flex items-center">
        <Table>
          <TableHeader className=" bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center text-black">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={randomKey()} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/group-row-table")({
  component: GroupRowTableSample,
});
