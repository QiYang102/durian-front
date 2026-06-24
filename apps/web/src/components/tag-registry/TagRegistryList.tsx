import {
  useDeleteTag,
  useEditTag,
  useGetSingleTag,
  useListTag,
} from "@ttm/api";
import { Card, CardContent } from "../ui/Card";
import { useNavigate } from "@tanstack/react-router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { StoryTag } from "@ttm/api/types/models/story-tag";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "../ui/Badge";
import TableSkeleton from "../ui/TableSkeleton";
import ErrorDisplay from "../ui/ErrorDisplay";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import { Pagination } from "../Pagination";
import { Icon } from "../ui/Icon";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { CustomDialog } from "../ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import TagForm from "../tag/TagForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loading } from "../ui/Loading";

const COLOR_MAP = {
  success: "bg-green-100 border-green-600",
  warning: "bg-yellow-100 border-yellow-600",
  danger: "bg-red-100 border-red-600",
  info: "bg-blue-100 border-blue-600",
  default: "bg-slate-100 border-slate-600",
  muted: "bg-slate-500 border-slate-600",
  black: "bg-black border-slate-600",
  white: "bg-white border-slate-600",

  orange: "bg-warning-100 border-warning-600",
  blue: "bg-blue-100 border-blue-600",
  yellow: "bg-yellow-100 border-yellow-600",
  green: "bg-green-100 border-green-600",
  red: "bg-red-100 border-red-600",
  gray: "bg-gray-100 border-gray-600",
  purple: "bg-purple-100 border-purple-600",

  pink: "bg-pink-100 border-pink-600",
  indigo: "bg-indigo-100 border-indigo-600",
  teal: "bg-teal-100 border-teal-600",
  cyan: "bg-cyan-100 border-cyan-600",
  lime: "bg-lime-100 border-lime-600",
  emerald: "bg-emerald-100 border-emerald-600",
  sky: "bg-sky-100 border-sky-600",
  violet: "bg-violet-100 border-violet-600",
  fuchsia: "bg-fuchsia-100 border-fuchsia-600",
  rose: "bg-rose-100 border-rose-600",
  amber: "bg-amber-100 border-amber-600",
  slate: "bg-slate-100 border-slate-600",
};

const getSortIcon = (isSorted: false | "asc" | "desc") => {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  }
  return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
};

interface TagRegistryListProps {
  searchParams: {
    name?: string;
    project?: number;
  };
  teamId: string | null;
}

const schema = z.object({
  name: z.string().min(1, ""),
  color: z.string().min(1, ""),
});

type TagFormSchema = z.infer<typeof schema>;

export default function TagRegistryList({
  searchParams,
  teamId,
}: TagRegistryListProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingColumn, setSortingColumn] = useState("-id");
  const [page, setPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [tagId, setTagId] = useState(0);

  const form = useForm<TagFormSchema>({
    defaultValues: {
      name: "",
      color: "info",
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit, formState, reset } = form;
  const { isDirty } = formState;

  const tagDataQueryKey = ["tag", tagId.toString()];
  const {
    data: tagData,
    isLoading: tagDataIsLoading,
    isError: tagDataIsError,
    refetch: tagDataRefetch,
    isFetching: tagDataIsFetching,
  } = useGetSingleTag(tagDataQueryKey, tagId, {}, {}, { enabled: !!tagId });

  const tag = tagData?.tag;

  useEffect(() => {
    if (!tag) return;

    reset({
      name: tag?.name,
      color: tag?.color,
    });
  }, [tag, reset]);

  const { mutate: editTagDetail, isPending: isUpdating } = useEditTag({
    onSuccess: () => {
      toast.success("Tag have been successfully updated");
      setShowEditDialog(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(
        error.data.error || "Failed to update tag. Please try again.",
      );
    },
  });

  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTag({
    onSuccess: () => {
      toast.success("Tag has been deleted successfully");
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast.error("Failed to delete kopibeng. Please try again.");
    },
  });

  const handleEdit = (data: TagFormSchema) => {
    editTagDetail({
      ...data,
      id: tagId,
    });
  };

  const handleOnDelete = () => {
    deleteTag(tagId);
  };

  const navigateToTag = (tag: StoryTag) => {
    navigate({
      to: "/tag-registry/$tagId",
      params: { tagId: tag.id ? tag.id.toString() : "" },
    });
  };

  const queryKey = [
    "tags",
    sortingColumn,
    page.toString(),
    searchParams.name ?? "",
    searchParams.project?.toString() ?? "",
    teamId ?? "",
  ];
  const { data, isLoading, isFetching, isError, refetch } = useListTag(
    queryKey,
    {
      sort: [sortingColumn],
      page: page,
      per_page: 10,
      filter: {
        ["name.icontains"]: searchParams.name ?? "",
        project: searchParams.project?.toString() ?? "",
        team: teamId ?? "",
      },
      include: ["project.*"],
    },
    { project: "projects" },
  );

  const { tags, meta } = data || {};

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (sorting && sorting.length > 0) {
      const sortingField = sorting[0];
      const value =
        sortingField.desc === false ? sortingField.id : `-${sortingField.id}`;
      setSortingColumn(value);
    }
  }, [sorting]);

  // Column setup
  const columns: ColumnDef<StoryTag>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              onClick={() => {
                column.toggleSorting(isSorted === "asc");
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
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigateToTag(row.original);
            }}
            className="h-auto p-0 text-info-500"
          >
            {row.getValue("id") || "-"}
          </Button>
        );
      },
      enableSorting: true,
      size: 100,
    },
    {
      accessorKey: "name",
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
              Name
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigateToTag(row.original);
              }}
              className="h-auto p-0 text-info-500"
            >
              <Badge color={row.original.color} className="max-w-fit">
                {row.getValue("name") || "-"}
              </Badge>
            </Button>
          </div>
        );
      },
      enableSorting: true,
      size: 100,
    },
    {
      id: "project.name",
      accessorKey: "project.name",
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
              Project Name
              {getSortIcon(isSorted)}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left">{row.original.project.name || "-"}</div>
        );
      },
      enableSorting: true,
      size: 200,
    },
    {
      accessorKey: "color",
      header: () => {
        return (
          <div className="p-4">
            <Button
              variant="ghost"
              className={
                "h-auto p-0 font-semibold justify-start w-full text-gray-900 hover:text-blue-500"
              }
            >
              Color
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left truncate whitespace-nowrap overflow-hidden max-w-[250px]">
            <div className="flex flex-row items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full border ${COLOR_MAP[row.original.color]}`}
              ></div>
              {row.getValue("color") || "-"}
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <Button variant="ghost">Actions</Button>,
      cell: ({ row }) => (
        <div className="flex flex-row gap-6 justify-start">
          <Button
            variant="blank"
            onClick={(e) => {
              e.stopPropagation();
              setShowEditDialog(true);
              setTagId(row.original.id ?? "");
            }}
            className="p-0"
          >
            <Icon name="pen" color="gray" size="md" />
          </Button>
          <Button
            variant="blank"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
              setTagId(row.original.id ?? "");
            }}
            className="p-0"
          >
            <Icon name="trash-2" color="danger" size="md" />
          </Button>
        </div>
      ),
      size: 100,
    },
  ];

  // Table setup
  const table = useReactTable({
    data: tags ?? [],
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
          rows={10}
          columns={5}
          headerLabels={["ID", "Name", "Project", "Color", "Actions"]}
          cellHeight="h-6"
        />
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Error Loading Tag"
          message="We encountered an error while loading the tag. Please try again."
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
                      onClick={() => navigateToTag(row.original)}
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

  const renderFormContent = () => {
    if (tagDataIsLoading || tagDataIsFetching) {
      return (
        <Card className="flex flex-col flex-1 min-h-[200px] justify-center">
          <CardContent className="flex items-center justify-center">
            <Loading size="xl" showText text="Loading tag details..." />
          </CardContent>
        </Card>
      );
    }

    if (tagDataIsError) {
      return (
        <ErrorDisplay
          title="Error Loading Tag Details"
          message="We encountered an error while loading the tag details. Please try again."
          onRetry={tagDataRefetch}
          retryText="Reload Data"
        />
      );
    }

    return (
      <FormProvider {...form}>
        <form id="edit-tag-form" className="flex flex-col gap-6">
          <TagForm />
        </form>
      </FormProvider>
    );
  };

  return (
    <>
      <Card>
        <CardContent>{renderContent()}</CardContent>
      </Card>
      <ConfirmDialog
        isOpen={showDeleteDialog}
        isLoading={isDeleting}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleOnDelete}
        title="Delete Story Tag"
        content={`Are you sure you want to delete? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <CustomDialog
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          reset();
        }}
        onConfirm={handleSubmit(handleEdit)}
        confirmText={`${isUpdating ? "Saving..." : "Save Tag"}`}
        title="Edit Story Tag"
        contentClassName="!max-w-[700px] w-[90%]"
        isLoading={
          isUpdating || tagDataIsLoading || tagDataIsFetching || !isDirty
        }
      >
        {renderFormContent()}
      </CustomDialog>
    </>
  );
}
