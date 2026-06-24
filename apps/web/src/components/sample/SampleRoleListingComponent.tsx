import { useEffect, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Role } from "@ttm/api/types/models/role";

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
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { toast } from "../ui/UseToast";
import { Card, CardContent } from "../ui/Card";
import ErrorDisplay from "../ui/ErrorDisplay";
import TableSkeleton from "../ui/TableSkeleton";
import { useListRole, useSampleDeleteRole } from "@ttm/api";

interface SampleRoleListingComponentProps {
  searchValue?: string;
}

const SampleRoleListingComponent = ({
  searchValue,
}: SampleRoleListingComponentProps) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [sortingColumn, setSortingColumn] = useState("-created_at");
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const navigateToRole = (row: any) => {
    navigate({
      to: "/sample/$roleId",
      params: { roleId: row?.id },
    });
  };

  const queryKey = ["roles", page.toString(), sortingColumn, searchValue || ""];

  const { data, isLoading, isFetching, isError, refetch } = useListRole(
    queryKey,
    {
      sort: [sortingColumn],
      page: page,
      per_page: 10,
      search: searchValue ? searchValue.trim() : "",
      include: ["is_active.*"],
    },
  );

  const { roles, meta } = data || {};

  const deleteRole = useSampleDeleteRole({
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
              column.toggleSorting(column.getIsSorted() === "asc");
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
            onClick={() => {
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

  // Reset page to 1 when search value changes
  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const table = useReactTable({
    data: roles ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: false,
    state: {
      sorting,
    },
    sortingFns: {
      asc: (a, b) => {
        console.log(a.original.id - b.original.id);
        return a.original.id - b.original.id;
      },
      desc: (a, b) => {
        console.log(b.original.id - a.original.id);
        return b.original.id - a.original.id;
      },
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
        onRetry={refetch}
        retryText="Reload Data"
      />
    );
  }

  return (
    <Card>
      <CardContent>
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
                  {!isLoading && table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.row.original.id}
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
              onPageChange={(page) => setPage(page)}
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
        ></ConfirmDialog>
      </CardContent>
    </Card>
  );
};

export default SampleRoleListingComponent;
