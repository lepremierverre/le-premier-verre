import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import BottleStage from "@/components/wine/BottleStage";

type Props = {
  name: string;
  producer?: string;
  producerSlug?: string;
  country?: string;
  region?: string;
  appellation?: string;
  color?: string;
  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  bottleImage?: SanityImageSource;
  locale?: "fr" | "en";
};

function formatLabel(value?: string, locale: "fr" | "en" = "fr") {
  if (!value) return null;

  const labelsFr: Record<string, string> = {
    red: "Rouge",
    white: "Blanc",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Effervescent",
    fortified: "Fortifié",
  };

  const labelsEn: Record<string, string> = {
    red: "Red",
    white: "White",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Sparkling",
    fortified: "Fortified",
  };

  const labels = locale === "en" ? labelsEn : labelsFr;

  return labels[value] || value.replace(/-/g, " ");
}

export default function WineHero({
  name,
  producer,
  producerSlug,
  country,
  region,
  appellation,
  color,
  vintage,
  beverageType = "wine",
  alcoholFree = false,
  bottleImage,
  locale = "fr",
}: Props) {
  const isEnglish = locale === "en";
  return (
    <section className="border-b border-[var(--lpv-line)] pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            {[
              beverageType === "cider"
                ? isEnglish
                  ? "Cider"
                  : "Cidre"
                : formatLabel(color, locale) || (isEnglish ? "Wine" : "Vin"),
              alcoholFree
                ? isEnglish
                  ? "Alcohol-free"
                  : "Sans alcool"
                : null,
              vintage,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <h1 className="lpv-display mt-7 max-w-3xl text-[clamp(4.2rem,8vw,8rem)] leading-[0.84]">
            {name}
          </h1>

          {producer ? (
            producerSlug ? (
              <Link
                href={`${isEnglish ? "/en/producers" : "/producteurs"}/${producerSlug}`}
                className="lpv-text-link mt-8 w-fit"
              >
                {producer} <span>→</span>
              </Link>
            ) : (
              <p className="mt-8 text-lg text-[var(--lpv-muted)]">
                {producer}
              </p>
            )
          ) : null}

          <div className="mt-10 border-t border-[var(--lpv-line)] pt-6">
            <p className="max-w-md text-sm leading-7 text-[var(--lpv-muted)]">
              {[appellation, region, country]
                .filter(Boolean)
                .join(" · ") ||
                (isEnglish ? "Origin to be added" : "Origine à compléter")}
            </p>
          </div>
        </div>

        <div className="min-h-[620px] md:min-h-[760px]">
          <BottleStage
            image={bottleImage}
            alt={name}
            color={color}
            variant="hero"
            className="min-h-[620px] md:min-h-[760px]"
          />
        </div>
      </div>
    </section>
  );
}
