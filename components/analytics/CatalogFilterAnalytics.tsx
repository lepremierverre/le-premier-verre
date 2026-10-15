"use client";

import type { FormEvent } from "react";
import { trackAnalyticsEvent } from "./trackAnalyticsEvent";

type CatalogFilterAnalyticsProps = {
  locale: "fr" | "en";
  children: React.ReactNode;
  className?: string;
};

const FILTER_NAMES = ["color", "country", "region", "price"] as const;

export default function CatalogFilterAnalytics({
  locale,
  children,
  className,
}: CatalogFilterAnalyticsProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const currentParams = new URLSearchParams(window.location.search);
    const sourceType = locale === "en" ? "wine_catalog_en" : "wine_catalog_fr";

    for (const filterName of FILTER_NAMES) {
      const value = formData.get(filterName);

      if (typeof value !== "string") continue;

      const nextValue = value.trim();
      const currentValue = currentParams.get(filterName)?.trim() ?? "";

      // Ne compter que l'application réelle d'un filtre nouveau ou modifié.
      if (!nextValue || nextValue === currentValue) continue;

      trackAnalyticsEvent("filter_applied", {
        filterName,
        filterValue: nextValue,
        sourceType,
      });
    }
  }

  return (
    <form method="GET" className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
