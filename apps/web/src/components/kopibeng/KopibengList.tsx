import { useListKopibeng } from "@ttm/api";
import TableSkeleton from "../ui/TableSkeleton";
import ErrorDisplay from "../ui/ErrorDisplay";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, CoffeeIcon } from "lucide-react";
import { Kopibeng } from "@ttm/api/types/models/kopibeng";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "../ui/Table";
import { useNavigate } from "@tanstack/react-router";
import { Pagination } from "../Pagination";

const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
};

export default function KopibengList() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-status");
  const [page, setPage] = useState(1);

  // Detail navigation
  const navigateToKopibeng = (kopibeng: Kopibeng) => {
    navigate({
      to: "/kopibeng/$kopibengId",
      params: { kopibengId: kopibeng.id ? kopibeng.id.toString() : "" },
    });
  };

  // Query List
  const queryKey = ["kopibengs", sortingColumn, page.toString()];
  const { data, isLoading, isFetching, isError, refetch } = useListKopibeng(
    queryKey,
    {
      sort: [sortingColumn],
      per_page: 10,
      page: page,
      include: ["member_name.*"],
    },
    {
      member_name: "users",
    },
  );
  const { kopibengs, meta } = data || {};

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Set the sorting
  useEffect(() => {
    if (sorting && sorting.length > 0) {
      const sortingField = sorting[0];
      const value =
        sortingField.desc === false ? sortingField.id : `-${sortingField.id}`;
      setSortingColumn(value);
    }
  }, [sorting]);

  // Column setup
  const columns: ColumnDef<Kopibeng>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(isSorted === "asc")}
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
        return <div className="text-left">{row.getValue("id") || "-"}</div>;
      },
      enableSorting: true,
      size: 150,
    },
    {
      // This is special to let the table sort the FK fullname
      id: "member_name.fullname",
      accessorKey: "member_name.fullname",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(isSorted === "asc")}
              className={cn(
                "h-auto p-0 font-semibold justify-start w-full",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Kopi Buyer
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left">
            {row.original.member_name?.fullname ? (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToKopibeng(row.original);
                }}
                className="h-auto p-0 text-info-500"
              >
                {row.original.member_name?.fullname}
              </Button>
            ) : (
              "-"
            )}
          </div>
        );
      },
      enableSorting: true,
      size: 230,
    },
    {
      accessorKey: "remark",
      header: () => {
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              className={
                "h-auto p-0 font-semibold justify-start w-full text-gray-900 hover:text-blue-500"
              }
            >
              Remark
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left truncate whitespace-nowrap overflow-hidden max-w-[250px]">
            {row.getValue("remark") || "-"}
          </div>
        );
      },
      enableSorting: true,
      size: 250,
    },
    {
      accessorKey: "create_date",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(isSorted === "asc")}
              className={cn(
                "h-auto p-0 font-semibold justify-start w-full",
                isSorted === "asc" || isSorted === "desc"
                  ? "text-blue-500 hover:text-blue-500"
                  : "text-gray-900 hover:text-blue-500",
              )}
            >
              Create Date
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left">{row.getValue("create_date") || "-"}</div>
        );
      },
      enableSorting: true,
      size: 160,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(isSorted === "asc")}
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
        const statusOwning = row.getValue("status") === "owing";

        return (
          <>
            {statusOwning ? (
              <div className="flex flex-row items-center max-w-28 gap-3 bg-amber-200 px-3 py-2 rounded-xl border border-amber-300 shadow-sm text-amber-800">
                <CoffeeIcon className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Owing</span>
              </div>
            ) : (
              <div className="flex flex-row items-center max-w-28  gap-3 bg-lime-100 px-3 py-2 rounded-xl border border-lime-300 shadow-sm text-lime-800">
                <CoffeeIcon className="w-5 h-5 text-lime-700" />

                <span className="font-semibold">Served</span>
              </div>
            )}
          </>
        );
      },
      enableSorting: true,
      size: 150,
    },
  ];

  // Table setup
  const table = useReactTable({
    data: kopibengs ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    state: {
      sorting,
    },
  });

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <TableSkeleton
          rows={7}
          columns={4}
          headerLabels={["ID", "Kopi Buyer", "Create Date", "Status"]}
          cellHeight="h-6"
        />
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Kopibeng"
          message="We encountered an error while loading the kopibeng. Please try again."
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => navigateToKopibeng(row.original)}
                      className="text-left px-4"
                      style={{ width: cell.column.getSize() }}
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
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {meta && (
          <div className="flex flex-row items-center justify-between px-3">
            <div className="text-muted-foreground text-sm">
              {meta?.total_results} total
            </div>
            <div>
              <Pagination
                currentPage={meta?.page}
                totalPages={meta?.total_pages}
                onPageChange={(page) => {
                  handlePageChange(page);
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  return renderContent();
}
