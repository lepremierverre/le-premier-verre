"use client";

import type { ComponentProps } from "react";

import { trackAnalyticsEvent } from "@/components/analytics/trackAnalyticsEvent";

type EventInterestLinkProps = Omit<
  ComponentProps<"a">,
  "href" | "onClick"
> & {
  href: string;
  eventId: string;
  locale: "fr" | "en";
};

export default function EventInterestLink({
  href,
  eventId,
  locale,
  ...props
}: EventInterestLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={() => {
        trackAnalyticsEvent("event_interest_clicked", {
          contentId: eventId,
          sourceType:
            locale === "en"
              ? "event_detail_en"
              : "event_detail_fr",
        });
      }}
    />
  );
}
