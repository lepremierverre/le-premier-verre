"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "./trackAnalyticsEvent";

type AnalyticsEventProps = {
  eventName: string;
  data?: Record<string, unknown>;
};

export default function AnalyticsEvent({
  eventName,
  data = {},
}: AnalyticsEventProps) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    trackAnalyticsEvent(eventName, data);
  }, [eventName, data]);

  return null;
}
