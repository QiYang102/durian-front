import { TaskStatus } from "../enums";

export interface UserStatistics {
  user_id: number;
  user_name: string;
  user_email: string;
  multi_task_count: number;
  solo_task_count: number;
  priority_task_count: number;
  rnd_task_count: number;
  completed_task_count: number;
  total_hours_committed: number;
  total_task_count: number;
}

export interface ProjectEstimate {
  project_name?: string;
  total_estimate_per_project?: number;
}

export interface TaskStory {
  id?: number;
  description?: string;
  status?: TaskStatus;
  estimate_time?: number;
  total_hour_used?: number;
  story?: number;
  story_name?: string;
}

export const TaskStatusOption = new Map<string, any>([
  [
    TaskStatus.STATUS_DO,
    {
      name: "To Do",
      chipVariant: "gray",
      chipTextVariant: "To Do",
    },
  ],
  [
    TaskStatus.STATUS_DOING,
    {
      name: "Doing",
      chipVariant: "blue",
      chipTextVariant: "Doing",
    },
  ],
  [
    TaskStatus.STATUS_PENDING,
    {
      name: "Pending Review",
      chipVariant: "orange",
      chipTextVariant: "Review",
    },
  ],
  [
    TaskStatus.STATUS_COMPLETE,
    {
      name: "Complete",
      chipVariant: "green",
      chipTextVariant: "Complete",
    },
  ],
]);

export interface CapacityReport {
  iteration: number;
  period: string;
  capacity: number;
  total_capacity: number;
  total_estimate: number;
  total_committed: number;
  project_estimates: ProjectEstimate[];
  tasks: TaskStory[];
}
