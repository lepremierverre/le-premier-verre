import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { placesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Place = {
  _id: string;
  name: string;
  slug: string;
  type?: string;
  city?: string;
  region?: string;
  highlights?: string[];
};

function formatType(value?: string) {
  if (!value) return "Adresse";

  const labels: Record<string, string> = {
    restaurant: "Restaurant",
    "wine-bar": "Bar à vin",
    caviste: "Caviste",
    shop: "Boutique",
    other: "Adresse",
  };

  return labels[value] || value;
}

export default async function PlacesPage() {
  const places = await client.fetch<Place[]>(placesQuery);

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-6 py-10 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Répertoire
            </p>

            <h1 className="lpv-display mt-4 max-w-5xl text-[clamp(4rem,16vw,5rem)] leading-[0.82] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)]">
              Les bonnes
              <br />
              adresses.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-4 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Restaurants, bars à vin, cavistes et endroits où l’on aime
              revenir pour bien boire.
            </p>

            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--lpv-cocoa)] md:mt-7">
              {places.length} adresse{places.length > 1 ? "s" : ""} à découvrir
            </p>
          </div>
        </div>
      </section>

      <section className="lpv-container py-10 md:py-24">
          <div className="grid gap-6 border-b border-[var(--lpv-line)] pb-5 md:grid-cols-[0.65fr_0.35fr] md:items-end md:gap-10 md:pb-6">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Nos repères
              </p>

              <h2 className="lpv-display mt-3 text-[2.8rem] leading-none md:mt-5 md:text-7xl">
                Où aller.
              </h2>
            </div>

            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:justify-self-end md:text-base md:leading-7">
              Des tables, des comptoirs et des caves où le vin fait partie de
              l’expérience.
            </p>
          </div>

          {places.length > 0 ? (
            <div>
              <div className="flex items-center justify-between pt-5 pb-10 md:pt-6 md:pb-14">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                  {places.length} adresse{places.length > 1 ? "s" : ""}
                </p>

              </div>

              <div>
                {places.map((place) => {
                  const location = [place.city, place.region]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <article
                      key={place._id}
                      className="group border-b border-[var(--lpv-line)]"
                    >
                      <Link
                        href={`/bonnes-adresses/${place.slug}`}
                        className="grid gap-5 py-7 transition-opacity group-hover:opacity-60 md:grid-cols-[0.17fr_0.53fr_0.25fr_auto] md:items-center md:gap-8 md:py-10"
                      >
                        <div>
                          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                            {formatType(place.type)}
                          </p>

                          {location ? (
                            <p className="mt-2 text-[0.65rem] uppercase leading-5 tracking-[0.14em] text-[var(--lpv-muted)]">
                              {location}
                            </p>
                          ) : null}
                        </div>

                        <h3 className="lpv-display text-[clamp(2.5rem,10vw,3.3rem)] leading-[0.9] tracking-[-0.035em] md:text-[clamp(2.8rem,4vw,4.8rem)] md:leading-[0.88]">
                          {place.name}
                        </h3>

                        <div>
                          {place.highlights?.length ? (
                            <>
                              <p className="lpv-kicker mb-3 text-[var(--lpv-cocoa)]">
                                Pourquoi on y va
                              </p>

                              <p className="max-w-sm text-sm leading-6 text-[var(--lpv-muted)] md:text-[0.95rem]">
                                {place.highlights.join(" · ")}
                              </p>
                            </>
                          ) : null}
                        </div>

                        <span
                          aria-hidden="true"
                          className="justify-self-end text-2xl transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
        ) : (
          <div className="py-24 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Bientôt
            </p>

            <h2 className="lpv-display mt-6 text-5xl md:text-7xl">
              Les premières adresses arrivent.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
              Notre sélection se construit au fil des découvertes et des
              endroits où l’on a envie de revenir.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
