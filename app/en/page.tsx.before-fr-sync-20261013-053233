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
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
  coverImage?: SanityImageSource;
};

type HomeGuide = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
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
              alt="Friends gathered around a table with bottles of wine"
              className="absolute inset-0 grayscale"
            />

            <div className="absolute inset-0 bg-black/38" />

            <div className="lpv-container relative z-10 flex min-h-[78vh] flex-col justify-end pb-12 pt-24 text-[var(--lpv-paper-light)] md:pb-16">
              <p className="lpv-kicker mb-6 text-white/72">
                Le Premier Verre
              </p>

              <h1 className="lpv-display max-w-5xl text-[clamp(4rem,15vw,5.2rem)] md:text-[clamp(4.6rem,11vw,10.5rem)] leading-[0.82]">
                Wine made
                <br />
                simpler.
              </h1>

              <div className="mt-8 flex flex-col gap-6 border-t border-white/35 pt-6 md:flex-row md:items-end md:justify-between">
                <p className="max-w-xl text-base leading-7 text-white/82 md:text-lg">
                  Bottles, producers and places worth taking the time
                  to discover.
                </p>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <Link
                    href="/en/wines"
                    className="lpv-text-link w-fit text-white"
                  >
                    Find a bottle <span>→</span>
                  </Link>

                  <Link
                href="/en/tonight"
                className="lpv-text-link w-fit text-white/75"
              >
                What are we drinking tonight? <span>→</span>
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
              alt="A moment around the table and wine"
              className="transition duration-700 hover:scale-[1.015]"
            />
          </div>

          <div className="flex flex-col border-t border-[var(--lpv-line)] px-0 py-8 md:border-l md:border-t-0 md:px-12 md:py-12 lg:px-16">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Start here
              </p>

              <h2 className="lpv-display mt-5 text-[clamp(3.15rem,13vw,4rem)] leading-[0.9] md:mt-8 md:text-[clamp(3.7rem,6vw,6.5rem)]">
                A bottle
                <br />
                for tonight.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--lpv-muted)] md:mt-8 md:leading-8">
                Choose by the meal, the mood or simply what you feel like
                tonight. No need to know all the terminology.
              </p>
            </div>

            <div className="mt-8 border-t border-[var(--lpv-line)] pt-5 md:mt-10 md:pt-6">
              <Link href="/en/tonight" className="lpv-text-link w-fit">
                What are we drinking tonight? <span>→</span>
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
              Current selection
            </p>

            <h2 className="lpv-display mt-4 max-w-4xl text-[clamp(2.8rem,11.5vw,3.65rem)] leading-[0.92] md:mt-6 md:text-[clamp(3.6rem,6vw,6.5rem)] md:leading-[0.9]">
              Three bottles we would open right now.
            </h2>
          </div>

          <Link href="/en/wines" className="lpv-text-link w-fit">
            See the full selection <span>→</span>
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
                href={`/en/wines/${wine.slug}`}
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
                        ? "Cider"
                        : wine.color || "Wine",
                      wine.alcoholFree ? "Alcohol-free" : null,
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
                    View the bottle <span>→</span>
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
                Alcohol-free
              </p>

              <h2 className="lpv-display mt-5 max-w-[8em] text-[clamp(3.5rem,12vw,4.5rem)] leading-[0.9] md:mt-7 md:text-[clamp(4rem,5vw,5.8rem)]">
                What’s in
                <br />
                the glass.
              </h2>

              <div className="mt-8 max-w-2xl md:mt-9">
                <p className="text-base leading-8 text-[var(--lpv-muted)]">
                  What we love in a bottle goes far beyond alcohol. There is taste,
                  texture, balance, craft, place and the people behind what we drink.
                </p>

                <p className="mt-5 text-base leading-8 text-[var(--lpv-muted)]">
                  Some alcohol-free bottles are simply good, precise and thoughtfully
                  made — and deserve a place at the table.
                </p>

                <div className="mt-8">
                  <Link href="/en/alcohol-free" className="lpv-text-link w-fit">
                    Explore alcohol-free <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="h-[300px] overflow-hidden sm:h-[380px] md:h-[540px]">
              <Photo
                src="/images/lpv/DSCF2438.jpg"
                alt="Grapes in the vineyard"
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
                Partner producer
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
                    href={`/en/producers/${featuredProducer.slug}`}
                    className="lpv-text-link w-fit"
                  >
                    Discover the producer <span>→</span>
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
                  Featured guide
                </p>

                <h2 className="lpv-display mt-4 text-[clamp(2.8rem,11vw,3.5rem)] leading-[0.92] md:mt-6 md:text-[clamp(3.5rem,4.8vw,5.4rem)] md:leading-[0.9]">
                  {featuredGuide.titleEn || featuredGuide.title}
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
                    {featuredGuide.excerptEn || featuredGuide.excerpt}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--lpv-line)] pt-6 md:mt-10">
                  <Link
                    href={`/en/guides/${featuredGuide.slug}`}
                    className="lpv-text-link w-fit"
                  >
                    Read the guide <span>→</span>
                  </Link>

                  <Link href="/en/guides" className="lpv-text-link w-fit">
                    All guides <span>→</span>
                  </Link>
                </div>
              </div>

              <Link
                href={`/en/guides/${featuredGuide.slug}`}
                className="group block overflow-hidden bg-[var(--lpv-paper-light)]"
              >
                {featuredGuide.coverImage ? (
                  <img
                    src={urlFor(featuredGuide.coverImage)
                      .width(1400)
                      .height(1000)
                      .fit("crop")
                      .url()}
                    alt={featuredGuide.titleEn || featuredGuide.title}
                    className="aspect-[16/10] h-full w-full object-cover transition duration-700 group-hover:scale-[1.015] md:aspect-[7/5]"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center md:aspect-[7/5]">
                    <p className="lpv-kicker text-[var(--lpv-muted)]">
                      Image coming soon
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
                    The first guides
                    <br className="hidden md:block" />
                    are coming soon.
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-[var(--lpv-muted)] md:mt-7 md:leading-8">
                    Simple guides to regions, grapes, pairings and the basics of wine
                    are on the way.
                  </p>

                  <Link href="/en/guides" className="lpv-text-link mt-6 w-fit md:mt-8">
                    Explore the guides <span>→</span>
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
              Journal
            </p>

            <Link href="/en/journal" className="lpv-text-link hidden sm:inline-flex">
              All articles <span>→</span>
            </Link>
          </div>

          <Link
            href={`/en/journal/${featuredArticle.slug}`}
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
                  alt={featuredArticle.titleEn || featuredArticle.title}
                  className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                />
              ) : (
                <div className="flex aspect-[3/2] items-center justify-center">
                  <p className="text-sm text-[var(--lpv-muted)]">
                    Image coming soon
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:pt-4">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Featured article
              </p>

              <h2 className="lpv-display mt-4 text-[clamp(2.6rem,10.5vw,3.35rem)] leading-[0.92] md:mt-6 md:max-w-[9.5em] md:text-[clamp(2.9rem,4.2vw,4.9rem)]">
                {featuredArticle.titleEn || featuredArticle.title}
              </h2>

              {(featuredArticle.excerptEn || featuredArticle.excerpt) && (
                <p className="mt-7 max-w-lg text-base leading-8 text-[var(--lpv-muted)]">
                  {featuredArticle.excerptEn || featuredArticle.excerpt}
                </p>
              )}

              <span className="lpv-text-link mt-9 w-fit">
                Read the article <span>→</span>
              </span>
            </div>
          </Link>
        </section>
      )}

        {/* EXPLORER LES BOUTEILLES */}
        <section className="border-t border-[var(--lpv-line)]">
          <div className="lpv-container py-10 md:py-14">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Explore
            </p>

            <div className="mt-7 grid gap-6 md:mt-9 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16">
              <h2 className="lpv-display max-w-4xl text-[clamp(3.4rem,5.5vw,6rem)] leading-[0.9]">
                Find the right bottle.
              </h2>

              <p className="max-w-lg text-base leading-8 text-[var(--lpv-muted)] md:pb-1">
                By colour, mood, budget or simply the moment.
                Start wherever feels right.
              </p>
            </div>

            <div className="mt-10 grid border-t border-[var(--lpv-line)] md:mt-12 md:grid-cols-3">
              {[
                ["Rouges", "/vins?color=rouge"],
                ["Blancs", "/vins?color=blanc"],
                ["Rosés", "/vins?color=rose"],
                ["Bulles", "/vins?color=bulles"],
                ["Cidres", "/vins?type=cider"],
                ["Alcohol-free", "/sans-alcool"],
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
              <Link href="/en/wines" className="lpv-text-link">
                View all bottles <span>→</span>
              </Link>

              <Link href="/en/tonight" className="lpv-text-link">
                Choose for tonight <span>→</span>
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
              alt="Le Premier Verre wine country landscape"
              className="aspect-[4/5]"
            />
          </div>

          <div className="flex flex-col justify-center border-white/20 pt-10 md:border-l md:px-14 md:pt-0 lg:px-20">
            <p className="lpv-kicker text-white/55">
              Newsletter
            </p>

            <h2 className="lpv-display mt-8 max-w-3xl text-[clamp(4rem,7vw,7.5rem)] leading-[0.86]">
              Before the
              <br />
              weekend.
            </h2>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/68">
              A bottle, une adresse et une idée à garder sous la main.
            </p>

            <Link
              href="/en/newsletter"
              className="lpv-text-link mt-10 w-fit text-white"
            >
              Subscribe <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
