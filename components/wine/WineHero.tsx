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

  const isJaneDoe =
    name.trim().toLowerCase() === "jane doe" &&
    producer?.trim().toLowerCase() === "pinard et filles";

  if (isJaneDoe) {
    const origin = [appellation, region, country]
      .filter(Boolean)
      .join(" · ");

    return (
      <section className="border-b border-[var(--lpv-line)] pb-14 pt-8 md:pb-20 md:pt-12">
        <div className="grid overflow-hidden border border-[var(--lpv-line)] lg:grid-cols-[1.04fr_0.96fr]">

          <div className="relative min-h-[520px] overflow-hidden bg-[var(--lpv-ink)] sm:min-h-[620px] lg:min-h-[760px]">
            <img
              src="/images/lpv/photos%20bouteilles/janedoe.png"
              alt="Jane Doe — Pinard et Filles"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/35 to-transparent px-5 pb-5 pt-20">
              <p className="text-[0.58rem] uppercase tracking-[0.22em] text-white/80">
                Pinard et Filles
              </p>
            </div>
          </div>

          <div className="flex min-h-[520px] flex-col bg-[var(--lpv-paper)] px-6 py-8 sm:px-9 sm:py-10 lg:min-h-[760px] lg:px-12 lg:py-12 xl:px-16">

            <div className="flex items-start justify-between gap-6 border-b border-[var(--lpv-line)] pb-5">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                {[
                  beverageType === "cider"
                    ? (isEnglish ? "Cider" : "Cidre")
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

              <span className="text-[0.58rem] uppercase tracking-[0.22em] text-[var(--lpv-muted)]">
                LPV / 01
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-center py-12 lg:py-16">
              <h1 className="lpv-display max-w-[760px] text-[clamp(4.6rem,8.5vw,9rem)] leading-[0.78] tracking-[-0.045em]">
                {name}
              </h1>

              {producer ? (
                producerSlug ? (
                  <Link
                    href={`${isEnglish ? "/en/producers" : "/producteurs"}/${producerSlug}`}
                    className="mt-9 w-fit border-b border-[var(--lpv-ink)] pb-1 text-lg transition-opacity hover:opacity-60"
                  >
                    {producer} <span className="ml-1">→</span>
                  </Link>
                ) : (
                  <p className="mt-9 text-lg">{producer}</p>
                )
              ) : null}

              <div className="mt-12 max-w-xl border-t border-[var(--lpv-line)] pt-5">
                <p className="text-sm leading-7 text-[var(--lpv-muted)]">
                  {origin ||
                    (isEnglish
                      ? "Origin to be added"
                      : "Origine à compléter")}
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--lpv-line)] pt-5">
              <div className="grid grid-cols-2 gap-5 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                    {isEnglish ? "Type" : "Type"}
                  </p>
                  <p className="mt-2">
                    {beverageType === "cider"
                      ? (isEnglish ? "Cider" : "Cidre")
                      : formatLabel(color, locale) ||
                        (isEnglish ? "Wine" : "Vin")}
                  </p>
                </div>

                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                    {isEnglish ? "Vintage" : "Millésime"}
                  </p>
                  <p className="mt-2">{vintage || "—"}</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)]">
                    {isEnglish ? "Region" : "Région"}
                  </p>
                  <p className="mt-2">{region || "—"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

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
