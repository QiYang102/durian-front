export enum StoryMode {
  INCOMPLETED = "incompleted",
  COMPLETED = "completed",
}

export enum StoryStatus {
  DRAFT = "draft",
  NEW = "new",
  STARTED = "started",
  TAKEN = "taken",
  COMPLETED = "completed",
}

export enum StoryPriority {
  HIGH = "high",
  NORMAL = "normal",
  LOW = "low",
}

export enum DeploymentStatus {
  PENDING = "pending",
  STAGING = "staging",
  PRODUCTION = "production",
}

export enum TaskStatus {
  STATUS_DO = "do",
  STATUS_DOING = "doing",
  STATUS_COMPLETE = "complete",
  STATUS_PENDING = "pending-review",
}

export enum KopibengStatus {
  OWING = "owning",
  COMPLETED = "complete",
}

export enum EventType {
  PUBLIC_HOLIDAY = "Public Holiday",
  ANNUAL_LEAVE = "Annual Leave",
  ANNUAL_LEAVE_AM = "Annual Leave AM",
  ANNUAL_LEAVE_PM = "Annual Leave PM",
  MEDICAL_LEAVE = "Medical Leave",
  EMERGENCY_LEAVE = "Emergency Leave",
  EMERGENCY_LEAVE_AM = "Emergency Leave AM",
  EMERGENCY_LEAVE_PM = "Emergency Leave PM",
  BIRTHDAY_LEAVE = "Birthday Leave",
  REPLACEMENT_LEAVE = "Replacement Leave",
  EVENT = "Event",
  DEADLINE = "Deadline",
}
