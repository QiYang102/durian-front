import { DeploymentStatus, StoryPriority, StoryStatus } from "../enums";
import { Project } from "./project";
import {
  Flame,
  Bookmark,
  Turtle,
  LucideIcon,
  Sparkles,
  Rocket,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { StoryTag } from "./story-tag";

export interface Story {
  id: number;
  name: string;
  description?: string;
  short_description?: string;
  iteration?: number;
  project?: Project;
  team?: number;
  priority?: StoryPriority;
  status?: StoryStatus;
  is_complete?: boolean;
  is_delivered?: boolean;
  is_require_tester?: boolean;
  is_pendingReview?: boolean;
  is_rnd?: boolean;
  need_verify?: boolean;
  verify_at?: string;
  is_multi?: boolean;
  total_estimate_time?: number;
  parent_story?: number | Story;
  create_at: string;
  create_by?: string;
  update_at?: string;
  update_by?: string;

  is_needed_to_deploy?: boolean;
  deployment_status?: DeploymentStatus;
  deployment_staging_status_at?: string;
  deployment_production_status_at?: string;
  has_issue: boolean;
  issue_resolved_at?: string;
  tags?: StoryTag[];
}

export interface PriorityOption {
  name: string;
  chipVariant: string;
  chipTextVariant: string;
  icon: LucideIcon;
  styles: {
    accentBar: string;
    accentBarColor: string;
    border: string;
    borderColor: string;
    borderWidth: string;
    borderBottom: string;
    borderBottomColor: string;
    textColor: string;
    textColorValue: string;
  };
}

export interface BadgeConfig {
  show: boolean;
  label: string;
  icon: LucideIcon;
  bgColor: string;
  animate?: boolean;
}

export const StoryStatusOption = new Map<string, any>([
  [
    StoryStatus.DRAFT,
    {
      name: "Draft",
      chipVariant: "gray",
      chipTextVariant: "Draft",
    },
  ],
  [
    StoryStatus.NEW,
    {
      name: "New",
      chipVariant: "purple",
      chipTextVariant: "New",
    },
  ],
  [
    StoryStatus.STARTED,
    {
      name: "Started",
      chipVariant: "blue",
      chipTextVariant: "Started",
    },
  ],
  [
    StoryStatus.TAKEN,
    {
      name: "Taken",
      chipVariant: "orange",
      chipTextVariant: "Taken",
    },
  ],
  [
    StoryStatus.COMPLETED,
    {
      name: "Completed",
      chipVariant: "green",
      chipTextVariant: "Completed",
    },
  ],
]);

export const PriorityTypeOption = new Map<StoryPriority, PriorityOption>([
  [
    StoryPriority.HIGH,
    {
      name: "High",
      chipVariant: "red",
      chipTextVariant: "High",
      icon: Flame,
      styles: {
        accentBar: "bg-red-200",
        accentBarColor: "#fecaca",
        border: "border-2 border-red-300",
        borderColor: "#fca5a5",
        borderWidth: "2px",
        borderBottom: "border-b border-1 border-red-300",
        borderBottomColor: "#fca5a5",
        textColor: "text-red-700",
        textColorValue: "#b91c1c",
      },
    },
  ],
  [
    StoryPriority.NORMAL,
    {
      name: "Normal",
      chipVariant: "blue",
      chipTextVariant: "Normal",
      icon: Bookmark,
      styles: {
        accentBar: "bg-blue-200",
        accentBarColor: "#bfdbfe",
        border: "border-2 border-blue-300",
        borderColor: "#93c5fd",
        borderWidth: "2px",
        borderBottom: "border-b border-1 border-blue-300",
        borderBottomColor: "#93c5fd",
        textColor: "text-blue-700",
        textColorValue: "#1d4ed8",
      },
    },
  ],
  [
    StoryPriority.LOW,
    {
      name: "Low",
      chipVariant: "gray",
      chipTextVariant: "Low",
      icon: Turtle,
      styles: {
        accentBar: "bg-gray-200",
        accentBarColor: "#e5e7eb",
        border: "border-2 border-gray-300",
        borderColor: "#d1d5db",
        borderWidth: "2px",
        borderBottom: "border-b border-1 border-gray-300",
        borderBottomColor: "#d1d5db",
        textColor: "text-gray-700",
        textColorValue: "#374151",
      },
    },
  ],
]);

export const defaultPriorityOption: PriorityOption = {
  name: "Default",
  chipVariant: "slate",
  chipTextVariant: "Default",
  icon: Bookmark,
  styles: {
    accentBar: "bg-slate-100",
    accentBarColor: "#f1f5f9",
    border: "",
    borderColor: "",
    borderWidth: "",
    borderBottom: "",
    borderBottomColor: "",
    textColor: "text-slate-700",
    textColorValue: "#334155",
  },
};

export const StoryBadgeOption = new Map<string, BadgeConfig>([
  [
    "hasIssue",
    {
      show: true,
      label: "ISSUE",
      icon: AlertTriangle,
      bgColor: "#dc2626",
      animate: true,
    },
  ],
  [
    "isResolved",
    {
      show: true,
      label: "RESOLVED",
      icon: CheckCircle,
      bgColor: "#16a34a",
      animate: false,
    },
  ],
  [
    "isNew",
    {
      show: true,
      label: "NEW",
      bgColor: "linear-gradient(to right, #3b82f6, #2563eb)",
      icon: Sparkles,
      animate: true,
    },
  ],
]);

export const defaultBadgeConfig: BadgeConfig = {
  show: false,
  label: "",
  bgColor: "",
  icon: null,
  animate: false,
};
