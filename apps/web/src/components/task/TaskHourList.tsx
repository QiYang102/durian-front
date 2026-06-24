import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { TaskHour } from "@ttm/api/types/models/taskHour";
import { listTaskHours } from "@ttm/api";
import { DeleteTaskHourButton } from "./DeleteTaskHourButton";
import { formatDateTime } from "@ttm/utils";

const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
};

const TaskHourList = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({ from: "/_app/task/$taskId/task-hours" });

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const { data, isLoading, isFetching, isError, refetch } = listTaskHours(
    [taskId, page.toString(), sortingColumn],
    {
      sort: [sortingColumn],
      page: page,
      per_page: 10,
      filter: {
        task: taskId,
        is_active: true,
      },
      include: ["user.*"],
    },
    { user: "users" },
  );

  const { taskHours, meta } = data || {};

  const updateURL = useCallback(
    (currentPage: number) => {
      if (currentPage > 1) {
        navigate({
          to: "/task/$taskId/task-hours",
          params: { taskId },
          search: { page: currentPage },
          replace: true,
        });
      } else {
        navigate({
          to: "/task/$taskId/task-hours",
          params: { taskId },
          search: {},
          replace: true,
        });
      }
    },
    [navigate, taskId],
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

  const columns: ColumnDef<TaskHour>[] = [
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
      accessorKey: "hour",
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
                "h-auto w-full justify-start p-0 font-semibold",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Used Hours
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-32 text-left">
          {parseFloat(row.getValue("hour")).toFixed(2)}h
        </div>
      ),
      enableSorting: true,
      size: 120,
    },
    {
      accessorKey: "remain_hour",
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
                "h-auto w-full justify-start p-0 font-semibold whitespace-nowrap",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Remaining Hours
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-32 text-left">
          {parseFloat(row.getValue("remain_hour")).toFixed(2)}h
        </div>
      ),
      enableSorting: true,
      size: 120,
    },
    {
      accessorKey: "user",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="min-w-32">
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
              User
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-32 text-left">
          {typeof row.original.user === "object" && row.original.user?.fullname
            ? row.original.user.fullname
            : `User #${row.getValue("user")}`}
        </div>
      ),
      enableSorting: true,
      minSize: 200,
    },
    {
      accessorKey: "create_at",
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
                "h-auto w-full justify-start p-0 font-semibold whitespace-nowrap",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Create At
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-36 text-left">
          {formatDateTime(row.getValue("create_at")) || "-"}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <div className="w-24">Actions</div>,
      cell: ({ row }) => (
        <DeleteTaskHourButton taskHour={row.original} onSuccess={refetch} />
      ),
      enableSorting: false,
      size: 100,
    },
  ];

  const table = useReactTable({
    data: taskHours ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    state: {
      sorting,
    },
  });

  const renderTableContent = () => {
    if (isLoading || isFetching) {
      return (
        <TableSkeleton
          rows={10}
          columns={columns.length}
          headerLabels={["ID", "Hours", "User", "Create At", "Actions"]}
          cellHeight="h-6"
        />
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Task Hours"
          message="We encountered an error while loading the task hour records. Please try again."
          onRetry={refetch}
          retryText="Reload Data"
        />
      );
    }

    if (!taskHours || taskHours.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-12 text-gray-500">
          <Clock className="h-12 w-12" />
          <Text>No hour records found for this task</Text>
        </div>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 text-left">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {meta && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex flex-1 items-center gap-4 text-sm">
              {meta.total_results || 0} total records
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

  return <div>{renderTableContent()}</div>;
};

export default TaskHourList;
