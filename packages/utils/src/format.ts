import { format } from "date-fns";

export function formatDateTime(date: Date | number | string) {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

export function formatDate(date: Date | number | string) {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDisplayDate(dateString: string | null) {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "yyyy-MM-dd");
  } catch {
    return "-";
  }
}

export function formatDisplayDateTime(dateString: string | null) {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "yyyy-MM-dd HH:mm");
  } catch {
    return "-";
  }
}

export function formatId(id?: number | string) {
  if (!id) return "#00000";
  const idStr = String(id).padStart(5, "0");
  return `#${idStr}`;
}

export function truncateText(text?: string, maxLength: number = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}
