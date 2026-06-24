import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { checkCelebration, listStories } from "@ttm/api";

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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Story, StoryStatusOption } from "@ttm/api/types/models/story";
import { formatId } from "@ttm/utils";
import { StoryMode, StoryStatus } from "@ttm/api/types/enums";
import { Badge } from "../ui/Badge";
import { FileText } from "lucide-react";
import CelebrationMessage from "./CelebrationMessage";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

interface StoryboardListViewProps {
  bucket: StoryMode;
  iterationId: string;
}

const StoryboardListView = ({
  iterationId,
  bucket,
}: StoryboardListViewProps) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const navigateToStory = (row: any) => {
    navigate({
      to: "/story/$storyId",
      params: { storyId: row?.id.toString() },
    });
  };

  const getStatusFilter = (bucket: StoryMode) => {
    if (bucket === StoryMode.COMPLETED) {
      return [StoryStatus.COMPLETED];
    } else if (bucket === StoryMode.INCOMPLETED) {
      return [StoryStatus.NEW, StoryStatus.STARTED, StoryStatus.TAKEN];
    }
    return [];
  };

  const statusFilter = getStatusFilter(bucket);

  const { data, isLoading, isError, refetch } = listStories(
    [
      "list-of-stories",
      page.toString(),
      perPage.toString(),
      sortingColumn,
      bucket,
      iterationId,
    ],
    {
      page: page,
      per_page: perPage,
      sort: [sortingColumn],
      filter: { iteration: iterationId },
      in: {
        status: statusFilter,
      },
      include: ["project.*"],
    },
    { project: "projects" },
  );

  const { data: celebrationData } = checkCelebration(
    ["checkCelebration", bucket, iterationId],
    {
      params: {
        iteration: iterationId,
      },
    },
  );

  const { stories, meta } = data || {};

  const isFridayOrLater = moment().weekday() > 5;

  const shouldCelebrate =
    (celebrationData?.should_celebrate && isFridayOrLater) || false;

  const columns: ColumnDef<Story>[] = [
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
        <div className="text-sm">{formatId(row.original.id || "-")}</div>
      ),
    },
    {
      accessorKey: "project",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.original.project?.name || "-"}</div>
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
        <div className="text-sm">{row.original.name || "-"}</div>
      ),
    },
    {
      accessorKey: "total_estimate_time",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Est. Time
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.original.total_estimate_time || "-"}</div>
      ),
    },
    {
      accessorKey: "attributes",
      header: () => <div className="text-center px-4">Attributes</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-2">
          <Tooltip>
            <TooltipTrigger>
              <Icon
                name="flag-triangle-right"
                color={`${row.original.priority === "high" ? "danger" : row.original.priority === "normal" ? "blue" : "gray"}`}
                className="shrink-0"
              />
            </TooltipTrigger>
            <TooltipContent>
              {`${row.original.priority === "high" ? "High Priority" : row.original.priority === "normal" ? "Normal Priority" : "Low Priority"}`}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Icon
                name="flaskConical"
                color={`${row.original.is_rnd ? "fuchsia" : "gray-light"}`}
                className="shrink-0"
              />
            </TooltipTrigger>
            <TooltipContent>
              {`${row.original.is_rnd ? "R&D Task" : "Not R&D"}`}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Icon
                name={`${row.original.is_multi ? "users" : "user"}`}
                color={`${row.original.is_multi ? "cyan" : "gray-light"}`}
                className="shrink-0"
              />
            </TooltipTrigger>
            <TooltipContent>
              {`${row.original.is_multi ? "Team" : "Solo"}`}
            </TooltipContent>
          </Tooltip>
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
              StoryStatusOption.get(row.original.status || "")?.chipVariant
            }
          >
            {StoryStatusOption.get(row.original.status || "")?.chipTextVariant}
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
    data: stories ?? [],
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
            columns={6}
            headerLabels={[
              "ID",
              "Project",
              "Name",
              "Est. Time",
              "Attributes",
              "Status",
            ]}
            cellHeight="h-4"
          />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load stories"
        message="We couldn't load the stories data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            {shouldCelebrate ? (
              <CelebrationMessage variant="empty" className="py-12" />
            ) : (
              <>
                <div className="text-gray-400 mb-4">
                  <FileText className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No stories found
                </h3>
                <p className="text-gray-500">
                  {bucket === StoryMode.COMPLETED
                    ? "No completed stories yet"
                    : "Get started by creating a new story"}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
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
                              navigateToStory(cell.row.original);
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

      {shouldCelebrate && (
        <CelebrationMessage variant="banner" className="mt-4" />
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex flex-1 items-center gap-4 text-sm">
          {meta?.total_results} total
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
            currentPage={meta?.page}
            totalPages={meta?.total_pages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default StoryboardListView;
