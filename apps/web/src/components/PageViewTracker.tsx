import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { CommonEvents } from "@ttm/api/types/tracker";

export function PageViewTracker() {
  const { location } = useRouterState();
  // console.log(location);

  useEffect(() => {
    const params: Record<string, any> = {
      timestamp: Date.now(),
      referrer: document.referrer || 'direct',
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: location.pathname,
    };
    trackEvent(CommonEvents.PAGE_VIEW, params);
  }, [location.pathname]);
  
  return null;
}
