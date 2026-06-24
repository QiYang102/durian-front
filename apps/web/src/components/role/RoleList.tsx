import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Role } from "@ttm/api/types/models/role";
import { useDeleteRole, useListRole } from "@ttm/api";

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
import { toast } from "@/components/ui/UseToast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/Card";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { trackEvent } from "@/lib/analytics";
import { RoleEvents } from "@ttm/api/types/tracker";

interface RoleListProps {
  search: string;
  page: number;
  sort: string;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
}

const RoleList = ({
  search,
  page,
  sort,
  onPageChange,
  onSortChange,
}: RoleListProps) => {
  const navigate = useNavigate();
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const navigateToRole = (row: any) => {
    trackEvent(RoleEvents.ROLE_CLICKED);

    navigate({
      to: "/role/$roleId",
      params: { roleId: row?.id },
    });
  };

  const queryKey = ["roles", search, page.toString(), sort];

  const { data, isLoading, isFetching, isError, refetch } = useListRole(
    queryKey,
    {
      search,
      sort: [sort],
      page: page,
      per_page: 10,
      filter: {},
      include: ["is_active.*"],
    },
  );
  const { roles, meta } = data || {};

  const deleteRole = useDeleteRole({
    onSuccess: () => {
      toast({
        title: "Role deleted successfully",
        description: "The role has been deleted.",
      });
      setConfirmDialogOpened(false);
      setRoleToDelete(null);
      refetch();
    },
    onError: () => {
      toast({
        title: "Failed to delete role",
        description: "An error occurred while deleting the role.",
        variant: "destructive",
      });
      setConfirmDialogOpened(false);
      setRoleToDelete(null);
    },
  });

  const handleDeleteRole = () => {
    if (!roleToDelete) return;

    setConfirmDialogOpened(false);
    setRoleToDelete(null);

    deleteRole.mutate(roleToDelete);
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              onSortChange(column.getIsSorted() === "asc" ? "-name" : "name");
            }}
          >
            Name
            <Icon
              className="ml-2 h-4 w-4"
              name={"arrow-down-up"}
              color="gray"
            />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name") || "-"}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "is_active",
      header: ({}) => {
        return <Button variant="ghost">Action</Button>;
      },
      cell: ({ row }) => (
        <div>
          <Button
            variant="blank"
            trackEventName={RoleEvents.ROLE_DELETED_INITIATED}
            onClick={() => {
              if (deleteRole.isPending) return;
              setRoleToDelete(row.original.id || "");
              setConfirmDialogOpened(true);
            }}
            disabled={deleteRole.isPending}
          >
            <Icon name="trash-2" color="danger" size="md" />
          </Button>
        </div>
      ),
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data: roles ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting: [
        {
          id: sort.startsWith("-") ? sort.substring(1) : sort,
          desc: sort.startsWith("-"),
        },
      ],
    },
  });

  if (isLoading || isFetching) {
    return (
      <Card>
        <CardContent>
          <TableSkeleton
            rows={10}
            columns={2}
            headerLabels={["Name", "Action"]}
            cellHeight="h-4"
          />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load roles"
        message="We couldn't load the roles data. Please check your connection and try again."
        onRetry={() => {
          trackEvent(RoleEvents.ROLE_LIST_RETRY);
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
                                navigateToRole(cell.row.original);
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
              onPageChange={(page) => onPageChange(page)}
            />
          </div>
        </div>

        <ConfirmDialog
          isOpen={confirmDialogOpened}
          onClose={() => {
            setConfirmDialogOpened(false);
            setRoleToDelete(null);
          }}
          onConfirm={() => {
            handleDeleteRole();
          }}
          title="Confirm Deletion"
          content="Are you sure you want to delete this role?"
          confirmText="Yes"
          cancelText="No"
          confirmTrackEventName={RoleEvents.ROLE_DELETED_CONFIRMED}
          cancelTrackEventName={RoleEvents.ROLE_DELETED_CANCELLED}
        />
      </CardContent>
    </Card>
  );
};

export default RoleList;
