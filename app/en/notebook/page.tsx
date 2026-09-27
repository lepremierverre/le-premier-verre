import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import CaveNav from "@/components/cave/CaveNav";

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
    producer?: {
      name?: string;
    };
  };
};

const appreciationLabels: Record<JournalEntry["appreciation"], string> = {
  liked: "Liked",
  average: "Average",
  disliked: "Didn’t like",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default async function NotebookPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container py-20 md:py-28">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              My space
            </p>

            <h1 className="lpv-display mt-7 max-w-5xl text-[clamp(4.8rem,10vw,10rem)] leading-[0.82]">
              Mon carnet
              <br />
              de vin.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
              The bottles you’ve tried. The impressions worth remembering.
            </p>
          </div>
        </section>

        <section className="lpv-container py-24 text-center">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Sign in required
          </p>

          <h2 className="lpv-display mt-6 text-5xl md:text-7xl">
            Your notebook is waiting.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
            Connecte-toi pour retrouver les bouteilles que tu as bues et les
            notes que tu veux garder.
          </p>

          <Link href="/en/sign-in" className="lpv-button lpv-button-dark mt-9">
            Sign in
          </Link>
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

      {/* MA CAVE */}
      <section>
        <div className="lpv-container grid gap-6 py-9 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-14">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              My cellar
            </p>

            <h1 className="lpv-display mt-4 text-[clamp(3.2rem,13vw,4.2rem)] leading-[0.86] md:mt-5 md:text-[clamp(4rem,7vw,6.5rem)] md:leading-[0.84]">
              My notebook.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-1">
            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              The bottles you’ve tried. The impressions worth remembering.
              Rien de plus compliqué.
            </p>

            <Link
              href="/en/wines"
              className="lpv-text-link mt-5 inline-flex"
            >
              Add a bottle <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <CaveNav />

      {/* STATS */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid md:grid-cols-3">
          {[
            ["Bottles tried", entries.length],
            ["Liked", likedCount],
            ["Buy again", buyAgainCount],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={`py-5 md:px-8 md:py-10 ${
                index < 2
                  ? "border-b border-[var(--lpv-line)] md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <div className="flex items-end justify-between gap-6">
                <p className="lpv-kicker pb-1 text-[var(--lpv-cocoa)] md:pb-2">
                  {label}
                </p>

                <p className="lpv-display text-5xl leading-none md:text-7xl">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARNET */}
      <section className="lpv-container py-10 md:py-24">
        <div className="border-b border-[var(--lpv-line)] pb-5 md:pb-7">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            My history
          </p>

          <h2 className="lpv-display mt-3 text-[2.8rem] leading-[0.9] md:mt-5 md:text-7xl">
            Worth remembering.
          </h2>
        </div>

        {entries.length > 0 ? (
          <div>
            {entries.map((entry, index) => {
              const wine = entry.wine;

              const imageSrc = wine?.bottleImage
                ? urlFor(wine.bottleImage)
                    .width(260)
                    .height(420)
                    .fit("max")
                    .url()
                : null;

              return (
                <article
                  key={entry._id}
                  className="relative grid border-b border-[var(--lpv-line)] py-8 md:grid-cols-[45px_150px_1fr] md:gap-10 md:py-14"
                >
                  {/* NUMÉRO */}
                  <div className="absolute left-0 top-8 md:static">
                    <span className="text-[0.62rem] tracking-[0.18em] text-[var(--lpv-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* BOUTEILLE */}
                  <Link
                    href={wine?.slug ? `/en/wines/${wine.slug}` : "/en/wines"}
                    className="flex h-[230px] items-center justify-center px-16 md:h-60 md:px-0"
                  >
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={wine?.name || "Bottle"}
                        className="max-h-[215px] w-auto object-contain transition-transform duration-500 hover:-translate-y-1 md:h-full md:max-h-none"
                      />
                    ) : (
                      <div className="h-full w-20 border border-[var(--lpv-line)]" />
                    )}
                  </Link>

                  {/* CONTENU */}
                  <div className="mt-4 flex flex-col justify-between md:col-span-1 md:mt-0">
                    <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-16">

                      {/* IDENTITÉ */}
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-5">
                          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                            {appreciationLabels[entry.appreciation]}
                          </p>

                          <span className="text-[var(--lpv-line)]">—</span>

                          <p className="text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)]">
                            {formatDate(entry.tastedAt)}
                          </p>
                        </div>

                        <Link
                          href={wine?.slug ? `/en/wines/${wine.slug}` : "/en/wines"}
                        >
                          <h3 className="lpv-display mt-3 text-[2.65rem] leading-[0.88] transition-opacity hover:opacity-60 md:mt-5 md:text-6xl md:leading-[0.86]">
                            {wine?.name || "Bottle"}
                          </h3>
                        </Link>

                        <p className="mt-3 text-sm text-[var(--lpv-muted)] md:mt-5">
                          {[wine?.producer?.name, wine?.vintage]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>

                      {/* SOUVENIR */}
                      <div className="border-t border-[var(--lpv-line)] pt-4 md:pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                        <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                          What I remember
                        </p>

                        <p className="mt-3 max-w-md text-[0.95rem] leading-6 text-[var(--lpv-ink)] md:mt-5 md:text-base md:leading-7">
                          {entry.note?.trim() || (
                            <span className="text-[var(--lpv-muted)]">
                              No notes for this bottle.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* BAS */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--lpv-line)] pt-4 md:mt-10 md:gap-6 md:pt-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                        Buy again{" "}
                        <span className="ml-2 text-[var(--lpv-ink)]">
                          {entry.buyAgain ? "Yes" : "No"}
                        </span>
                      </p>

                      <Link
                        href={wine?.slug ? `/en/wines/${wine.slug}` : "/en/wines"}
                        className="lpv-text-link"
                      >
                        View bottle <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              First bottle
            </p>

            <h2 className="lpv-display mt-6 text-5xl md:text-7xl">
              Your notebook is still empty.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
              Après avoir bu une bouteille, ajoute-la ici pour garder une trace de
              ce que tu en as pensé.
            </p>

            <Link href="/en/wines" className="lpv-button lpv-button-dark mt-9">
              Discover bottles
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
