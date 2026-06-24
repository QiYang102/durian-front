import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@ttm/api/types/models/user";
import { listUsers } from "@ttm/api/modules/user";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import ErrorDisplay from "../ui/ErrorDisplay";
("");
import TableSkeleton from "@/components/ui/TableSkeleton";

const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
};

const UserList = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const { data, isLoading, isFetching, isError, refetch } = listUsers(
    [page.toString(), sortingColumn],
    {
      sort: [sortingColumn],
      page: page,
      per_page: 10,
    },
    {},
  );

  const { users, meta } = data || {};

  const navigateToUser = (user: User) => {
    navigate({
      to: "/user/$userId",
      params: { userId: user.id.toString() },
    });
  };

  const updateURL = useCallback(
    (currentPage: number) => {
      if (currentPage > 1) {
        navigate({
          to: "/user",
          search: { page: currentPage },
          replace: true,
        });
      } else {
        navigate({
          to: "/user",
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

  const getRoleBadgeColor = (role: string) => {
    const roleLower = role?.toLowerCase();
    if (roleLower === "admin") {
      return "blue";
    }
    if (roleLower === "member") {
      return "green";
    }
    return "default";
  };

  const columns: ColumnDef<User>[] = [
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
                "h-auto p-0 font-semibold justify-start w-full",
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
      accessorKey: "fullname",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="min-w-[150px]">
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
              Full Name
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-[150px] text-left">
          {row.getValue("fullname") ? (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigateToUser(row.original);
              }}
              className="h-auto p-0 text-info-500"
            >
              {row.getValue("fullname")}
            </Button>
          ) : (
            "-"
          )}
        </div>
      ),
      enableSorting: true,
      minSize: 150,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="min-w-[200px]">
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
              Email
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-[200px] text-left">
          {row.getValue("email") || "-"}
        </div>
      ),
      enableSorting: true,
      minSize: 200,
    },
    {
      accessorKey: "mobile_number",
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
              Mobile
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-32 text-left">
          {row.getValue("mobile_number") || "-"}
        </div>
      ),
      enableSorting: true,
      size: 130,
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="w-28">
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
              Role
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <div className="flex justify-start items-center">
            {role ? (
              <Badge
                color={getRoleBadgeColor(role)}
                className="w-20 flex justify-center -ml-1"
              >
                {role}
              </Badge>
            ) : (
              "-"
            )}
          </div>
        );
      },
      enableSorting: true,
      size: 120,
    },
  ];

  const table = useReactTable({
    data: users ?? [],
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
          headerLabels={["ID", "Full Name", "Email", "Mobile", "Role"]}
          cellHeight="h-6"
        />
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Users"
          message="We encountered an error while loading the user. Please try again."
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
                  <TableHead key={header.id} className="text-left px-4">
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
                  onClick={() => navigateToUser(row.original)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left px-4">
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

  return renderTableContent();
};

export default UserList;
