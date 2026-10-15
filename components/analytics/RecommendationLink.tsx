"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { trackAnalyticsEvent } from "@/components/analytics/trackAnalyticsEvent";

type RecommendationLinkProps = {
  href: string;
  recommendationId: string;
  pairingSlug: string;
  alcoholChoice: "with" | "without";
  locale: "fr" | "en";
  children: ReactNode;
};

export default function RecommendationLink({
  href,
  recommendationId,
  pairingSlug,
  alcoholChoice,
  locale,
  children,
}: RecommendationLinkProps) {
  function handleClick() {
    trackAnalyticsEvent("recommendation_clicked", {
      recommendationId,
      sourceType:
        locale === "en"
          ? "pairing_detail_en"
          : "pairing_detail_fr",
      sourceSlug: pairingSlug,
      metadata: {
        alcoholChoice,
      },
    });
  }

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
