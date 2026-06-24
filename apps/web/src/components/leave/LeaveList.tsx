import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowDown, ArrowUp, ArrowUpDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventCalendar } from "@ttm/api/types/models/eventCalendar";
import { listEventCalendars } from "@ttm/api/modules/eventCalendar";
import { formatDate } from "@ttm/utils";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";
import TableSkeleton from "@/components/ui/TableSkeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Text } from "../ui/Text";
import { DeleteLeaveListingButton } from "./DeleteLeaveListingButton";

const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
};

const LeaveList = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const teamId = localStorage.getItem("teamId");

  const { data, isLoading, isFetching, isError, refetch } = listEventCalendars(
    [page.toString(), sortingColumn],
    {
      sort: [sortingColumn],
      page: page,
      per_page: 10,
      include: ["user.*"],
    },
    {
      user: "users",
    },
  );

  const { event_calendars, meta } = data || {};

  const navigateToLeaveListing = (leave: EventCalendar) => {
    navigate({
      to: "/leave/$leaveId",
      params: { leaveId: leave.id.toString() },
    });
  };

  const updateURL = useCallback(
    (currentPage: number) => {
      if (currentPage > 1) {
        navigate({
          to: "/leave",
          search: { page: currentPage },
          replace: true,
        });
      } else {
        navigate({
          to: "/leave",
          search: {},
          replace: true,
        });
      }
    },
    [navigate],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateURL(newPage);
    },
    [updateURL],
  );

  useEffect(() => {
    if (sorting && sorting.length > 0) {
      const sortingField = sorting[0];
      const value =
        sortingField?.desc === false ? sortingField.id : `-${sortingField.id}`;
      setSortingColumn(value);
    }
  }, [sorting]);

  const columns: ColumnDef<EventCalendar>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="w-16">
            <Button
              variant="ghost"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
              className={cn(
                "h-auto w-full justify-start p-0 font-semibold",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              ID
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="w-16 text-left">{row.getValue("id") || "-"}</div>
        );
      },
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="w-40">
            <Button
              variant="ghost"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
              className={cn(
                "h-auto w-full justify-start p-0 font-semibold",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Event
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-40 text-left">{row.getValue("type")}</div>
      ),
      enableSorting: true,
      size: 130,
    },

    {
      accessorKey: "user",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="min-w-28">
            <Button
              variant="ghost"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
              className={cn(
                "h-auto w-full justify-start p-0 font-semibold",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Name
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-28 text-left">
          {row.original.user?.fullname || "-"}
        </div>
      ),
      enableSorting: true,
      minSize: 200,
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="w-32">
            <Button
              variant="ghost"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
              className={cn(
                "h-auto p-0 font-semibold justify-start w-full",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Start Date
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-40 text-left">
          {formatDate(row.getValue("start_date"))}
        </div>
      ),
      enableSorting: true,
      size: 130,
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="w-32">
            <Button
              variant="ghost"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
              className={cn(
                "h-auto p-0 font-semibold justify-start w-full",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              End Date
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-40 text-left">
          {formatDate(row.getValue("end_date"))}
        </div>
      ),
      enableSorting: true,
      size: 130,
    },
    {
      id: "actions",
      header: () => <div className="w-24">Actions</div>,
      cell: ({ row }) => (
        <DeleteLeaveListingButton leave={row.original} onSuccess={refetch} />
      ),
      enableSorting: false,
      size: 150,
    },
  ];

  const table = useReactTable({
    data: event_calendars ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    state: {
      sorting,
    },
  });

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
                leave listing list.
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTableContent = () => {
    if (isLoading || isFetching) {
      return (
        <TableSkeleton
          rows={10}
          columns={columns.length}
          headerLabels={[
            "ID",
            "Event",
            "Name",
            "Start Date",
            "End Date",
            "Actions",
          ]}
          cellHeight="h-6"
        />
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Leave Listings"
          message="We encountered an error while loading the leave listings. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 text-left">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => navigateToLeaveListing(row.original)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 text-left">
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
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {meta && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex flex-1 items-center gap-4 text-sm">
              {meta.total_results || 0} total
            </div>
            <div className="space-x-2">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  return <>{renderTableContent()}</>;
};

export default LeaveList;
