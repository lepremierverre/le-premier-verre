"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackAnalyticsEvent } from "./trackAnalyticsEvent";

type CatalogTypeFilterLinkProps = {
  href: string;
  value: string;
  locale: "fr" | "en";
  className?: string;
  children: ReactNode;
};

export default function CatalogTypeFilterLink({
  href,
  value,
  locale,
  className,
  children,
}: CatalogTypeFilterLinkProps) {
  function handleClick() {
    const currentParams = new URLSearchParams(window.location.search);

    const currentType = currentParams.get("type") || "all";
    const nextType = value || "all";

    // Ne pas recompter un type déjà actif.
    if (currentType === nextType) return;

    trackAnalyticsEvent("filter_applied", {
      filterName: "type",
      filterValue: nextType,
      sourceType: locale === "en" ? "wine_catalog_en" : "wine_catalog_fr",
    });
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
