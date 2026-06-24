import { getAnalyticsInstance } from "@/firebase";
import { logEvent as fbLogEvent, setUserProperties as fbSetUserProperties, setUserId as fbSetUserId } from "firebase/analytics";

let currentUserId: string | null = null;
let currentUserFullname: string | null = null;

export async function trackEvent(name: string, params: Record<string, any> = {}) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  if (currentUserId) {
    params.user_id = currentUserId;
  }

  if (currentUserFullname) {
    params.user_fullname = currentUserFullname;
  }

  if (import.meta.env.DEV) {
    params.debug_mode = true;
  }

  fbLogEvent(analytics, name, params);
}

export async function setUserProperty(properties: Record<string, any>) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  if (properties.user_fullname) {  
    currentUserFullname = properties.user_fullname;
  }

  fbSetUserProperties(analytics, properties);
}

export async function setUserId(userId: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  currentUserId = userId;
  fbSetUserId(analytics, userId);
}

export function clearUserContext() {
  currentUserId = null;
  currentUserFullname = null;
}