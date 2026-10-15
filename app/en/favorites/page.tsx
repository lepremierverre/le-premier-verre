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

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

function formatLabel(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    red: "Red",
    white: "White",
    rose: "Rosé",
    orange: "Orange",
    sparkling: "Sparkling",
    fortified: "Fortified",
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
  editorialImage?: SanityImageSource;
  approxPrice?: number;
  producer?: { name?: string };
  country?: { name?: string; nameEn?: string };
  region?: { name?: string; nameEn?: string };
};

export default async function EnglishFavoritesPage() {
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
            editorialImage,
            approxPrice,
            producer->{name},
            country->{name, nameEn},
            region->{name, nameEn}
          }
        }.wine`,
        { userId }
      )
    : [];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container pt-10 md:pt-16">
        <h1 className="lpv-display text-[clamp(3.6rem,8vw,7rem)] leading-[0.88] tracking-[-0.045em]">
          Favourites.
        </h1>

        <p className="mt-6 text-[0.95rem] leading-7 md:text-base">
          The bottles you want to come back to.
        </p>
      </section>

      <div className="mt-14 md:mt-20">
        <CaveNav />
      </div>

      <section className="lpv-container py-8 md:py-12">
        {orderedWines.length > 0 ? (
          <>
            {/* MOBILE — mêmes cartes que le catalogue */}
            <div className="grid grid-cols-2 gap-3 pt-4 md:hidden">
              {orderedWines.map((wine) => (
                <article
                  key={wine._id}
                  className="group relative min-w-0 border border-[var(--lpv-line)]"
                >
                  <div className="relative flex h-[470px] flex-col px-5 pb-5 pt-5">
                    <div className="absolute right-5 top-2 z-20">
                      <FavoriteButton
                        wineId={wine._id}
                        size="sm"
                        variant="bare"
                      />
                    </div>

                    <Link
                      href={`/en/wines/${wine.slug}`}
                      className="mt-8 block"
                    >
                      <BottleStage
                        image={wine.editorialImage ?? wine.bottleImage}
                        alt={wine.name}
                        color={
                          wine.beverageType === "cider"
                            ? undefined
                            : wine.color
                        }
                        variant="card"
                        imageFit={wine.editorialImage ? "cover" : "contain"}
                        className={
                          wine.editorialImage
                            ? "!h-[285px] !w-full [&>div]:!h-[265px] [&>div]:!w-full [&>div]:!overflow-hidden [&_img]:!h-[265px] [&_img]:!w-full [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:!object-cover"
                            : "!h-[285px] !w-full [&>div]:!h-[265px] [&>div]:!w-full [&_img]:!max-h-[245px] [&_img]:!max-w-[72%] [&_img]:!object-contain"
                        }
                      />
                    </Link>

                    <div className="flex min-h-[125px] flex-1 flex-col pt-2">
                      <p className="lpv-kicker text-[0.55rem] leading-4 tracking-[0.16em] text-[var(--lpv-cocoa)]">
                        {[
                          wine.beverageType === "cider"
                              ? "Cider"
                              : formatLabel(wine.color) || "Wine",
                          wine.alcoholFree ? "Alcohol-free" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      <Link
                        href={`/en/wines/${wine.slug}`}
                        className="mt-3 block"
                      >
                        <h3 className="lpv-display text-[1.55rem] leading-[0.94]">
                          {wine.name}
                        </h3>
                      </Link>

                      {wine.producer?.name ? (
                        <p className="mt-auto pt-4 text-xs leading-5 text-[var(--lpv-muted)]">
                          {wine.producer.name}
                          {wine.vintage ? ` · ${wine.vintage}` : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* DESKTOP — mêmes cartes que le catalogue */}
            <div className="hidden grid-cols-4 md:grid">
              {orderedWines.map((wine, index) => (
                <article
                  key={wine._id}
                  className={`group relative flex min-w-0 flex-col border-b border-[var(--lpv-line)] px-6 pb-7 pt-6 ${
                    index % 4 !== 0
                      ? "border-l border-[var(--lpv-line)]"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Link
                      href={`/en/wines/${wine.slug}`}
                      className={
                        wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                          ? "relative block h-[350px] overflow-hidden bg-[#A28F80]"
                          : "relative block h-[350px]"
                      }
                    >
                      <BottleStage
                        image={wine.editorialImage ?? wine.bottleImage}
                        alt={wine.name}
                        color={wine.color}
                        variant="card"
                        imageFit={
                          wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                            ? "contain"
                            : wine.editorialImage
                              ? "cover"
                              : "contain"
                        }
                        className={
                          wine.slug === "earl-gelin-domaine-des-nugues-beaujolais-villages-2024-2024"
                            ? "!h-[350px] !w-full [&>div]:!h-[350px] [&>div]:!w-full [&_img]:!h-[455px] [&_img]:!w-auto [&_img]:!max-h-none [&_img]:!max-w-none [&_img]:rotate-[7deg] [&_img]:scale-[1.08]"
                            : wine.editorialImage
                              ? "!h-[350px] !w-full [&>div]:!h-[350px] [&>div]:!w-full [&_img]:!h-full [&_img]:!w-full [&_img]:!max-h-none [&_img]:!max-w-none"
                              : "!h-[300px] [&>div]:!h-[280px] [&_img]:!max-h-[270px] [&_img]:!max-w-[64%]"
                        }
                      />
                    </Link>

                    <div className="absolute -top-5 right-0 z-20">
                      <FavoriteButton
                        wineId={wine._id}
                        size="sm"
                        variant="bare"
                      />
                    </div>
                  </div>

                  <Link
                    href={`/en/wines/${wine.slug}`}
                    className="block pt-5"
                  >
                    <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                      {[
                        wine.beverageType === "cider"
                              ? "Cider"
                              : formatLabel(wine.color) || "Wine",
                        wine.alcoholFree ? "Alcohol-free" : null,
                        wine.vintage,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    <h3 className="lpv-display mt-3 min-h-[4rem] max-w-[360px] text-[2.15rem] leading-[0.94] tracking-[-0.035em]">
                      {wine.name}
                    </h3>

                    {wine.producer?.name ? (
                      <p className="mt-5 text-sm leading-5 text-[var(--lpv-muted)]">
                        {wine.producer.name}
                      </p>
                    ) : null}
                  </Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="border-t border-[var(--lpv-line)] py-16 md:py-24">
            <p className="text-base">No bottles yet.</p>

            <Link
              href="/en/wines"
              className="mt-6 inline-flex items-center gap-3 text-sm font-medium transition-opacity hover:opacity-50"
            >
              View wines <span>→</span>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
