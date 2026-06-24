import { Trash2, User, Clock, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VerifiedByUser } from "@ttm/api/types/models/verifiedByUser";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteVerifiedByUser, useEditVerifiedByUser } from "@ttm/api";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { CustomDialog } from "../ui/CustomDialog";
import { FormProvider, useForm } from "react-hook-form";
import { VerifiedByUserForm } from "./VerifiedByUserForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";

const schema = z.object({
  user: z.coerce.number().min(1, ""),
  total_hour_used: z.coerce.number().min(0, ""),
});

type VerifiedByUserFormSchema = z.infer<typeof schema>;

interface VerifiedByUserCardProps {
  verifiedUser: VerifiedByUser;
  onDelete?: () => void;
}

export default function VerifiedByUserCard({
  verifiedUser,
  onDelete,
}: VerifiedByUserCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const getUserName = (): string => {
    if (!verifiedUser.user) return "None";
    return typeof verifiedUser.user === "object"
      ? verifiedUser.user.fullname || "Unknown"
      : "None";
  };

  const form = useForm<VerifiedByUserFormSchema>({
    defaultValues: {
      user:
        typeof verifiedUser.user === "object"
          ? verifiedUser.user?.id
          : verifiedUser.user,
      total_hour_used: verifiedUser.total_hour_used || 0,
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  const editVerifiedUser = useEditVerifiedByUser({
    onSuccess: () => {
      toast.success("Verified user has been updated successfully");

      setEditOpen(false);
    },
    onError: () => {
      toast.error("Failed to update verified user. Please try again.");
    },
  });

  const deleteVerifiedUser = useDeleteVerifiedByUser({
    onSuccess: () => {
      toast.success("Verified user has been deleted successfully");

      setDeleteOpen(false);
      onDelete?.();
    },
    onError: () => {
      toast.error("Failed to delete verified user. Please try again.");
    },
  });

  const handleDelete = () => {
    deleteVerifiedUser.mutate(String(verifiedUser.id));
  };

  const handleEdit = (data: VerifiedByUserFormSchema) => {
    editVerifiedUser.mutate({
      id: String(verifiedUser.id),
      user: data.user,
      total_hour_used: data.total_hour_used,
      story: verifiedUser.story,
      iteration: verifiedUser.iteration,
    });
  };

  return (
    <>
      <Card className="mb-3">
        <CardContent className="w-full bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow p-3">
          <div className="grid grid-cols-5 gap-2 mb-2">
            <div className="col-span-3 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <div className="flex-shrink-0">
                {verifiedUser.user &&
                typeof verifiedUser.user === "object" &&
                verifiedUser.user.image ? (
                  <img
                    src={getHttpsImageUrl(verifiedUser.user.image) ?? ""}
                    alt={verifiedUser.user.fullname || "User"}
                    className="w-5 h-5 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="p-1 rounded-full bg-blue-500 bg-opacity-10">
                    <User size={12} className="text-blue-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                  Verified By
                </div>
                <div className="text-[11px] font-semibold text-gray-900 truncate">
                  {getUserName()}
                </div>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
              <div className="p-1 rounded-full bg-green-500 bg-opacity-10 flex-shrink-0">
                <Clock size={12} className="text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                  Hours Logged
                </div>
                <div className="text-[11px] font-semibold text-gray-900 truncate">
                  {verifiedUser.total_hour_used || 0}h
                </div>
              </div>
            </div>
          </div>

          <div className="h-6 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  reset({
                    user:
                      typeof verifiedUser.user === "object"
                        ? verifiedUser.user?.id
                        : verifiedUser.user,
                    total_hour_used: verifiedUser.total_hour_used || 0,
                  });
                  setEditOpen(true);
                }}
                className="text-blue-600 hover:bg-blue-50 h-7 w-7 p-0"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="text-red-600 hover:bg-red-50 h-7 w-7 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Verified User"
        content="Are you sure you want to delete this verified user?"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <CustomDialog
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          reset();
        }}
        onConfirm={handleSubmit(handleEdit)}
        confirmText="Update"
        title="Edit Verified User"
        isLoading={editVerifiedUser.isPending || !isDirty}
      >
        <FormProvider {...form}>
          <form id="edit-verified-user-form" className="flex flex-col gap-6">
            <VerifiedByUserForm />
          </form>
        </FormProvider>
      </CustomDialog>
    </>
  );
}
