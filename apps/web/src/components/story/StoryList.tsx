import { useEffect, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { listStories, useEditStory } from "@ttm/api";

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
import { StoryStatusOption } from "@ttm/api/types/models/story";
import { Badge } from "../ui/Badge";
import { Story } from "@ttm/api/types/models/story";
import { formatId } from "@ttm/utils";
import { Server, ServerOff, Clipboard } from "lucide-react";
import { toast } from "sonner";

interface StoryListProps {
  iterationId: string;
  user_id?: number;
}

const StoryList = ({ iterationId, user_id }: StoryListProps) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const navigateToStory = (row: any) => {
    navigate({
      to: "/story/$storyId",
      params: { storyId: row?.id },
    });
  };

  const queryKey = [
    "list-of-stories",
    page.toString(),
    sortingColumn,
    iterationId,
    user_id ? user_id.toString() : "",
  ];

  const { data, isLoading, isError, refetch } = listStories(
    queryKey,
    {
      page: page,
      per_page: 50,
      sort: [sortingColumn],
      params: {
        ...(user_id && { user_id: user_id }),
      },
      filter: {
        iteration: iterationId,
      },
      include: ["project.*"],
    },
    { project: "projects" },
  );

  const { stories, meta } = data || {};

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
    // {
    //   id: "actions",
    //   header: () => <Button variant="ghost">Actions</Button>,
    //   cell: ({ row }) => (
    //     <div className="flex flex-row gap-6 justify-start">
    //       <Button
    //         variant="blank"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           setShowEditDialog(true);
    //           setTagId(row.original.id ?? "");
    //         }}
    //         className="p-0"
    //       >
    //         <Icon name="pen" color="gray" size="md" />
    //       </Button>
    //       <Button
    //         variant="blank"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           setShowDeleteDialog(true);
    //           setTagId(row.original.id ?? "");
    //         }}
    //         className="p-0"
    //       >
    //         <Icon name="trash-2" color="danger" size="md" />
    //       </Button>
    //     </div>
    //   ),
    //   size: 100,
    // },
    {
      accessorKey: "actions",
      header: () => <div className="text-center px-4">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            {row.original.status !== "completed" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                title="No deployment needed"
                disabled
              >
                <ServerOff className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
                No Need Deploy
              </Button>
            )}
            {row.original.status === "completed" &&
              (row.original.is_needed_to_deploy ? (
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
              ))}
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
        );
      },
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
            columns={4}
            headerLabels={["ID", "Project", "Name", "Status"]}
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

export default StoryList;
