import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FileText } from "lucide-react";

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
import { Badge } from "@/components/ui/Badge";
import { formatId } from "@ttm/utils";
import { Story, StoryStatusOption } from "@ttm/api/types/models/story";
import { TagReport } from "@ttm/api/types/models/story-tag";

export default function TagStoryList({
  result,
}: {
  result: TagReport | undefined;
}) {
  const stories = result?.stories;
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);

  const navigateToStory = (row: Story) => {
    navigate({
      to: "/story/$storyId",
      params: { storyId: row.id.toString() },
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
      cell: ({ row }) => {
        const statusOption = StoryStatusOption.get(row.original.status || "");
        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <Badge
              className="truncate"
              color={statusOption?.chipVariant || "default"}
            >
              {statusOption?.chipTextVariant || row.original.status}
            </Badge>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: stories ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (!stories || stories.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No stories found
            </h3>
            <p className="text-gray-500">
              There are no stories associated with this tag yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigateToStory(row.original)}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
