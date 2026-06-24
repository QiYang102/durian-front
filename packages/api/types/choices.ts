import { DeploymentStatus } from "./enums";

export const CUSTOMER_TYPES = [
  { value: "earlybird", label: "Early Bird" },
  { value: "employee", label: "Employee" },
  { value: "prime", label: "T Privilege" },
  { value: "public", label: "Public" },
];

export const BUMIPUTRA_STATUS = [
  { value: "unspecified", label: "N/A" },
  { value: "bumiputra", label: "Bumiputra" },
  { value: "non-bumiputra", label: "Non-Bumiputra" },
];

export const ROLE_ITEMS = [
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
];

export const STATUS = [
  { value: "do", label: "do" },
  { value: "doing", label: "doing" },
  { value: "complete", label: "complete" },
];

export const PRIORITY_CHOICE = [
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
];

export const ENVIRONMENT = [
  { value: "STAG", label: "STAG" },
  { value: "PROD", label: "PROD" },
];

export const FRONTEND_BACKEND = [
  { value: "Front", label: "Front" },
  { value: "Front-Admin", label: "Front-Admin" },
  { value: "Backend", label: "Backend" },
];

export const MIGRATION = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const DEPLOYMENT_STATUS_OPTIONS = [
  { value: DeploymentStatus.PENDING, label: "Pending" },
  { value: DeploymentStatus.STAGING, label: "Staging" },
  { value: DeploymentStatus.PRODUCTION, label: "Production" },
];

export const KOPIBENG_STATUS_CHOICE = [
  { value: "owing", label: "Owing" },
  { value: "complete", label: "Complete" },
];
