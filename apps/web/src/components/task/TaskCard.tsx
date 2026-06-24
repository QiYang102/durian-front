import {
  Trash2,
  Plus,
  CheckCircle2,
  UserPlus,
  X,
  User,
  Timer,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Text } from "@/components/ui/Text";
import { Task } from "@ttm/api/types/models/task";
import { Card, CardContent } from "@/components/ui/Card";
import { useSession } from "@ttm/context";
import { useState } from "react";
import { TaskStatus, StoryStatus } from "@ttm/api/types/enums";
import { toast } from "sonner";
import { getSingleStory, useEditStory, useEditTask } from "@ttm/api";
import AddTaskHourDialog from "./dialogs/AddTaskHourDialog";
import { Edit2 } from "lucide-react";
import DeleteTaskDialog from "./dialogs/DeleteTaskDialog";
import EditTaskDialog from "./dialogs/EditTaskDialog";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";
import ActionButton from "../ActionButton";

interface TaskCardProps {
  task: Task;
  onDelete?: () => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const navigate = useNavigate();
  const session = useSession();
  const currentUser = session.user;

  const [addHourOpen, setAddHourOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const isCompleted = task.status === TaskStatus.STATUS_COMPLETE;
  const hasAssignedUser = !!task.user;
  const isMyTask =
    typeof task.user === "object" && task.user?.id === currentUser?.id;

  const getUserName = (): string => {
    if (!task.user) return "None";
    return typeof task.user === "object"
      ? task.user.fullname || "Unknown"
      : "None";
  };

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      [TaskStatus.STATUS_DO]: "bg-blue-500",
      [TaskStatus.STATUS_DOING]: "bg-yellow-500",
      [TaskStatus.STATUS_COMPLETE]: "bg-green-500",
      [TaskStatus.STATUS_PENDING]: "bg-purple-500",
    };
    return statusMap[status] || "bg-gray-400";
  };

  const currentStatusColor = getStatusColor(task.status || "");

  const editTask = useEditTask({
    onSuccess: () => {
      toast.success("Task has been updated successfully");

      setEditOpen(false);
    },
    onError: () => {
      toast.error("Failed to update task. Please try again.");
    },
  });

  const editTaskToComplete = useEditTask({
    onSuccess: (data) => {
      // Mark as completed
      if (data.task.status === "complete") {
        toast.success("Task marked as complete");
      }
      // Mark as complete (undone)
      else {
        toast.success("Task has been reopened successfully");
      }
    },
    onError: (data) => {
      // Mark as completed
      if (data.task.status === "complete") {
        toast.error("Failed to update task status. Please try again.");
      }
      // Mark as complete (undone)
      else {
        toast.error("Failed to reopen task. Please try again.");
      }
    },
  });

  const { data: storyData } = getSingleStory(
    ["story-detail", String(task.story)],
    typeof task.story === "number" ? task.story : 0,
    {},
    {},
  );

  const story = storyData?.story;

  const editStory = useEditStory();

  const handleTake = () => {
    editTask.mutate(
      {
        id: String(task.id),
        user: currentUser?.id,
        status: TaskStatus.STATUS_DOING,
        story: task.story,
        description: task.description,
      },
      {
        onSuccess: () => {
          const newStoryStatus = story?.is_multi
            ? StoryStatus.STARTED
            : StoryStatus.TAKEN;

          editStory.mutate({
            id: String(task.story),
            status: newStoryStatus,
          });
        },
      },
    );
  };

  const handleRemove = () => {
    editTask.mutate({
      id: String(task.id),
      user: null,
      status: TaskStatus.STATUS_DO,
      story: task.story,
      description: task.description,
    });
  };

  const handleMarkAsComplete = () => {
    editTaskToComplete.mutate({
      id: String(task.id),
      status: TaskStatus.STATUS_DOING,
      story: task.story,
      description: task.description,
    });
  };

  const handleMarkAsCompleted = () => {
    editTaskToComplete.mutate({
      id: String(task.id),
      status: TaskStatus.STATUS_COMPLETE,
      story: task.story,
      description: task.description,
    });
  };

  const handleTimeClick = () => {
    if (isMyTask) {
      navigate({
        to: "/task/$taskId/task-hours",
        params: { taskId: String(task.id) },
      });
    }
  };

  return (
    <>
      <Card className="mb-3">
        <CardContent className="w-full bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <Text className="text-xs text-gray-900 leading-tight line-clamp-2">
                {task.description}
              </Text>
            </div>

            <div className="h-6 flex items-center justify-end gap-1.5">
              {hasAssignedUser && isMyTask && (
                <div className="flex gap-1.5">
                  <ActionButton
                    icon={CheckCircle2}
                    onClick={() => {
                      if (isCompleted) {
                        handleMarkAsComplete();
                      } else {
                        handleMarkAsCompleted();
                      }
                    }}
                    className={`text-[10px] h-6 px-2 ${
                      isCompleted
                        ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                        : "text-green-700 border-green-200 hover:bg-green-50"
                    }`}
                    iconSize="w-3 h-3"
                    textClassName="text-[10px]"
                  >
                    {isCompleted ? "Completed" : "Complete"}
                  </ActionButton>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-2">
            <div className="col-span-3 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <div className="flex-shrink-0">
                {task.user &&
                typeof task.user === "object" &&
                task.user.image ? (
                  <img
                    src={getHttpsImageUrl(task.user.image) ?? ""}
                    alt={task.user.fullname || "User"}
                    className="w-5 h-5 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div
                    className={`p-1 rounded-full ${currentStatusColor} bg-opacity-10`}
                  >
                    <User
                      size={12}
                      className={`${currentStatusColor.replace("bg-", "text-")}`}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                  Assigned To
                </div>
                <div className="text-[11px] font-semibold text-gray-900 truncate">
                  {getUserName()}
                </div>
              </div>
              {!isCompleted && (
                <div className="flex-shrink-0">
                  {hasAssignedUser ? (
                    isMyTask && (
                      <ActionButton
                        icon={X}
                        onClick={handleRemove}
                        title="Remove assignment"
                        colorScheme="red"
                        className="hover:bg-red-50 h-6 w-6"
                        iconSize="w-3 h-3"
                      />
                    )
                  ) : (
                    <ActionButton
                      icon={UserPlus}
                      onClick={handleTake}
                      title="Take this task"
                      colorScheme="blue"
                      className="hover:bg-blue-50 h-6 w-6"
                      iconSize="w-3 h-3"
                    />
                  )}
                </div>
              )}
            </div>

            <div
              className={`col-span-2 flex items-center gap-1.5 bg-gray-50 rounded-lg p-2 transition-colors ${
                isMyTask
                  ? "cursor-pointer hover:bg-gray-100"
                  : "cursor-not-allowed"
              }`}
              onClick={handleTimeClick}
            >
              <div
                className={`p-1 rounded-full ${currentStatusColor} bg-opacity-10 flex-shrink-0`}
              >
                <Timer
                  size={12}
                  className={`${currentStatusColor.replace("bg-", "text-")}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">
                  Time Used
                </div>
                <div className="text-[11px] font-semibold text-gray-900 truncate">
                  {task.total_hour_used || 0}h / {task.estimate_time}h
                </div>
              </div>
            </div>
          </div>

          <div className="h-6 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {!isCompleted && (
                <>
                  <ActionButton
                    icon={Edit2}
                    onClick={() => setEditOpen(true)}
                    title="Edit task"
                    colorScheme="blue"
                    className="hover:bg-blue-50"
                    iconSize="w-3 h-3"
                  />
                  <ActionButton
                    icon={Trash2}
                    onClick={() => setDeleteOpen(true)}
                    title="Delete task"
                    colorScheme="red"
                    className="hover:bg-red-50"
                    iconSize="w-3 h-3"
                  />
                </>
              )}
            </div>

            {!isCompleted && hasAssignedUser && isMyTask && (
              <div className="flex gap-1.5">
                <ActionButton
                  icon={Plus}
                  onClick={() => setAddHourOpen(true)}
                  title="Add hour"
                  className="text-gray-700 text-[10px] h-6 px-2"
                  iconSize="w-3 h-3"
                  textClassName="text-gray-700 text-[10px]"
                >
                  Add Hour
                </ActionButton>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddTaskHourDialog
        isOpen={addHourOpen}
        onClose={() => setAddHourOpen(false)}
        task={task}
      />

      <DeleteTaskDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        task={task}
        onSuccess={onDelete}
      />

      <EditTaskDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
      />
    </>
  );
}
