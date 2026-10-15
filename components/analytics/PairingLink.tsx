"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { trackAnalyticsEvent } from "@/components/analytics/trackAnalyticsEvent";

type BaseProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  href: string;
  pairingId: string;
  locale: "fr" | "en";
};

type DirectoryProps = BaseProps & {
  context: "directory";
  sourceWineId?: never;
};

type WineDetailProps = BaseProps & {
  context: "wine_detail";
  sourceWineId: string;
};

type PairingLinkProps = DirectoryProps | WineDetailProps;

export default function PairingLink({
  href,
  pairingId,
  locale,
  context,
  sourceWineId,
  ...props
}: PairingLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      onClick={() => {
        trackAnalyticsEvent("pairing_clicked", {
          contentId: pairingId,
          contentType: "pairing",
          sourceType:
            context === "directory"
              ? locale === "en"
                ? "pairing_directory_en"
                : "pairing_directory_fr"
              : locale === "en"
                ? "wine_detail_en"
                : "wine_detail_fr",
          ...(context === "wine_detail"
            ? { sourceId: sourceWineId }
            : {}),
        });
      }}
    />
  );
}
