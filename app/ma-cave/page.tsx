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

export default async function MaCavePage() {
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
      label: "Carnet",
      description: "Les bouteilles que tu as bues et les notes que tu veux garder.",
      href: "/mon-carnet",
      value: stats.journalCount,
      valueLabel: stats.journalCount === 1 ? "bouteille" : "bouteilles",
    },
    {
      label: "Favoris",
      description: "Les bouteilles que tu veux retrouver.",
      href: "/favoris",
      value: stats.favoriteCount,
      valueLabel: stats.favoriteCount === 1 ? "favori" : "favoris",
    },

  ];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container py-12 md:py-20">
        <div className="max-w-[900px]">
          <h1 className="lpv-display text-[clamp(4rem,9vw,8rem)] leading-[0.84] tracking-[-0.045em]">
            Ma cave.
          </h1>

          <p className="mt-7 max-w-xl text-[16px] leading-7 text-[var(--lpv-ink)] md:text-[17px]">
            Les bouteilles que tu as bues, aimées ou mises de côté.
          </p>

          {!userId ? (
            <Link
              href="/connexion"
              className="mt-8 inline-flex items-center gap-3 text-[14px] font-medium transition-opacity hover:opacity-50"
            >
              Se connecter <span>→</span>
            </Link>
          ) : null}
        </div>
      </section>

      <CaveNav />

      {userId ? (
        <>
          <section className="lpv-container">
            <div className="flex flex-wrap gap-x-7 gap-y-2 py-6 text-[13px] text-[var(--lpv-muted)]">
              <span>
                <strong className="font-medium text-[var(--lpv-ink)]">
                  {stats.journalCount}
                </strong>{" "}
                dégustée{stats.journalCount !== 1 ? "s" : ""}
              </span>

              <span>
                <strong className="font-medium text-[var(--lpv-ink)]">
                  {stats.favoriteCount}
                </strong>{" "}
                favori{stats.favoriteCount !== 1 ? "s" : ""}
              </span>

              <span>
                <strong className="font-medium text-[var(--lpv-ink)]">
                  {stats.listCount}
                </strong>{" "}
                liste{stats.listCount !== 1 ? "s" : ""}
              </span>

              {stats.buyAgainCount > 0 ? (
                <span>
                  <strong className="font-medium text-[var(--lpv-ink)]">
                    {stats.buyAgainCount}
                  </strong>{" "}
                  à racheter
                </span>
              ) : null}
            </div>
          </section>

          <section className="lpv-container py-8 md:py-14">
            <div className="border-t border-[var(--lpv-line)]">
              {sections.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group grid gap-4 border-b border-[var(--lpv-line)] py-7 transition-opacity hover:opacity-55 md:grid-cols-[340px_1fr_auto_24px] md:items-center md:gap-9 md:py-9"
                >
                  <h2 className="lpv-display text-[clamp(2.2rem,4vw,3.7rem)] leading-[0.9] tracking-[-0.025em]">
                    {section.label}
                  </h2>

                  <p className="max-w-md text-[15px] leading-6 text-[var(--lpv-ink)]">
                    {section.description}
                  </p>

                  <p className="text-[13px] text-[var(--lpv-muted)] md:text-right">
                    <span className="text-[var(--lpv-ink)]">
                      {section.value}
                    </span>{" "}
                    {section.valueLabel}
                  </p>

                  <span
                    aria-hidden="true"
                    className="text-base transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {stats.buyAgainCount > 0 ? (
            <section className="lpv-container pb-14 md:pb-20">
              <div className="flex flex-col gap-4 border-b border-[var(--lpv-line)] py-7 md:flex-row md:items-center md:justify-between">
                <p className="text-[15px] text-[var(--lpv-ink)]">
                  {stats.buyAgainCount === 1
                    ? "Une bouteille à racheter."
                    : `${stats.buyAgainCount} bouteilles à racheter.`}
                </p>

                <Link
                  href="/mon-carnet"
                  className="inline-flex w-fit items-center gap-3 text-[14px] font-medium transition-opacity hover:opacity-50"
                >
                  Voir dans le carnet <span>→</span>
                </Link>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="lpv-container py-14 md:py-20">
          <div className="max-w-xl border-t border-[var(--lpv-line)] pt-7">
            <p className="text-[16px] leading-7 text-[var(--lpv-ink)]">
              Connecte-toi pour retrouver tes dégustations, tes favoris et tes listes.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
