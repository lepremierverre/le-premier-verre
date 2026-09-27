import Link from "next/link";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import { grapeBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

import BottleStage from "@/components/wine/BottleStage";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";

type GrapeDetail = {
  _id: string;
  name: string;
  slug: string;
  color?: "red" | "white";
  heroImage?: any;
  oneLiner?: string;
  aromas?: string[];
  body?: number;
  acidity?: number;
  tannins?: number;
  servingTemperature?: string;
  simplePairings?: string[];

  mainRegions?: {
    _id: string;
    name: string;
    slug: string;
    heroImage?: any;
    country?: {
      name?: string;
      slug?: string;
    };
  }[];

  wines?: {
    _id: string;
    name: string;
    slug: string;
    vintage?: number;
    color?: string;
    bottleImage?: any;
    approxPrice?: number;
    producer?: {
      name?: string;
      slug?: string;
    };
  }[];

  tryNext?: {
    _key?: string;
    reason?: string;
    grape?: {
      _id: string;
      name: string;
      slug: string;
      color?: string;
      heroImage?: any;
      oneLiner?: string;
    };
  }[];

  seoTitle?: string;
  seoDescription?: string;
  published?: boolean;
};

function colorLabel(color?: string) {
  if (color === "red") return "Cépage rouge";
  if (color === "white") return "Cépage blanc";
  return "Cépage";
}

function scaleLabel(
  value: number | undefined,
  type: "body" | "acidity" | "tannins"
) {
  if (!value) return "—";

  if (type === "body") {
    if (value <= 2) return "Léger";
    if (value === 3) return "Moyen";
    return "Puissant";
  }

  if (value <= 2) return "Faible";
  if (value === 3) return "Moyenne";
  return "Élevée";
}

function ProfileScale({
  label,
  value,
  type,
}: {
  label: string;
  value?: number;
  type: "body" | "acidity" | "tannins";
}) {
  return (
    <div className="border-t border-[var(--lpv-line)] py-5">
      <div className="mb-4 flex items-baseline justify-between gap-5">
        <span className="text-sm">{label}</span>
        <span className="text-sm text-[var(--lpv-muted)]">
          {scaleLabel(value, type)}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={`h-[3px] ${
              value && step <= value
                ? "bg-[var(--lpv-ink)]"
                : "bg-[var(--lpv-line)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return buildDynamicMetadata({
    entity: "grape",
    slug,
    locale: "fr",
  });
}

export default async function GrapePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const grape = await client.fetch<GrapeDetail | null>(grapeBySlugQuery, {
    slug,
  });

  if (!grape) notFound();

  return (
    <main className="bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container pt-8 md:pt-10">
        <Link
          href="/cepages"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--lpv-muted)] transition-opacity hover:opacity-60"
        >
          <span aria-hidden="true">←</span>
          Tous les cépages
        </Link>
      </section>

      <section className="lpv-container border-b border-[var(--lpv-line)] py-12 md:py-20">
        <div
          className={`grid gap-10 ${
            grape.heroImage
              ? "lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
              : ""
          }`}
        >
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.26em] text-[var(--lpv-muted)]">
              {colorLabel(grape.color)}
            </p>

            <h1 className="lpv-display text-6xl leading-[0.9] sm:text-7xl md:text-8xl lg:text-9xl">
              {grape.name}
            </h1>

            {grape.oneLiner && (
              <div className="mt-9 max-w-2xl border-l border-[var(--lpv-ink)] pl-5 md:mt-12 md:pl-7">
                <p className="text-xl leading-8 md:text-2xl md:leading-9">
                  {grape.oneLiner}
                </p>
              </div>
            )}
          </div>

          {grape.heroImage && (
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--lpv-paper-light)]">
              <img
                src={urlFor(grape.heroImage)
                  .width(1200)
                  .height(1500)
                  .fit("crop")
                  .url()}
                alt={grape.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="lpv-container py-12 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--lpv-muted)]">
              Profil
            </p>

            <h2 className="lpv-display mt-3 text-4xl md:text-5xl">
              Dans le verre
            </h2>
          </div>

          <div>
            <ProfileScale label="Corps" value={grape.body} type="body" />
            <ProfileScale
              label="Acidité"
              value={grape.acidity}
              type="acidity"
            />
            <ProfileScale
              label="Tanins"
              value={grape.tannins}
              type="tannins"
            />

            {grape.servingTemperature && (
              <div className="flex items-baseline justify-between gap-5 border-y border-[var(--lpv-line)] py-5">
                <span className="text-sm">Température de service</span>
                <span className="text-lg">
                  {grape.servingTemperature}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {grape.aromas?.length ? (
        <section className="border-y border-[var(--lpv-line)]">
          <div className="lpv-container py-12 md:py-16">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--lpv-muted)]">
              Arômes typiques
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              {grape.aromas.map((aroma) => (
                <span
                  key={aroma}
                  className="border-b border-[var(--lpv-line)] pb-2 text-xl md:text-2xl"
                >
                  {aroma}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {grape.simplePairings?.length ? (
        <section className="lpv-container py-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--lpv-muted)]">
                À table
              </p>

              <h2 className="lpv-display mt-3 text-4xl md:text-5xl">
                Quoi manger avec?
              </h2>
            </div>

            <div className="border-t border-[var(--lpv-line)]">
              {grape.simplePairings.map((pairing, index) => (
                <div
                  key={pairing}
                  className="grid grid-cols-[45px_1fr] border-b border-[var(--lpv-line)] py-5"
                >
                  <span className="text-xs tabular-nums text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg">{pairing}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {grape.mainRegions?.length ? (
        <section className="border-y border-[var(--lpv-line)]">
          <div className="lpv-container py-14 md:py-20">
            <div className="mb-9 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--lpv-muted)]">
                  Géographie
                </p>
                <h2 className="lpv-display mt-3 text-4xl md:text-5xl">
                  Où le trouver
                </h2>
              </div>

              <Link
                href="/regions"
                className="hidden text-sm underline underline-offset-4 transition-opacity hover:opacity-60 sm:block"
              >
                Toutes les régions
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {grape.mainRegions.map((region) => (
                <Link
                  key={region._id}
                  href={`/regions/${region.slug}`}
                  className="group border border-[var(--lpv-line)] bg-[var(--lpv-paper)]"
                >
                  {region.heroImage && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={urlFor(region.heroImage)
                          .width(900)
                          .height(560)
                          .fit("crop")
                          .url()}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {region.country?.name && (
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                        {region.country.name}
                      </p>
                    )}

                    <div className="mt-2 flex items-end justify-between gap-4">
                      <h3 className="lpv-display text-3xl">
                        {region.name}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="lpv-container py-14 md:py-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--lpv-muted)]">
            À découvrir
          </p>

          <h2 className="lpv-display mt-3 text-4xl md:text-5xl">
            Les vins en {grape.name}
          </h2>
        </div>

        {grape.wines?.length ? (
          <div className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-12">
            {grape.wines.map((wine, index) => (
              <article
                key={wine._id}
                className="group flex min-w-0 flex-col border-b border-[var(--lpv-line)] py-10"
              >
                <Link
                  href={`/vins/${wine.slug}`}
                  className="block w-full"
                >
                  <BottleStage
                    image={wine.bottleImage}
                    alt={wine.name ?? "Bouteille de vin"}
                    variant="card"
                    className="transition duration-700 group-hover:scale-[1.025]"
                  />
                </Link>

                <div className="flex flex-1 flex-col pt-7">
                  <div className="flex min-h-[18px] items-start justify-between gap-6">
                    <p className="lpv-kicker min-w-0 text-[var(--lpv-cocoa)]">
                      {wine.vintage || "Vin"}
                    </p>

                    <span className="shrink-0 text-[0.6rem] tracking-[0.16em] text-[var(--lpv-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <Link
                    href={`/vins/${wine.slug}`}
                    className="mt-5 block"
                  >
                    <h3 className="lpv-display min-h-[5.6rem] text-4xl leading-[0.92] transition-opacity group-hover:opacity-60 md:text-5xl xl:min-h-[6.6rem]">
                      {wine.name}
                    </h3>
                  </Link>

                  <div className="min-h-[3.75rem] pt-5">
                    {wine.producer?.name ? (
                      <p className="text-sm text-[var(--lpv-muted)]">
                        {wine.producer.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-auto flex min-h-[5.25rem] items-end justify-between gap-6 border-t border-[var(--lpv-line)] pt-5">
                    <div>
                      {wine.approxPrice ? (
                        <p className="text-sm">
                          {wine.approxPrice.toFixed(2).replace(".", ",")} $
                        </p>
                      ) : (
                        <p className="text-sm text-[var(--lpv-muted)]">
                          Prix à vérifier
                        </p>
                      )}
                    </div>

                    <span
                      aria-hidden="true"
                      className="text-lg transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-y border-[var(--lpv-line)] py-10">
            <p className="text-[var(--lpv-muted)]">
              Aucun vin LPV utilisant ce cépage n’est encore publié.
            </p>
          </div>
        )}
      </section>

      {grape.tryNext?.length ? (
        <section className="border-t border-[var(--lpv-line)]">
          <div className="lpv-container py-14 md:py-20">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--lpv-muted)]">
              Continuer l’exploration
            </p>

            <h2 className="lpv-display mt-3 text-4xl md:text-5xl">
              Si tu aimes ceci, essaie…
            </h2>

            <div className="mt-10 border-t border-[var(--lpv-line)]">
              {grape.tryNext
                .filter((item) => item.grape?.slug)
                .map((item, index) => (
                  <Link
                    key={item._key || item.grape!._id}
                    href={`/cepages/${item.grape!.slug}`}
                    className="group grid gap-4 border-b border-[var(--lpv-line)] py-6 md:grid-cols-[60px_0.7fr_1.3fr_auto] md:items-center"
                  >
                    <span className="text-xs tabular-nums text-[var(--lpv-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="lpv-display text-3xl md:text-4xl">
                      {item.grape!.name}
                    </h3>

                    <p className="max-w-xl text-sm leading-6 text-[var(--lpv-muted)]">
                      {item.reason ||
                        item.grape!.oneLiner ||
                        "Un autre cépage à découvrir."}
                    </p>

                    <span
                      aria-hidden="true"
                      className="text-xl transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
