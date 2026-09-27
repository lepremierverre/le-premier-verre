import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import FavoriteButton from "@/components/favorites/FavoriteButton";
import BottleStage from "@/components/wine/BottleStage";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import CaveNav from "@/components/cave/CaveNav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatPrice(value?: number) {
  if (typeof value !== "number") return null;

  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

function formatLabel(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    red: "Rouge",
    white: "Blanc",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Effervescent",
    fortified: "Fortifié",
  };

  return labels[value] || value.replace(/[-_]/g, " ");
}

type FavoriteWine = {
  _id: string;
  slug: string;
  name: string;
  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  color?: string;
  bottleImage?: SanityImageSource;
  approxPrice?: number;
  producer?: { name?: string };
  country?: { name?: string };
  region?: { name?: string };
};

export default async function FavoritesPage() {
  const { userId } = await auth();

  if (userId) {
  }

  const orderedWines = userId
    ? await client.fetch<FavoriteWine[]>(
        `*[
          _type == "wineFavorite" &&
          userId == $userId &&
          defined(wine->slug.current) &&
          wine->published == true
        ] | order(createdAt desc) {
          "wine": wine->{
            _id,
            name,
            "slug": slug.current,
            vintage,
            beverageType,
            alcoholFree,
            color,
            bottleImage,
            approxPrice,
            producer->{name},
            country->{name},
            region->{name}
          }
        }.wine`,
        { userId }
      )
    : [];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* MA CAVE */}
      <section>
        <div className="lpv-container grid gap-6 py-9 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-14">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Ma cave
            </p>

            <h1 className="lpv-display mt-4 text-[clamp(3.2rem,13vw,4.2rem)] leading-[0.86] md:mt-5 md:text-[clamp(4rem,7vw,6.5rem)] md:leading-[0.84]">
              Mes favoris.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-1">
            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Les bouteilles mises de côté au fil de tes découvertes.
            </p>

            <p className="mt-5 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
              {orderedWines.length} favori{orderedWines.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      <CaveNav />

      <section className="lpv-container py-10 md:py-24">
        <div className="flex items-end justify-between border-b border-[var(--lpv-line)] pb-5 md:pb-6">
          <div>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
              À garder
            </p>

            <h2 className="lpv-display mt-3 text-[2.8rem] leading-none md:mt-5 md:text-7xl">
              Les bouteilles.
            </h2>
          </div>

          <Link href="/vins" className="lpv-text-link hidden sm:inline-flex">
            Explorer <span>→</span>
          </Link>
        </div>

        {orderedWines.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 xl:grid-cols-3 xl:gap-x-12">
            {orderedWines.map((wine, index) => {
const price = wine.approxPrice;

              return (
                <article
                  key={wine._id}
                  className="group flex min-w-0 flex-col border-b border-[var(--lpv-line)] py-6 md:py-10"
                >
                  <div className="relative">
                    <Link
                      href={`/vins/${wine.slug}`}
                      className="block w-full"
                    >
                      <BottleStage
                        image={wine.bottleImage}
                        alt={wine.name ?? "Bouteille"}
                        color={
                          wine.beverageType === "cider"
                            ? undefined
                            : wine.color ?? undefined
                        }
                        variant="card"
                        className="h-[250px] [&>div]:!overflow-visible [&>div]:h-[210px] [&_img]:object-contain transition duration-700 group-hover:scale-[1.025] md:h-[360px] md:[&>div]:h-[300px]"
                      />
                    </Link>

                    <div className="absolute right-0 top-0 z-20">
                      <FavoriteButton wineId={wine._id} size="sm" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col pt-4 md:pt-7">
                    <div className="flex items-baseline justify-between gap-2 md:gap-6">
                      <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
                        {[
                          wine.beverageType === "cider"
                            ? "Cidre"
                            : formatLabel(wine.color) || "Vin",
                          wine.alcoholFree ? "Sans alcool" : null,
                          wine.vintage,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      <span className="relative -top-[1px] text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <Link href={`/vins/${wine.slug}`}>
                      <h2 className="lpv-display mt-3 min-h-[3.35rem] text-[1.8rem] leading-[0.92] transition-opacity group-hover:opacity-60 md:mt-5 md:min-h-[5.6rem] md:text-5xl">
                        {wine.name}
                      </h2>
                    </Link>

                    {wine.producer?.name ? (
                      <p className="mt-3 min-h-5 text-xs leading-5 text-[var(--lpv-muted)] md:mt-5 md:min-h-6 md:text-sm">
                        {wine.producer.name}
                      </p>
                    ) : null}

                    <div className="mt-auto flex items-end justify-between gap-2 border-t border-[var(--lpv-line)] pt-3 md:mt-7 md:gap-6 md:pt-5">
                      <div>
                        <p className="text-[0.68rem] leading-5 text-[var(--lpv-muted)] md:text-xs md:leading-6">
                          {[wine.region?.name, wine.country?.name]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>

                        {price ? (
                          <p className="mt-1 text-xs md:mt-2 md:text-sm">
                            {formatPrice(price)}
                          </p>
                        ) : null}
                      </div>

                      <Link
                        href={`/vins/${wine.slug}`}
                        className="lpv-text-link"
                      >
                        Voir <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
              Rien pour le moment
            </p>

            <h2 className="lpv-display mt-6 text-5xl md:text-7xl">
              Ta sélection est vide.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
              Ajoute des bouteilles depuis le répertoire ou une fiche bouteille.
            </p>

            <Link href="/vins" className="lpv-button lpv-button-dark mt-9">
              Explorer les bouteilles
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
