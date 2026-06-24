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
import { Announcement } from "@ttm/api/types/models/announcement";
import { listAnnouncements } from "@ttm/api/modules/announcement";
import { formatDateTime } from "@ttm/utils";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
};

const AnnouncementList = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const { data, isLoading, isFetching, isError, refetch } = listAnnouncements(
    [page.toString(), sortingColumn],
    {
      sort: [sortingColumn],
      page: page,
      per_page: 10,
      filter: { is_active: "true" },
    },
    {},
  );

  const { announcements, meta } = data || {};

  const navigateToAnnouncement = (announcement: Announcement) => {
    navigate({
      to: "/announcement/$announcementId",
      params: { announcementId: announcement.id.toString() },
    });
  };

  const updateURL = useCallback(
    (currentPage: number) => {
      if (currentPage > 1) {
        navigate({
          to: "/announcement",
          search: { page: currentPage },
          replace: true,
        });
      } else {
        navigate({
          to: "/announcement",
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

  const getStatusBadgeColor = (isLive: boolean) => {
    return isLive ? "success" : "danger";
  };

  const columns: ColumnDef<Announcement>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="min-w-28">
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
              Name
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-28 text-left">{row.getValue("name") || "-"}</div>
      ),
      enableSorting: true,
      minSize: 200,
    },
    {
      accessorKey: "start_date",
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
              Start Date
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-40 text-left">
          {formatDateTime(row.getValue("start_date"))}
        </div>
      ),
      enableSorting: true,
      size: 130,
    },
    {
      accessorKey: "end_date",
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
              End Date
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="w-40 text-left">
          {formatDateTime(row.getValue("end_date"))}
        </div>
      ),
      enableSorting: true,
      size: 130,
    },
    {
      accessorKey: "is_live",
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
              Status
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const isLive = row.getValue("is_live") as boolean;
        return (
          <div className="flex justify-start items-center">
            <Badge
              color={getStatusBadgeColor(isLive)}
              className="w-20 flex justify-center -ml-1"
            >
              {isLive ? "Live" : "Inactive"}
            </Badge>
          </div>
        );
      },
      enableSorting: true,
      size: 120,
    },
  ];

  const table = useReactTable({
    data: announcements ?? [],
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
          headerLabels={["ID", "Name", "Start Date", "End Date", "Status"]}
          cellHeight="h-6"
        />
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Announcements"
          message="We encountered an error while loading the announcements. Please try again."
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
                  onClick={() => navigateToAnnouncement(row.original)}
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

export default AnnouncementList;
