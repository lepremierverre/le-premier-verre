"use client";

import type { ComponentProps } from "react";

import { trackAnalyticsEvent } from "@/components/analytics/trackAnalyticsEvent";

type ProducerWebsiteLinkProps = Omit<
  ComponentProps<"a">,
  "href" | "onClick"
> & {
  href: string;
  producerId: string;
  locale: "fr" | "en";
};

export default function ProducerWebsiteLink({
  href,
  producerId,
  locale,
  ...props
}: ProducerWebsiteLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={() => {
        trackAnalyticsEvent("producer_website_clicked", {
          producerId,
          sourceType:
            locale === "en"
              ? "producer_detail_en"
              : "producer_detail_fr",
        });
      }}
    />
  );
}
