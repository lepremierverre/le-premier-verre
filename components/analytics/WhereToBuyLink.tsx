"use client";

import type { ComponentProps } from "react";

import { trackAnalyticsEvent } from "@/components/analytics/trackAnalyticsEvent";

type WhereToBuyLinkProps = Omit<
  ComponentProps<"a">,
  "href" | "onClick"
> & {
  href: string;
  wineId: string;
  locale: "fr" | "en";
};

export default function WhereToBuyLink({
  href,
  wineId,
  locale,
  ...props
}: WhereToBuyLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={() => {
        trackAnalyticsEvent("where_to_buy_clicked", {
          contentId: wineId,
          sourceType:
            locale === "en"
              ? "wine_detail_en"
              : "wine_detail_fr",
        });
      }}
    />
  );
}
