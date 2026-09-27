import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import CaveNav from "@/components/cave/CaveNav";
import { writeClient } from "@/sanity/lib/write-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CaveData = {
  journalCount: number;
  favoriteCount: number;
  listCount: number;
  buyAgainCount: number;
};

export default async function CellarPage() {
  const { userId } = await auth();

  const stats: CaveData = userId
    ? await writeClient.fetch(
        `{
          "journalCount": count(*[
            _type == "wineJournalEntry" &&
            userId == $userId
          ]),
          "favoriteCount": count(*[
            _type == "wineFavorite" &&
            userId == $userId
          ]),
          "listCount": count(*[
            _type == "wineList" &&
            userId == $userId
          ]),
          "buyAgainCount": count(*[
            _type == "wineJournalEntry" &&
            userId == $userId &&
            buyAgain == true
          ])
        }`,
        { userId }
      )
    : {
        journalCount: 0,
        favoriteCount: 0,
        listCount: 0,
        buyAgainCount: 0,
      };

  const sections = [
    {
      label: "Notebook",
      title: "What I’ve tried.",
      description:
        "Find the bottles you’ve tried, your impressions and the ones you’d buy again.",
      href: "/en/notebook",
      value: stats.journalCount,
      valueLabel: stats.journalCount === 1 ? "bottle" : "bottles",
    },
    {
      label: "Favourites",
      title: "What I keep in mind.",
      description:
        "The bottles you’ve saved along the way.",
      href: "/en/favorites",
      value: stats.favoriteCount,
      valueLabel: stats.favoriteCount === 1 ? "favourite" : "favourites",
    },
    {
      label: "Lists",
      title: "What I gather.",
      description:
        "Personal selections for an occasion, a craving or simply for later.",
      href: "/en/lists",
      value: stats.listCount,
      valueLabel: stats.listCount === 1 ? "list" : "lists",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* INTRO */}
      <section>
        <div className="lpv-container grid gap-7 py-10 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-20">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              My space
            </p>

            <h1 className="lpv-display mt-5 text-[clamp(3.9rem,15vw,5rem)] leading-[0.84] md:mt-7 md:text-[clamp(5rem,10vw,9rem)] md:leading-[0.8]">
              My cellar.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-6 md:border-t-0 md:pb-2">
            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Your bottles, your memories and your selections, all in one place.
            </p>

            {!userId ? (
              <Link
                href="/en/sign-in"
                className="lpv-button lpv-button-dark mt-7"
              >
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <CaveNav />

      {userId ? (
        <>
          {/* OVERVIEW */}
          <section className="border-b border-[var(--lpv-line)]">
            <div className="lpv-container py-10 md:py-16">
              <div className="grid gap-7 md:grid-cols-[0.55fr_1fr] md:gap-16">
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    At a glance
                  </p>

                  <h2 className="lpv-display mt-4 text-[2.8rem] leading-[0.9] md:mt-5 md:text-6xl">
                    What you keep here.
                  </h2>
                </div>

                <div className="grid grid-cols-2 border-t border-[var(--lpv-line)] md:grid-cols-4">
                  {[
                    ["Tried", stats.journalCount],
                    ["Favourites", stats.favoriteCount],
                    ["Lists", stats.listCount],
                    ["Buy again", stats.buyAgainCount],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={`py-6 ${
                        index % 2 === 0 ? "pr-5" : "pl-5"
                      } ${
                        index < 2
                          ? "border-b border-[var(--lpv-line)] md:border-b-0"
                          : ""
                      } ${
                        index > 0
                          ? "md:border-l md:border-[var(--lpv-line)] md:pl-6"
                          : ""
                      } md:pr-6`}
                    >
                      <p className="lpv-display text-5xl leading-none md:text-6xl">
                        {value}
                      </p>

                      <p className="mt-3 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SPACES */}
          <section className="lpv-container py-10 md:py-20">
            <div className="border-b border-[var(--lpv-line)] pb-5 md:pb-7">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                In my cellar
              </p>

              <h2 className="lpv-display mt-3 text-[2.8rem] leading-[0.9] md:mt-5 md:text-7xl">
                To come back to.
              </h2>
            </div>

            <div>
              {sections.map((section, index) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group grid gap-5 border-b border-[var(--lpv-line)] py-8 transition-opacity hover:opacity-65 md:grid-cols-[55px_0.8fr_1fr_120px_25px] md:items-center md:gap-8 md:py-10"
                >
                  <span className="text-[0.6rem] font-medium tracking-[0.16em] text-[var(--lpv-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
                      {section.label}
                    </p>

                    <h3 className="lpv-display mt-3 text-[2.35rem] leading-[0.9] md:text-5xl">
                      {section.title}
                    </h3>
                  </div>

                  <p className="max-w-md text-sm leading-7 text-[var(--lpv-muted)]">
                    {section.description}
                  </p>

                  <div className="md:text-right">
                    <p className="lpv-display text-4xl leading-none">
                      {section.value}
                    </p>

                    <p className="mt-2 text-[0.6rem] uppercase tracking-[0.15em] text-[var(--lpv-muted)]">
                      {section.valueLabel}
                    </p>
                  </div>

                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex justify-end pt-7">
              <Link href="/en/preferences" className="lpv-text-link">
                My preferences <span>→</span>
              </Link>
            </div>
          </section>

          {/* BUY AGAIN */}
          {stats.buyAgainCount > 0 ? (
            <section className="border-t border-[var(--lpv-line)]">
              <div className="lpv-container grid gap-7 py-10 md:grid-cols-[1fr_auto] md:items-end md:py-14">
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    Buy again
                  </p>

                  <p className="lpv-display mt-4 max-w-3xl text-[2.8rem] leading-[0.92] md:text-5xl">
                    {stats.buyAgainCount === 1
                      ? "One bottle you want to revisit."
                      : `${stats.buyAgainCount} bottles you want to revisit.`}
                  </p>
                </div>

                <Link href="/en/notebook" className="lpv-text-link">
                  Open notebook <span>→</span>
                </Link>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="lpv-container py-16 text-center md:py-24">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Your personal space
          </p>

          <h2 className="lpv-display mx-auto mt-5 max-w-3xl text-5xl leading-[0.92] md:text-7xl">
            Your cellar starts with one bottle.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
            Sign in to keep your discoveries, notes and lists together.
          </p>
        </section>
      )}
    </main>
  );
}
