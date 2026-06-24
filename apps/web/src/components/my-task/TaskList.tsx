import { useEffect, useState } from "react";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";
import {
  CapacityReport,
  TaskStatusOption,
  TaskStory,
} from "@ttm/api/types/models/reporting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

interface TaskListProps {
  capacityReportData: CapacityReport;
  viewMode?: "daily" | "weekly";
}

const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
};

export default function TaskList({
  capacityReportData,
  viewMode,
}: TaskListProps) {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);

  const navigateToStory = (row: any) => {
    navigate({
      to: "/story/$storyId",
      params: { storyId: row.story.toString() },
    });
  };

  const columns: ColumnDef<TaskStory>[] = [
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              className={cn("h-auto p-0 font-semibold justify-start w-full")}
            >
              Task Description
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-left truncate whitespace-nowrap overflow-hidden max-w-[200px]">
          {row.original.description || "-"}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "story_name",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
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
              Story Name
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-left truncate whitespace-nowrap overflow-hidden max-w-[200px]">
          {row.original.story_name || "-"}
        </div>
      ),
      enableSorting: true,
      size: 200,
    },
    {
      accessorKey: "estimate_time",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
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
              Est. Time
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm">{row.original.estimate_time || "-"}</div>
      ),
      size: 125,
      enableSorting: true,
    },
    {
      accessorKey: "total_hour_used",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
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
              Hours Used
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm">{row.original.total_hour_used || "-"}</div>
      ),
      size: 125,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
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
              Status
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex flex-col items-center justify-center gap-2">
          <Badge
            className="truncate"
            color={TaskStatusOption.get(row.original.status || "")?.chipVariant}
          >
            {TaskStatusOption.get(row.original.status || "")?.chipTextVariant}
          </Badge>
        </div>
      ),
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data: capacityReportData.tasks ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualSorting: false,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
    },
  });

  useEffect(() => {
    table.setPageSize(perPage);
  }, [perPage, table]);

  useEffect(() => {
    table.setPageIndex(page - 1);
  }, [page, table]);

  const totalResults = capacityReportData.tasks?.length ?? 0;
  const totalPages = Math.ceil(totalResults / perPage);
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="">My Task Listing</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full">
          <div className="flex items-center">
            <div className="flex flex-1">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          style={{ width: header.getSize() }}
                        >
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
                        onClick={() => navigateToStory(row.original)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={`row-${row.index}-col-${cell.column.id}`}
                            className={
                              cell.column.id === "description"
                                ? "cursor-pointer text-blue-500"
                                : ""
                            }
                          >
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
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex flex-1 items-center gap-4 text-sm">
            {capacityReportData.tasks?.length ?? 0} total tasks
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select
              value={perPage.toString()}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-x-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
