import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { checkCelebration, listStories, useEditStory } from "@ttm/api";

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
import { toast } from "sonner";
import { Story } from "@ttm/api/types/models/story";
import { formatId } from "@ttm/utils";
import { StoryMode, StoryStatus } from "@ttm/api/types/enums";
import { FileText, Server, ServerOff, Clipboard } from "lucide-react";
import CelebrationMessage from "./CelebrationMessage";
import moment from "moment";

interface TodayCompletedListViewProps {
  iterationId: string;
}

const TodayCompletedListView = ({
  iterationId,
}: TodayCompletedListViewProps) => {
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

  const editStory = useEditStory({
    onSuccess: () => {
      toast.success("Deployment status has been updated successfully");

      refetch();
    },
    onError: () => {
      toast.error("Failed to update deployment status. Please try again.");
    },
  });

  const handleToggleDeploy = (
    e: React.MouseEvent,
    storyId: number,
    currentStatus: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    editStory.mutate({
      id: storyId.toString(),
      is_needed_to_deploy: !currentStatus,
    });
  };

  const handleCreateSubStory = (e: React.MouseEvent, storyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({
      to: "/story-drafted/new",
      search: { parent_story: storyId.toString() },
    });
  };

  const { data, isLoading, isError, refetch } = listStories(
    [
      "list-of-completed-today-stories",
      page.toString(),
      perPage.toString(),
      sortingColumn,
      iterationId,
    ],
    {
      page: page,
      per_page: 20,
      sort: [sortingColumn],
      filter: {
        iteration: iterationId,
        "completed_at.gte": moment().startOf("day").toISOString(),
      },
      in: {
        status: [StoryStatus.COMPLETED],
      },
      include: ["project.*"],
    },
    { project: "projects" },
  );

  const { data: celebrationData } = checkCelebration(
    ["checkCelebration", StoryMode.COMPLETED, iterationId],
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
      accessorKey: "actions",
      header: () => <div className="text-center px-4">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {row.original.is_needed_to_deploy ? (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs font-medium text-green-700 hover:bg-green-50"
              onClick={(e) =>
                handleToggleDeploy(
                  e,
                  row.original.id,
                  row.original.is_needed_to_deploy || false,
                )
              }
              title="Deployment needed"
            >
              <Server className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
              Needed Deploy
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
              onClick={(e) =>
                handleToggleDeploy(
                  e,
                  row.original.id,
                  row.original.is_needed_to_deploy || false,
                )
              }
              title="No deployment needed"
            >
              <ServerOff className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
              No Need Deploy
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
            onClick={(e) => handleCreateSubStory(e, row.original.id)}
            title="Create sub-story"
          >
            <Clipboard className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
            Create Story
          </Button>
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
              "Actions",
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
    return null;
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Completed Recently</h2>
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
      <hr className="mt-4" />
    </>
  );
};

export default TodayCompletedListView;
