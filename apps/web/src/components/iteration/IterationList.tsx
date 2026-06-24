import { useEffect, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { listIterations } from "@ttm/api";

import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent } from "@/components/ui/Card";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import {
  Iteration,
  IterationStatusOption,
} from "@ttm/api/types/models/iteration";
import { Badge } from "../ui/Badge";
import { formatDisplayDate } from "@ttm/utils";

interface IterationListProps {
  teamId: string;
}

const IterationList = ({ teamId }: IterationListProps) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const navigateToIteration = (row: any) => {
    navigate({
      to: "/iteration/$iterationId",
      params: { iterationId: row?.id },
    });
  };

  const queryKey = [
    "list-of-iterations",
    page.toString(),
    sortingColumn,
    teamId,
  ];

  const { data, isLoading, isError, refetch } = listIterations(queryKey, {
    page: page,
    per_page: 10,
    sort: [sortingColumn],
    filter: { team: teamId },
  });

  const { iterations, meta } = data || {};

  const columns: ColumnDef<Iteration>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.original.id || "-"}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.original.name || "-"}</div>
      ),
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDisplayDate(row.original.start_date || "")}
        </div>
      ),
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDisplayDate(row.original.end_date || "")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col items-center justify-center gap-2">
          <Badge
            className="truncate"
            color={
              IterationStatusOption.get(row.original.status || "")?.chipVariant
            }
          >
            {
              IterationStatusOption.get(row.original.status || "")
                ?.chipTextVariant
            }
          </Badge>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (sorting && sorting.length > 0) {
      let sortingField = sorting[0];
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
    data: iterations ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: false,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <TableSkeleton
            rows={5}
            columns={5}
            headerLabels={["ID", "Name", "Start Date", "End Date", "Status"]}
            cellHeight="h-4"
          />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load iterations"
        message="We couldn't load the iterations data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  return (
    <Card>
      <CardContent className="overflow-x-auto">
        <div className="w-full">
          <div className="flex items-center">
            <div className="flex flex-1">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
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
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={`row-${row.index}-col-${cell.column.id}`}
                            onClick={() => {
                              if (cell.column.id === "name") {
                                navigateToIteration(cell.row.original);
                              }
                            }}
                            className={
                              cell.column.id === "name"
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
            {meta?.total_results} total
          </div>
          <div className="space-x-2">
            <Pagination
              currentPage={meta?.page}
              totalPages={meta?.total_pages}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IterationList;
