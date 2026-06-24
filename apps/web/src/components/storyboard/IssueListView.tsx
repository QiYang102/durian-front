import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { listTasks, useToggleTaskIssue } from "@ttm/api";
import { TaskStatus } from "@ttm/api/types/enums";

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
import { Task } from "@ttm/api/types/models/task";
import { formatId } from "@ttm/utils";
import { Pencil, CheckCircle, FileText, MoveRight } from "lucide-react";
import EditBugsTaskDialog from "./EditBugsTaskDialog";
import { toast, toast as toastShadcn } from "sonner";

interface IssueListViewProps {
  iterationId: string;
  user_id?: number;
}

const IssueListView = ({ iterationId, user_id }: IssueListViewProps) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditUser = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleNavigateToStory = (task: Task) => {
    const storyId =
      typeof task.story === "object" ? task.story?.id : task.story;

    if (!storyId) {
      toast.error("Story not found");

      return;
    }

    navigate({
      to: "/story/$storyId",
      params: { storyId: String(storyId) },
    });
  };

  const { data, isLoading, isError, refetch } = listTasks(
    [
      "list-of-bug-tasks",
      page.toString(),
      sortingColumn,
      iterationId,
      user_id ? user_id.toString() : "",
    ],
    {
      page: page,
      per_page: 10,
      sort: [sortingColumn],
      filter: {
        is_bug: "true",
        ...(user_id && { user: user_id.toString() }),
      },
      params: {
        iteration_id: iterationId,
      },
      include: ["story.project.*", "user.*"],
    },
    {
      story: "stories",
      user: "users",
      project: "projects",
    },
  );

  const editStory = useToggleTaskIssue();

  const handleToggleIssue = (task: Task) => {
    if (!task.id) {
      toast.error("Task not found");

      return;
    }

    const isCompleting = task.status !== TaskStatus.STATUS_COMPLETE;

    toastShadcn.promise(
      editStory.mutateAsync({
        taskId: task.id,
      }),
      {
        loading: isCompleting
          ? "Marking task as complete..."
          : "Marking task as incomplete...",
        success: isCompleting
          ? "Task marked as complete"
          : "Task marked as incomplete",
        error: "Failed to update task status",
      },
    );
  };

  const { tasks, meta } = data || {};

  const columns: ColumnDef<Task>[] = [
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
      header: () => <div className="px-4">Project</div>,
      cell: ({ row }) => (
        <div className="text-sm">
          {(row.original as any).story?.project?.name || "-"}
        </div>
      ),
    },
    {
      accessorKey: "task_description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Description
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm max-w-md truncate">
          {row.original.description || "-"}
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: () => <div className="px-4">User</div>,
      cell: ({ row }) => (
        <div className="text-sm">
          {(row.original as any).user?.fullname || "-"}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="px-4">Action</div>,
      cell: ({ row }) => (
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditUser(row.original)}
            className="text-sm h-8 px-2 text-blue-600 hover:bg-blue-50 justify-start"
          >
            <Pencil className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleIssue(row.original)}
            disabled={editStory.isPending}
            className={`text-sm h-8 px-2 justify-start ${
              row.original.status === TaskStatus.STATUS_COMPLETE
                ? "text-green-600 hover:bg-green-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            {row.original.status === TaskStatus.STATUS_COMPLETE
              ? "Complete"
              : "Do"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigateToStory(row.original)}
            className="text-sm h-8 px-2 text-purple-600 hover:bg-purple-50 justify-start"
          >
            <MoveRight className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>To Story</span>
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
    data: tasks ?? [],
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
            rows={10}
            columns={6}
            headerLabels={[
              "ID",
              "Project",
              "Story",
              "Task Description",
              "User",
              "Action",
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
        title="Failed to load issues"
        message="We couldn't load the bug tasks. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No issues found
            </h3>
            <p className="text-gray-500">
              No bug tasks found for this iteration
            </p>
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
          {meta?.total_results} total issues
        </div>
        <div className="space-x-2">
          <Pagination
            currentPage={meta?.page}
            totalPages={meta?.total_pages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
      {editingTask && (
        <EditBugsTaskDialog
          isOpen={isEditDialogOpen}
          onClose={handleCloseDialog}
          task={editingTask}
        />
      )}
    </>
  );
};

export default IssueListView;
