import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { grapesQuery } from "@/sanity/lib/queries";

type Grape = {
  _id: string;
  name: string;
  slug: string;
  color?: "red" | "white";
  oneLiner?: string;
  body?: number;
  acidity?: number;
  tannins?: number;
};

type GrapesPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

const GRAPES_PER_PAGE = 20;

function colorLabel(color?: string) {
  if (color === "red") return "Rouge";
  if (color === "white") return "Blanc";
  return null;
}

function bodyLabel(body?: number) {
  if (!body) return null;
  if (body <= 2) return "Léger";
  if (body === 3) return "Moyen";
  return "Puissant";
}

export default async function GrapesPage({
  searchParams,
}: GrapesPageProps) {
  const params = (await searchParams) || {};
  const grapes = await client.fetch<Grape[]>(grapesQuery);

  const requestedPage = Number.parseInt(params.page || "1", 10);
  const totalPages = Math.max(1, Math.ceil(grapes.length / GRAPES_PER_PAGE));

  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;

  const startIndex = (currentPage - 1) * GRAPES_PER_PAGE;
  const visibleGrapes = grapes.slice(
    startIndex,
    startIndex + GRAPES_PER_PAGE
  );

  function buildPageUrl(page: number) {
    return page > 1 ? `/cepages?page=${page}` : "/cepages";
  }

  return (
    <main className="bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container py-10 md:py-20">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--lpv-muted)] md:mb-5">
          Référentiel
        </p>

        <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr] md:items-end md:gap-8">
          <div>
            <h1 className="lpv-display text-[3.4rem] leading-[0.92] sm:text-7xl md:text-8xl">
              Cépages
            </h1>

            <p className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:mt-8 md:text-lg md:leading-8">
              Comprendre rapidement ce qu’un cépage apporte dans le verre :
              son style, ses arômes, sa structure et les bouteilles où le découvrir.
            </p>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-4 md:border-t-0 md:border-l md:pl-8 md:pt-0">
            <p className="text-sm leading-6 text-[var(--lpv-muted)]">
              {grapes.length} cépage{grapes.length > 1 ? "s" : ""} dans le répertoire
            </p>
          </div>
        </div>
        </div>
      </section>

      <section className="border-b border-[var(--lpv-line)] bg-[var(--lpv-paper-light)]">
        <div className="lpv-container grid gap-6 py-9 md:grid-cols-[0.38fr_0.62fr] md:items-center md:gap-16 md:py-12">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Comprendre
            </p>

            <h2 className="lpv-display mt-3 max-w-xl text-[2.4rem] leading-[0.95] md:mt-4 md:text-[clamp(2.8rem,3.6vw,4rem)] md:leading-[0.92]">
              Qu’est-ce
              <br />
              qu’un cépage?
            </h2>
          </div>

          <div className="max-w-2xl space-y-3 text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-7">
            <p>
              Un cépage, c’est une variété de raisin utilisée pour faire du vin.
              Chardonnay, Pinot noir, Gamay ou Riesling sont donc des cépages.
            </p>

            <p>
              Chacun possède son propre caractère : certains donnent des vins
              légers et frais, d’autres plus riches, fruités, tanniques ou
              aromatiques. Le climat, le sol et le travail du producteur changent
              ensuite la façon dont ce cépage s’exprime dans le verre.
            </p>
          </div>
        </div>

        </section>

        <section className="lpv-container pb-5 pt-8 md:pb-8 md:pt-12">

        {grapes.length ? (
          <>
            <div>
              {visibleGrapes.map((grape, index) => {
                const grapeColor = colorLabel(grape.color);
                const grapeBody = bodyLabel(grape.body);

                return (
                  <Link
                    key={grape._id}
                    href={`/cepages/${grape.slug}`}
                    className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5 border-b border-[var(--lpv-line)] py-5 transition-opacity hover:opacity-70 md:grid-cols-[70px_1fr_1fr_auto] md:items-center md:gap-5 md:py-8"
                  >
                    <span className="col-span-2 text-[0.68rem] tabular-nums text-[var(--lpv-muted)] md:col-span-1 md:text-xs">
                      {String(startIndex + index + 1).padStart(2, "0")}
                    </span>

                    <div className="col-span-2 md:col-span-1">
                      <h2 className="lpv-display text-[2.35rem] leading-none sm:text-5xl md:text-4xl">
                        {grape.name}
                      </h2>

                      {(grapeColor || grapeBody) && (
                        <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--lpv-muted)] md:mt-3 md:text-xs">
                          {[grapeColor, grapeBody].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2 grid grid-cols-[1fr_auto] items-end gap-5 md:col-span-1 md:block">
                      {grape.oneLiner ? (
                        <p className="max-w-xl text-[0.82rem] leading-[1.4rem] text-[var(--lpv-muted)] md:text-base md:leading-6">
                          {grape.oneLiner}
                        </p>
                      ) : (
                        <p className="text-[0.82rem] italic text-[var(--lpv-muted)] md:text-sm">
                          Fiche à compléter
                        </p>
                      )}
                    </div>

                    <span
                      aria-hidden="true"
                      className="col-start-2 row-start-3 self-end pb-0.5 text-xl transition-transform duration-300 group-hover:translate-x-1 md:col-start-auto md:row-start-auto md:self-center md:pb-0 md:text-2xl"
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination des cépages"
                className="mt-12 flex flex-wrap items-center justify-between gap-6 pb-8"
              >
                <div>
                  {currentPage > 1 ? (
                    <Link
                      href={buildPageUrl(currentPage - 1)}
                      className="lpv-text-link"
                    >
                      ← Précédent
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      ← Précédent
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;

                    return (
                      <Link
                        key={page}
                        href={buildPageUrl(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex h-10 w-10 items-center justify-center border text-sm transition-opacity hover:opacity-60 ${
                          page === currentPage
                            ? "border-[var(--lpv-ink)]"
                            : "border-[var(--lpv-line)]"
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>

                <div>
                  {currentPage < totalPages ? (
                    <Link
                      href={buildPageUrl(currentPage + 1)}
                      className="lpv-text-link"
                    >
                      Suivant →
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      Suivant →
                    </span>
                  )}
                </div>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="border-y border-[var(--lpv-line)] py-14">
            <p className="text-[var(--lpv-muted)]">
              Aucun cépage n’est encore disponible.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
