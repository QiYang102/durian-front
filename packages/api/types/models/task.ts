import { TaskStatus } from "../enums";
import { User } from "./user";

export interface Task {
  id?: number;
  name?: string;
  description?: string;
  due_date?: Date;
  estimate_time?: number;
  status?: string;
  iteration?: number;
  story?: number;
  user?: User;
  total_hour_used?: number;
  create_at?: string;
  create_by?: string;
  update_by?: string;
  is_bug?: boolean;
  is_active?: boolean;
}

export const TaskStatusOption = new Map<string, any>([
  [
    TaskStatus.STATUS_DO,
    {
      name: "do",
      chipVariant: "red",
      chipTextVariant: "do",
    },
  ],
  [
    TaskStatus.STATUS_DOING,
    {
      name: "doing",
      chipVariant: "yellow",
      chipTextVariant: "doing",
    },
  ],
  [
    TaskStatus.STATUS_COMPLETE,
    {
      name: "complete",
      chipVariant: "green",
      chipTextVariant: "complete",
    },
  ],
  [
    TaskStatus.STATUS_PENDING,
    {
      name: "pending-review",
      chipVariant: "orange",
      chipTextVariant: "pending-review",
    },
  ],
]);
