"use client";

import { useEffect, useRef } from "react";

import { trackAnalyticsEvent } from "@/components/analytics/trackAnalyticsEvent";

type RecommendationImpressionProps = {
  recommendationId: string;
  pairingSlug: string;
  alcoholChoice: "with" | "without";
  locale: "fr" | "en";
};

export default function RecommendationImpression({
  recommendationId,
  pairingSlug,
  alcoholChoice,
  locale,
}: RecommendationImpressionProps) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    trackAnalyticsEvent("recommendation_impression", {
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
  }, [recommendationId, pairingSlug, alcoholChoice, locale]);

  return null;
}
