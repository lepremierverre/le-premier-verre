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
      title: "Ce que j’ai bu.",
      description:
        "Retrouve les bouteilles dégustées, tes impressions et celles que tu rachèterais.",
      href: "/mon-carnet",
      value: stats.journalCount,
      valueLabel: stats.journalCount === 1 ? "bouteille" : "bouteilles",
    },
    {
      label: "Favoris",
      title: "Ce que je garde en tête.",
      description:
        "Les bouteilles mises de côté au fil de tes découvertes.",
      href: "/favoris",
      value: stats.favoriteCount,
      valueLabel: stats.favoriteCount === 1 ? "favori" : "favoris",
    },
    {
      label: "Listes",
      title: "Ce que je rassemble.",
      description:
        "Des sélections personnelles pour une occasion, une envie ou simplement pour plus tard.",
      href: "/mes-listes",
      value: stats.listCount,
      valueLabel: stats.listCount === 1 ? "liste" : "listes",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* INTRO */}
      <section>
        <div className="lpv-container grid gap-7 py-10 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-20">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Mon espace
            </p>

            <h1 className="lpv-display mt-5 text-[clamp(3.9rem,15vw,5rem)] leading-[0.84] md:mt-7 md:text-[clamp(5rem,10vw,9rem)] md:leading-[0.8]">
              Ma cave.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-6 md:border-t-0 md:pb-2">
            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Tes bouteilles, tes souvenirs et tes sélections réunis au même
              endroit.
            </p>

            {!userId ? (
              <Link
                href="/connexion"
                className="lpv-button lpv-button-dark mt-7"
              >
                Se connecter
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <CaveNav />

      {userId ? (
        <>
          {/* APERÇU */}
          <section className="border-b border-[var(--lpv-line)]">
            <div className="lpv-container py-10 md:py-16">
              <div className="grid gap-7 md:grid-cols-[0.55fr_1fr] md:gap-16">
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    En un coup d’œil
                  </p>

                  <h2 className="lpv-display mt-4 text-[2.8rem] leading-[0.9] md:mt-5 md:text-6xl">
                    Ce que tu gardes ici.
                  </h2>
                </div>

                <div className="grid grid-cols-2 border-t border-[var(--lpv-line)] md:grid-cols-4">
                  {[
                    ["Dégustées", stats.journalCount],
                    ["Favoris", stats.favoriteCount],
                    ["Listes", stats.listCount],
                    ["À racheter", stats.buyAgainCount],
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

          {/* ESPACES */}
          <section className="lpv-container py-10 md:py-20">
            <div className="border-b border-[var(--lpv-line)] pb-5 md:pb-7">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Dans ma cave
              </p>

              <h2 className="lpv-display mt-3 text-[2.8rem] leading-[0.9] md:mt-5 md:text-7xl">
                À retrouver.
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
              <Link href="/mes-preferences" className="lpv-text-link">
                Mes préférences <span>→</span>
              </Link>
            </div>
          </section>

          {/* À RACHETER */}
          {stats.buyAgainCount > 0 ? (
            <section className="border-t border-[var(--lpv-line)]">
              <div className="lpv-container grid gap-7 py-10 md:grid-cols-[1fr_auto] md:items-end md:py-14">
                <div>
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    À racheter
                  </p>

                  <p className="lpv-display mt-4 max-w-3xl text-[2.8rem] leading-[0.92] md:text-5xl">
                    {stats.buyAgainCount === 1
                      ? "Une bouteille que tu veux revoir."
                      : `${stats.buyAgainCount} bouteilles que tu veux revoir.`}
                  </p>
                </div>

                <Link href="/mon-carnet" className="lpv-text-link">
                  Ouvrir le carnet <span>→</span>
                </Link>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="lpv-container py-16 text-center md:py-24">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Ton espace personnel
          </p>

          <h2 className="lpv-display mx-auto mt-5 max-w-3xl text-5xl leading-[0.92] md:text-7xl">
            Ta cave commence avec une bouteille.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
            Connecte-toi pour garder tes découvertes, tes notes et tes listes
            au même endroit.
          </p>
        </section>
      )}
    </main>
  );
}
