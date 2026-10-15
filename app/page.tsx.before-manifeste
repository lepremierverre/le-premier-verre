import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { articlesQuery, guidesQuery } from "@/sanity/lib/queries";
import BottleStage from "@/components/wine/BottleStage";

export const revalidate = 60;

type HomeArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageSource;
};

type HomeGuide = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageSource;
  guideType?: string;
  difficulty?: string;
  estimatedReadingTime?: string;
};

type FeaturedWine = {
  name: string;
  slug: string;
  vintage?: number;
  beverageType?: "wine" | "cider";
  alcoholFree?: boolean;
  color?: string;
  bottleImage?: SanityImageSource;
  producer?: {
    name?: string;
  };
};

function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

export default async function HomePage() {
  const homeWines = await client.fetch<FeaturedWine[]>(
    `*[_type == "wine" && published == true] | order(_updatedAt desc)[0...4] {
      name,
      "slug": slug.current,
      vintage,
      beverageType,
      alcoholFree,
      color,
      bottleImage,
      producer->{name}
    }`
  );

  const featuredWine = homeWines[0] ?? null;
  const selectionWines = homeWines.slice(1, 4);

  const articles = await client.fetch<HomeArticle[]>(articlesQuery);
  const featuredArticle = articles[0] ?? null;

  const guides = await client.fetch<HomeGuide[]>(guidesQuery);
  const featuredGuide = guides[0] ?? null;

  const bottleImage = featuredWine?.bottleImage
    ? urlFor(featuredWine.bottleImage)
        .width(900)
        .height(1000)
        .fit("max")
        .url()
    : null;

  const featuredProducer = await client.fetch<{
    name: string;
    slug: string;
    municipality?: string;
    oneLiner?: string;
  } | null>(
    `*[
      _type == "producer" &&
      published == true &&
      lpvPartner == true &&
      defined(slug.current)
    ] | order(_updatedAt desc)[0] {
      name,
      "slug": slug.current,
      municipality,
      oneLiner
    }`
  );

  return (
    <main className="bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
          {/* HERO */}
          <section className="relative min-h-[78vh] overflow-hidden">
            <Photo
              src="/images/lpv/table-vin.jpg"
              alt="Des amis réunis autour d’une table et de bouteilles de vin"
              className="absolute inset-0 grayscale"
            />

            <div className="absolute inset-0 bg-black/38" />

            <div className="lpv-container relative z-10 flex min-h-[78vh] flex-col justify-end pb-12 pt-24 text-[var(--lpv-paper-light)] md:pb-16">
              <p className="lpv-kicker mb-6 text-white/72">
                Le Premier Verre
              </p>

              <h1 className="lpv-display max-w-5xl text-[clamp(4rem,15vw,5.2rem)] md:text-[clamp(4.6rem,11vw,10.5rem)] leading-[0.82]">
                Boire moins
                <br />
                compliqué.
              </h1>

              <div className="mt-8 flex flex-col gap-6 border-t border-white/35 pt-6 md:flex-row md:items-end md:justify-between">
                <p className="max-w-xl text-base leading-7 text-white/82 md:text-lg">
                  Des bouteilles, des producteurs et des endroits qui méritent
                  qu’on s’y attarde.
                </p>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <Link
                    href="/vins"
                    className="lpv-text-link w-fit text-white"
                  >
                    Trouver une bouteille <span>→</span>
                  </Link>

                  <Link
                href="/ce-soir"
                className="lpv-text-link w-fit text-white/75"
              >
                Ce soir, on boit quoi? <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC ÉDITORIAL */}
      <section className="border-y border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-0 py-8 md:grid-cols-2 md:py-[3.5vw]">
          <div className="h-[320px] overflow-hidden sm:h-[380px] md:h-[580px] md:min-h-0">
            <Photo
              src="/images/lpv/bouteille-ce-soir.jpg"
              alt="Moment de table autour du vin"
              className="transition duration-700 hover:scale-[1.015]"
            />
          </div>

          <div className="flex flex-col border-t border-[var(--lpv-line)] px-0 py-8 md:border-l md:border-t-0 md:px-12 md:py-12 lg:px-16">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Commencer ici
              </p>

              <h2 className="lpv-display mt-5 text-[clamp(3.15rem,13vw,4rem)] leading-[0.9] md:mt-8 md:text-[clamp(3.7rem,6vw,6.5rem)]">
                Une bouteille
                <br />
                pour ce soir.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--lpv-muted)] md:mt-8 md:leading-8">
                Choisis selon le repas, l’ambiance ou simplement l’envie du
                moment. Pas besoin de connaître tous les mots.
              </p>
            </div>

            <div className="mt-8 border-t border-[var(--lpv-line)] pt-5 md:mt-10 md:pt-6">
              <Link href="/ce-soir" className="lpv-text-link w-fit">
                Ce soir, on boit quoi? <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SÉLECTION DU MOMENT */}
      <section className="lpv-container py-12 md:pb-28 md:pt-20">
        <div className="mb-7 flex flex-col gap-5 border-b border-[var(--lpv-line)] pb-5 md:mb-10 md:gap-6 md:pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Sélection du moment
            </p>

            <h2 className="lpv-display mt-4 max-w-4xl text-[clamp(2.8rem,11.5vw,3.65rem)] leading-[0.92] md:mt-6 md:text-[clamp(3.6rem,6vw,6.5rem)] md:leading-[0.9]">
              Trois bouteilles qu’on ouvrirait maintenant.
            </h2>
          </div>

          <Link href="/vins" className="lpv-text-link w-fit">
            Voir toute la sélection <span>→</span>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {selectionWines.map((wine) => {
            const image = wine.bottleImage
              ? urlFor(wine.bottleImage)
                  .ignoreImageParams()
                  .width(900)
                  .height(1000)
                  .fit("max")
                  .url()
              : null;

            return (
              <Link
                key={wine.slug}
                href={`/vins/${wine.slug}`}
                className="group md:flex md:h-full md:flex-col"
              >
                <div className="h-[300px] sm:h-[340px] md:h-[430px]">
                  <BottleStage
                    image={wine.bottleImage}
                    alt={wine.name}
                    color={wine.beverageType === "cider" ? undefined : wine.color}
                    variant="card"
                    className="!h-[300px] [&>div]:!h-[260px] [&_img]:!max-w-[72%] sm:!h-[340px] sm:[&>div]:!h-[300px] md:!h-[430px] md:[&>div]:!h-[390px] md:[&_img]:!max-h-[390px] md:[&_img]:!max-w-[68%] transition duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="border-t border-[var(--lpv-line)] pt-4 md:flex md:flex-1 md:flex-col md:pt-5">
                  <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                    {[
                      wine.beverageType === "cider"
                        ? "Cidre"
                        : wine.color || "Vin",
                      wine.alcoholFree ? "Sans alcool" : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <h3 className="lpv-display mt-3 text-[2rem] leading-[0.95] md:mt-4 md:text-3xl">
                    {wine.name}
                  </h3>

                  {wine.producer?.name ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--lpv-muted)] md:mt-3">
                      {wine.producer.name}
                      {wine.vintage ? ` · ${wine.vintage}` : ""}
                    </p>
                  ) : null}

                  <span className="lpv-text-link mt-4 md:mt-auto md:pt-5">
                    Voir la bouteille <span>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SANS ALCOOL */}
      <section className="border-t border-[var(--lpv-line)]">
        <div className="lpv-container py-12 md:pb-16 md:pt-24">
          <div className="grid gap-8 md:grid-cols-[0.58fr_0.42fr] md:items-stretch md:gap-12 lg:gap-16">
            <div className="md:flex md:flex-col md:justify-center md:py-6">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Sans alcool
              </p>

              <h2 className="lpv-display mt-5 max-w-[8em] text-[clamp(3.5rem,12vw,4.5rem)] leading-[0.9] md:mt-7 md:text-[clamp(4rem,5vw,5.8rem)]">
                Ce qu’il y a
                <br />
                dans le verre.
              </h2>

              <div className="mt-8 max-w-2xl md:mt-9">
                <p className="text-base leading-8 text-[var(--lpv-muted)]">
                  Ce qu’on aime dans une bouteille va bien au-delà de l’alcool.
                  Il y a le goût, la matière, l’équilibre, le travail, le lieu et
                  les gens derrière ce qu’on boit.
                </p>

                <p className="mt-5 text-base leading-8 text-[var(--lpv-muted)]">
                  Certaines bouteilles sans alcool sont simplement bonnes,
                  précises, travaillées — et méritent leur place à table.
                </p>

                <div className="mt-8">
                  <Link href="/sans-alcool" className="lpv-text-link w-fit">
                    Découvrir le sans-alcool <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="h-[300px] overflow-hidden sm:h-[380px] md:h-[540px]">
              <Photo
                src="/images/lpv/DSCF2438.jpg"
                alt="Raisins dans les vignes"
                className="object-cover saturate-[0.72] brightness-[0.9] contrast-[0.96] transition duration-700 hover:scale-[1.015]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTEUR PARTENAIRE */}
      {featuredProducer && (
        <section className="border-t border-[var(--lpv-line)]">
          <div className="lpv-container py-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-[0.34fr_0.66fr] md:gap-16">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Producteur partenaire
              </p>

              <div>
                <h2 className="lpv-display text-[clamp(3rem,12vw,4rem)] leading-[0.9] md:text-[clamp(3.6rem,5vw,5.8rem)]">
                  {featuredProducer.name}
                </h2>

                {featuredProducer.municipality ? (
                  <p className="lpv-kicker mt-5 text-[var(--lpv-cocoa)]">
                    {featuredProducer.municipality}
                  </p>
                ) : null}

                {featuredProducer.oneLiner ? (
                  <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--lpv-muted)] md:leading-8">
                    {featuredProducer.oneLiner}
                  </p>
                ) : null}

                <div className="mt-8 border-t border-[var(--lpv-line)] pt-5 md:mt-10 md:pt-6">
                  <Link
                    href={`/producteurs/${featuredProducer.slug}`}
                    className="lpv-text-link w-fit"
                  >
                    Découvrir le producteur <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GUIDE DU MOMENT */}
      <section className="border-t border-[var(--lpv-line)]">
        <div className="lpv-container pb-10 pt-0 md:pb-0 md:pt-0">
          {featuredGuide ? (
            <div className="grid gap-8 md:grid-cols-[0.78fr_1.22fr] md:items-center md:gap-12 lg:gap-16">
              <div className="md:pr-6">
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Guide du moment
                </p>

                <h2 className="lpv-display mt-4 text-[clamp(2.8rem,11vw,3.5rem)] leading-[0.92] md:mt-6 md:text-[clamp(3.5rem,4.8vw,5.4rem)] md:leading-[0.9]">
                  {featuredGuide.title}
                </h2>

                <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)] md:mt-6">
                  {featuredGuide.guideType ? (
                    <span>{featuredGuide.guideType.replace(/[-_]/g, " ")}</span>
                  ) : null}

                  {featuredGuide.estimatedReadingTime ? (
                    <span>· {featuredGuide.estimatedReadingTime}</span>
                  ) : null}
                </div>

                {featuredGuide.excerpt ? (
                  <p className="mt-5 max-w-lg text-base leading-7 text-[var(--lpv-muted)] md:mt-7 md:leading-8">
                    {featuredGuide.excerpt}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--lpv-line)] pt-6 md:mt-10">
                  <Link
                    href={`/guides/${featuredGuide.slug}`}
                    className="lpv-text-link w-fit"
                  >
                    Lire le guide <span>→</span>
                  </Link>

                  <Link href="/guides" className="lpv-text-link w-fit">
                    Tous les guides <span>→</span>
                  </Link>
                </div>
              </div>

              <Link
                href={`/guides/${featuredGuide.slug}`}
                className="group block overflow-hidden bg-[var(--lpv-paper-light)]"
              >
                {featuredGuide.coverImage ? (
                  <img
                    src={urlFor(featuredGuide.coverImage)
                      .width(1400)
                      .height(1000)
                      .fit("crop")
                      .url()}
                    alt={featuredGuide.title}
                    className="aspect-[16/10] h-full w-full object-cover transition duration-700 group-hover:scale-[1.015] md:aspect-[7/5]"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center md:aspect-[7/5]">
                    <p className="lpv-kicker text-[var(--lpv-muted)]">
                      Image à venir
                    </p>
                  </div>
                )}
              </Link>
            </div>
          ) : (
              <div className="pt-6 md:pt-8">
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  Guides
                </p>

                <div className="mx-auto max-w-3xl py-10 md:translate-x-12 md:py-14 lg:translate-x-16">
                  <h2 className="lpv-display text-[clamp(2.8rem,11vw,3.5rem)] leading-[0.92] md:text-[clamp(3.7rem,5vw,5.8rem)] md:leading-[0.9]">
                    Les premiers guides
                    <br className="hidden md:block" />
                    arrivent bientôt.
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-[var(--lpv-muted)] md:mt-7 md:leading-8">
                    Des repères simples sur les régions, les cépages, les accords
                    et les bases du vin sont en préparation.
                  </p>

                  <Link href="/guides" className="lpv-text-link mt-6 w-fit md:mt-8">
                    Découvrir les guides <span>→</span>
                  </Link>
                </div>
              </div>
          )}
        </div>
      </section>

      {/* ARTICLE À LA UNE */}
      {featuredArticle && (
        <section className="lpv-container border-t border-[var(--lpv-line)] pb-12 pt-6 md:pb-28 md:pt-8">
          <div className="mb-7 flex items-end justify-between md:mb-8">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Le journal
            </p>

            <Link href="/blog" className="lpv-text-link hidden sm:inline-flex">
              Tous les articles <span>→</span>
            </Link>
          </div>

          <Link
            href={`/blog/${featuredArticle.slug}`}
            className="group grid gap-8 md:grid-cols-[1.08fr_0.92fr] md:items-start md:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
          >
            <div className="overflow-hidden bg-[var(--lpv-paper-light)]">
              {featuredArticle.coverImage ? (
                <img
                  src={urlFor(featuredArticle.coverImage)
                    .width(1500)
                    .height(1000)
                    .fit("crop")
                    .url()}
                  alt={featuredArticle.title}
                  className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                />
              ) : (
                <div className="flex aspect-[3/2] items-center justify-center">
                  <p className="text-sm text-[var(--lpv-muted)]">
                    Image à venir
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:pt-4">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Article à la une
              </p>

              <h2 className="lpv-display mt-4 text-[clamp(2.6rem,10.5vw,3.35rem)] leading-[0.92] md:mt-6 md:max-w-[9.5em] md:text-[clamp(2.9rem,4.2vw,4.9rem)]">
                {featuredArticle.title}
              </h2>

              {featuredArticle.excerpt && (
                <p className="mt-7 max-w-lg text-base leading-8 text-[var(--lpv-muted)]">
                  {featuredArticle.excerpt}
                </p>
              )}

              <span className="lpv-text-link mt-9 w-fit">
                Lire l’article <span>→</span>
              </span>
            </div>
          </Link>
        </section>
      )}

        {/* EXPLORER LES BOUTEILLES */}
        <section className="border-t border-[var(--lpv-line)]">
          <div className="lpv-container py-10 md:py-14">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Explorer
            </p>

            <div className="mt-7 grid gap-6 md:mt-9 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16">
              <h2 className="lpv-display max-w-4xl text-[clamp(3.4rem,5.5vw,6rem)] leading-[0.9]">
                Trouver la bonne bouteille.
              </h2>

              <p className="max-w-lg text-base leading-8 text-[var(--lpv-muted)] md:pb-1">
                Par couleur, par envie, par budget ou simplement selon le moment.
                Commence là où ça te parle.
              </p>
            </div>

            <div className="mt-10 grid border-t border-[var(--lpv-line)] md:mt-12 md:grid-cols-3">
              {[
                ["Rouges", "/vins?color=rouge"],
                ["Blancs", "/vins?color=blanc"],
                ["Rosés", "/vins?color=rose"],
                ["Bulles", "/vins?color=bulles"],
                ["Cidres", "/vins?type=cider"],
                ["Sans alcool", "/sans-alcool"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center border-b border-[var(--lpv-line)] py-5 md:min-h-[92px] md:px-5 md:py-6 md:[&:not(:nth-child(3n))]:border-r"
                >
                  <span className="lpv-display flex-1 text-[1.75rem] leading-none md:text-[2.25rem]">
                    {label}
                  </span>

                  <span className="ml-4 text-sm transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
              <Link href="/vins" className="lpv-text-link">
                Voir toutes les bouteilles <span>→</span>
              </Link>

              <Link href="/ce-soir" className="lpv-text-link">
                Choisir pour ce soir <span>→</span>
              </Link>
            </div>
          </div>
        </section>

      {/* NEWSLETTER */}
      <section className="bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)]">
        <div className="lpv-container grid gap-0 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
          <div className="overflow-hidden">
            <Photo
              src="/images/lpv/infolettre.jpg"
              alt="Paysage viticole du Premier Verre"
              className="aspect-[4/5]"
            />
          </div>

          <div className="flex flex-col justify-center border-white/20 pt-10 md:border-l md:px-14 md:pt-0 lg:px-20">
            <p className="lpv-kicker text-white/55">
              L’infolettre
            </p>

            <h2 className="lpv-display mt-8 max-w-3xl text-[clamp(4rem,7vw,7.5rem)] leading-[0.86]">
              Avant le
              <br />
              week-end.
            </h2>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/68">
              Une bouteille, une adresse et une idée à garder sous la main.
            </p>

            <Link
              href="/newsletter"
              className="lpv-text-link mt-10 w-fit text-white"
            >
              S’inscrire <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
