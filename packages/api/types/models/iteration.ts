export interface Iteration {
  id: number;
  name?: string;
  team?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  create_at?: string;
  create_by?: string;
  update_by?: string;
  total_story?: number;
  total_tasks?: number[];
  total_bugs?: number[];
}

export enum IterationStatus {
  STATUS_DO = "do",
  STATUS_DOING = "doing",
  STATUS_COMPLETE = "complete",
}

export const IterationStatusOption = new Map<string, any>([
  [
    IterationStatus.STATUS_DO,
    {
      name: "do",
      chipVariant: "red",
      chipTextVariant: "do",
    },
  ],
  [
    IterationStatus.STATUS_DOING,
    {
      name: "doing",
      chipVariant: "yellow",
      chipTextVariant: "doing",
    },
  ],
  [
    IterationStatus.STATUS_COMPLETE,
    {
      name: "complete",
      chipVariant: "green",
      chipTextVariant: "complete",
    },
  ],
]);
