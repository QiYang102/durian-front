import { useEffect, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { listTeamMembers, useDeleteTeamMember } from "@ttm/api";

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
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/Card";
import TableSkeleton from "@/components/ui/TableSkeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { TeamMember } from "@ttm/api/types/models/team-member";
import { Separator } from "@/components/ui/Separator";
import { Text } from "@/components/ui/Text";

interface TeamMemberListProps {
  teamId: string;
}

const TeamMemberList = ({ teamId }: TeamMemberListProps) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");

  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false);
  const [teamMemberToDelete, setTeamMemberToDelete] = useState<number | null>(
    null,
  );

  const navigateToUser = (member: TeamMember) => {
    if (!member.user?.id) return;
    navigate({
      to: "/user/$userId",
      params: { userId: member.user?.id?.toString() },
    });
  };

  const queryKey = ["team-members", page.toString(), sortingColumn, teamId];

  const { data, isLoading, isError, refetch } = listTeamMembers(
    queryKey,
    {
      page: page,
      per_page: 5,
      sort: [sortingColumn],
      filter: { team: teamId },
      include: ["is_active.*", "user.*"],
    },
    { user: "users" },
  );

  const { teamMembers, meta } = data || {};

  const deleteTeamMember = useDeleteTeamMember({
    onSuccess: () => {
      toast.success("Team Member has been deleted successfully");

      setConfirmDialogOpened(false);
      setTeamMemberToDelete(null);
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete team member. Please try again.");

      setConfirmDialogOpened(false);
      setTeamMemberToDelete(null);
    },
  });

  const handleDeleteTeamMember = () => {
    if (!teamMemberToDelete) return;

    setConfirmDialogOpened(false);
    setTeamMemberToDelete(null);

    deleteTeamMember.mutate(teamMemberToDelete);
  };

  const columns: ColumnDef<TeamMember>[] = [
    {
      id: "user.fullname",
      accessorKey: "user.fullname",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.original.user?.fullname || "-"}</div>
      ),
    },
    {
      id: "user.email",
      accessorKey: "user.email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-2 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <Icon
            className="h-4 w-4 shrink-0"
            name="arrow-down-up"
            color="gray"
          />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.original.user?.email || "-"}</div>
      ),
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
              if (deleteTeamMember.isPending) return;
              setTeamMemberToDelete(row.original.id || null);
              setConfirmDialogOpened(true);
            }}
            disabled={deleteTeamMember.isPending}
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

  const table = useReactTable({
    data: teamMembers ?? [],
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

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <TableSkeleton
            rows={10}
            columns={3}
            headerLabels={["Full Name", "Email", "Action"]}
            cellHeight="h-4"
          />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load team members"
        message="We couldn't load the team members data. Please check your connection and try again."
        onRetry={() => {
          refetch();
        }}
        retryText="Reload Data"
      />
    );
  }

  return (
    <Card>
      <CardContent className="overflow-x-auto space-y-6">
        <div className="space-y-1">
          <Text variant="h3">Team Members</Text>
          <Separator />
        </div>
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
                              if (cell.column.id === "fullname") {
                                navigateToUser(cell.row.original);
                              }
                            }}
                            className={
                              cell.column.id === "fullname"
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
            setTeamMemberToDelete(null);
          }}
          onConfirm={() => {
            handleDeleteTeamMember();
          }}
          title="Confirm Deletion"
          content="Are you sure you want to delete this team member?"
          confirmText="Yes"
          cancelText="No"
        />
      </CardContent>
    </Card>
  );
};

export default TeamMemberList;
