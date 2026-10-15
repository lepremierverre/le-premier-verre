import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import CaveNav from "@/components/cave/CaveNav";
import BottleStage from "@/components/wine/BottleStage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type JournalEntry = {
  _id: string;
  tastedAt: string;
  appreciation: "liked" | "average" | "disliked";
  note?: string;
  buyAgain: boolean;
  wine?: {
    _id: string;
    name?: string;
    slug?: string;
    vintage?: number;
    beverageType?: "wine" | "cider";
    alcoholFree?: boolean;
    color?: string;
    bottleImage?: SanityImageSource;
    editorialImage?: SanityImageSource;
    producer?: {
      name?: string;
    };
  };
};

const appreciationLabels: Record<JournalEntry["appreciation"], string> = {
  liked: "Aimé",
  average: "Moyen",
  disliked: "Pas aimé",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function getTypeLabel(wine?: JournalEntry["wine"]) {
  if (!wine) return "Vin";

  if (wine.beverageType === "cider") {
    return "Cidre";
  }

  const color = wine.color?.toLowerCase();

  const labels: Record<string, string> = {
    red: "Rouge",
    rouge: "Rouge",
    white: "Blanc",
    blanc: "Blanc",
    rose: "Rosé",
    rosé: "Rosé",
    orange: "Orange",
    sparkling: "Bulles",
    bulles: "Bulles",
  };

  return labels[color || ""] || "Vin";
}

export default async function MonCarnetPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <section className="lpv-container py-12 md:py-20">
          <div className="max-w-[900px]">
            <h1 className="lpv-display text-[clamp(4rem,9vw,8rem)] leading-[0.84] tracking-[-0.045em]">
              Carnet.
            </h1>

            <p className="mt-7 max-w-xl text-[16px] leading-7 text-[var(--lpv-ink)] md:text-[17px]">
              Les bouteilles que tu as bues et les notes que tu veux garder.
            </p>

            <Link
              href="/connexion"
              className="mt-8 inline-flex items-center gap-3 text-[14px] font-medium transition-opacity hover:opacity-50"
            >
              Se connecter <span>→</span>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const entries = await client.fetch<JournalEntry[]>(
    `*[
      _type == "wineJournalEntry" &&
      userId == $userId
    ] | order(tastedAt desc, createdAt desc) {
      _id,
      tastedAt,
      appreciation,
      note,
      buyAgain,
      wine->{
        _id,
        name,
        "slug": slug.current,
        vintage,
        beverageType,
        alcoholFree,
        color,
        bottleImage,
        editorialImage,
        producer->{name}
      }
    }`,
    { userId }
  );

  const likedCount = entries.filter(
    (entry) => entry.appreciation === "liked"
  ).length;

  const buyAgainCount = entries.filter(
    (entry) => entry.buyAgain
  ).length;

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* HERO */}
      <section className="lpv-container py-12 md:py-20">
        <div className="max-w-[900px]">
          <h1 className="lpv-display text-[clamp(4rem,9vw,8rem)] leading-[0.84] tracking-[-0.045em]">
            Carnet.
          </h1>

          <p className="mt-7 max-w-xl text-[16px] leading-7 text-[var(--lpv-ink)] md:text-[17px]">
            Les bouteilles que tu as bues et les notes que tu veux garder.
          </p>

          <Link
            href="/vins"
            className="mt-7 inline-flex items-center gap-3 text-[14px] font-medium transition-opacity hover:opacity-50"
          >
            Ajouter une bouteille <span>→</span>
          </Link>
        </div>
      </section>

      <CaveNav />

      {/* STATS */}
      <section className="lpv-container">
        <div className="flex flex-wrap gap-x-7 gap-y-2 py-6 text-[13px] text-[var(--lpv-muted)]">
          <span>
            <strong className="font-medium text-[var(--lpv-ink)]">
              {entries.length}
            </strong>{" "}
            dégustée{entries.length !== 1 ? "s" : ""}
          </span>

          <span>
            <strong className="font-medium text-[var(--lpv-ink)]">
              {likedCount}
            </strong>{" "}
            aimée{likedCount !== 1 ? "s" : ""}
          </span>

          <span>
            <strong className="font-medium text-[var(--lpv-ink)]">
              {buyAgainCount}
            </strong>{" "}
            à racheter
          </span>
        </div>
      </section>

      {/* CARNET */}
      <section className="lpv-container py-8 md:py-10">
        {entries.length > 0 ? (
          <div className="border-t border-[var(--lpv-line)]">
            {entries.map((entry) => {
              const wine = entry.wine;

              const editorialSrc = wine?.editorialImage
                ? urlFor(wine.editorialImage)
                    .width(1000)
                    .height(1250)
                    .fit("crop")
                    .url()
                : null;

              const href = wine?.slug
                ? `/vins/${wine.slug}`
                : "/vins";

              const typeLabel = getTypeLabel(wine);

              return (
                <article
                  key={entry._id}
                  className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-[22px] border-b border-[var(--lpv-line)] py-6 sm:grid-cols-[135px_minmax(0,1fr)] sm:gap-7 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 md:py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12"
                >
                  {/* IMAGE — même logique que les nouvelles fiches */}
                  <Link
                    href={href}
                    className="block h-full overflow-hidden"
                  >
                    {editorialSrc ? (
                      <img
                        src={editorialSrc}
                        alt={wine?.name || "Bouteille"}
                        className="h-full min-h-[190px] w-full object-cover md:aspect-[4/5] md:min-h-0"
                      />
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center bg-black/[0.025]">
                        <BottleStage
                          image={wine?.bottleImage}
                          alt={wine?.name || "Bouteille"}
                          color={
                            wine?.beverageType === "cider"
                              ? undefined
                              : wine?.color
                          }
                          variant="card"
                          className="!h-full w-full [&>div]:!h-full [&_img]:!max-h-[82%] [&_img]:!max-w-[68%]"
                        />
                      </div>
                    )}
                  </Link>

                  {/* CONTENU */}
                  <div className="flex min-w-0 flex-col">
                    <div>
                      <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                        {[
                          typeLabel,
                          wine?.alcoholFree ? "Sans alcool" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      <Link href={href}>
                        <h2 className="lpv-display mt-2 max-w-[760px] text-[1.4rem] leading-[0.95] tracking-[-0.035em] transition-opacity hover:opacity-55 sm:text-[2rem] md:text-[clamp(2.2rem,3.5vw,3.7rem)]">
                          {wine?.name || "Bouteille"}
                        </h2>
                      </Link>

                      {wine?.producer?.name ? (
                        <p className="mt-2 text-[12px] leading-5 text-[var(--lpv-muted)] md:mt-3 md:text-[14px]">
                          {wine.producer.name}
                          {wine.vintage ? ` · ${wine.vintage}` : ""}
                        </p>
                      ) : null}
                    </div>

                    {/* NOTE PERSONNELLE */}
                    <div className="mt-5 border-t border-[var(--lpv-line)] pt-4 md:mt-auto">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] md:gap-x-5 md:gap-y-2 md:text-[13px]">
                        <span className="font-medium text-[var(--lpv-ink)]">
                          {appreciationLabels[entry.appreciation]}
                        </span>

                        <span className="text-[var(--lpv-muted)]">
                          {formatDate(entry.tastedAt)}
                        </span>

                        {entry.buyAgain ? (
                          <span className="text-[var(--lpv-muted)]">
                            À racheter
                          </span>
                        ) : null}
                      </div>

                      {entry.note?.trim() ? (
                        <p className="mt-3 max-w-2xl text-[13px] leading-5 text-[var(--lpv-ink)] md:text-[15px] md:leading-6">
                          {entry.note}
                        </p>
                      ) : (
                        <p className="mt-2 text-[12px] leading-5 text-[var(--lpv-muted)] md:mt-3 md:text-[14px]">
                          Aucune note.
                        </p>
                      )}

                      <Link
                        href={href}
                        className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium text-[var(--lpv-ink)] transition-opacity hover:opacity-50 md:mt-4 md:gap-3 md:text-[14px]"
                      >
                        Voir la bouteille <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border-t border-[var(--lpv-line)] py-12 md:py-16">
            <h2 className="lpv-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9]">
              Ton carnet est vide.
            </h2>

            <p className="mt-5 max-w-xl text-[16px] leading-7 text-[var(--lpv-ink)]">
              Les bouteilles que tu dégustes pourront être gardées ici avec tes notes.
            </p>

            <Link
              href="/vins"
              className="mt-7 inline-flex items-center gap-3 text-[14px] font-medium transition-opacity hover:opacity-50"
            >
              Voir les vins <span>→</span>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
