import { User } from "./user";

export type EventType =
  | "Public Holiday"
  | "Annual Leave"
  | "Annual Leave AM"
  | "Annual Leave PM"
  | "Medical Leave"
  | "Emergency Leave"
  | "Emergency Leave AM"
  | "Emergency Leave PM"
  | "Birthday Leave"
  | "Replacement Leave"
  | "Event"
  | "Deadline";

export interface EventCalendar {
  id: number;
  type: EventType;
  start_date: string;
  end_date: string;
  description?: string | null;
  user?: User;
  name?: string;
  total_days?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventCalendarInput {
  type: EventType;
  start_date: string;
  end_date: string;
  description?: string;
  user?: number;
}

export interface UpdateEventCalendarInput
  extends Partial<CreateEventCalendarInput> {
  id: number | string;
}

export const EVENT_TYPE_OPTIONS = [
  { label: "Public Holiday", value: "Public Holiday" },
  { label: "Event", value: "Event" },
  { label: "Deadline", value: "Deadline" },
  { label: "Annual Leave", value: "Annual Leave" },
  { label: "Annual Leave AM", value: "Annual Leave AM" },
  { label: "Annual Leave PM", value: "Annual Leave PM" },
  { label: "Medical Leave", value: "Medical Leave" },
  { label: "Emergency Leave", value: "Emergency Leave" },
  { label: "Emergency Leave AM", value: "Emergency Leave AM" },
  { label: "Emergency Leave PM", value: "Emergency Leave PM" },
  { label: "Birthday Leave", value: "Birthday Leave" },
  { label: "Replacement Leave", value: "Replacement Leave" },
] as const;
