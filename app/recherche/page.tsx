import Link from "next/link";

import { searchSanity } from "@/lib/search/server-search";
import AnalyticsEvent from "@/components/analytics/AnalyticsEvent";
import type { SearchResult } from "@/types/search";
import {
  buildSearchHref,
  getSearchTypeLabel,
} from "@/lib/search/search-utils";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const typeOrder: SearchResult["_type"][] = [
  "wine",
  "producer",
  "region",
  "country",
  "grape",
  "article",
  "guide",
];

const typeLabels: Record<SearchResult["_type"], string> = {
  wine: "Bouteilles",
  producer: "Producteurs",
  country: "Pays",
  region: "Régions",
  grape: "Cépages",
  article: "Journal",
  guide: "Guides",
};

async function getResults(q: string): Promise<SearchResult[]> {
  return searchSanity(q, "fr", 50);
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = await getResults(query);

  const grouped = results.reduce<
    Partial<Record<SearchResult["_type"], SearchResult[]>>
  >((accumulator, result) => {
    accumulator[result._type] ||= [];
    accumulator[result._type]!.push(result);
    return accumulator;
  }, {});

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {query.length >= 2 ? (
        <AnalyticsEvent
          eventName="search_performed"
          data={{
            searchQuery: query,
            sourceType: "global_search_fr",
          }}
        />
      ) : null}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-10 py-16 md:grid-cols-[0.68fr_0.32fr] md:items-end md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Bibliothèque
            </p>

            <h1 className="lpv-display mt-7 text-[clamp(4.8rem,10vw,10rem)] leading-[0.82]">
              Rechercher.
            </h1>
          </div>

          <p className="max-w-md text-base leading-8 text-[var(--lpv-muted)]">
            Explore les bouteilles, les producteurs, les régions, les cépages, les
            guides et les articles du Premier Verre.
          </p>
        </div>
      </section>

      <section className="lpv-container py-12 md:py-16">
        <form method="GET" action="/recherche">
          <label
            htmlFor="search-page-input"
            className="lpv-kicker text-[var(--lpv-cocoa)]"
          >
            Que cherches-tu?
          </label>

          <div className="mt-7 flex flex-col gap-6 border-y border-[var(--lpv-line)] py-7 md:flex-row md:items-center">
            <input
              id="search-page-input"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Bouteille, producteur, région…"
              autoComplete="off"
              className="lpv-display min-w-0 flex-1 border-0 bg-transparent py-2 text-[clamp(3rem,6vw,6rem)] leading-[0.95] outline-none placeholder:text-[var(--lpv-muted)]/35"
            />

            <button type="submit" className="lpv-button lpv-button-dark">
              Rechercher
            </button>
          </div>
        </form>
      </section>

      {!query ? (
        <section className="lpv-container pb-24 md:pb-32">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Commencer
          </p>

          <h2 className="lpv-display mt-6 max-w-4xl text-5xl leading-[0.9] md:text-7xl">
            Toute la bibliothèque.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
            Recherche une bouteille, un producteur, une région, un cépage, un guide ou
            un article.
          </p>
        </section>
      ) : (
        <section className="border-t border-[var(--lpv-line)]">
          <div className="lpv-container flex flex-col gap-5 py-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Résultats
              </p>

              <h2 className="lpv-display mt-5 text-5xl leading-[0.9] md:text-7xl">
                « {query} »
              </h2>
            </div>

            <p className="text-xs uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="lpv-container border-t border-[var(--lpv-line)] py-20 md:py-28">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Aucun résultat
              </p>

              <h3 className="lpv-display mt-6 max-w-3xl text-5xl leading-[0.9] md:text-7xl">
                Rien dans la bibliothèque.
              </h3>

              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
                Essaie avec une bouteille, un producteur, une région ou un terme
                plus général.
              </p>
            </div>
          ) : (
            <div className="border-t border-[var(--lpv-line)]">
              {typeOrder.map((type) => {
                const items = grouped[type];

                if (!items?.length) return null;

                return (
                  <section
                    key={type}
                    className="lpv-container grid border-b border-[var(--lpv-line)] md:grid-cols-[0.25fr_0.75fr]"
                  >
                    <div className="py-7 md:pr-10">
                      <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                        {typeLabels[type]}
                      </p>
                    </div>

                    <div className="border-t border-[var(--lpv-line)] md:border-l md:border-t-0">
                      {items.map((item, index) => (
                        <Link
                          key={item._id}
                          href={buildSearchHref(item)}
                          className="group grid grid-cols-[42px_1fr_24px] items-center gap-4 border-b border-[var(--lpv-line)] px-0 py-7 transition-opacity last:border-b-0 hover:opacity-55 md:px-8"
                        >
                          <span className="text-[0.6rem] tracking-[0.16em] text-[var(--lpv-muted)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                              {getSearchTypeLabel(item._type)}
                            </p>

                            <h3 className="lpv-display mt-3 text-3xl leading-[0.92] md:text-4xl">
                              {item.title}
                            </h3>
                          </div>

                          <span className="text-xl transition-transform duration-500 group-hover:translate-x-1">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
