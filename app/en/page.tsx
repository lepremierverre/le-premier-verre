import Link from"next/link";
import type { SanityImageSource } from"@sanity/image-url";

import { client } from"@/sanity/lib/client";
import { urlFor } from"@/sanity/lib/image";
import { articlesQuery, guidesQuery } from"@/sanity/lib/queries";
import BottleStage from"@/components/wine/BottleStage";
import LpvReveal from"@/components/editorial/LpvReveal";

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
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageSource;
  guideType?: string;
  difficulty?: string;
  estimatedReadingTime?: string;
};

type HomePlace = {
  _id: string;
  name: string;
  slug: string;
  type?: string;
  city?: string;
  region?: string;
  highlights?: string[];
  coverImage?: SanityImageSource;
  lpvPartner?: boolean;
  mediaPermissionStatus?: string;
};

type FeaturedWine = {
  name: string;
  slug: string;
  vintage?: number;
  beverageType?:"wine" |"cider";
  alcoholFree?: boolean;
  color?: string;
  bottleImage?: SanityImageSource;
  editorialImage?: SanityImageSource;
  producer?: {
    _id?: string;
    name?: string;
  };
};

function Photo({
  src,
  alt,
  className ="",
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
    `*[_type =="wine" && published == true] | order(_updatedAt desc)[0...4] {
      name,"slug": slug.current,
      vintage,
      beverageType,
      alcoholFree,
      color,
      bottleImage,
      editorialImage,
      producer->{name}
    }`
  );

  const featuredWine = homeWines[0] ?? null;

  const partnerWines = await client.fetch<FeaturedWine[]>(
    `*[
      _type =="wine" &&
      published == true &&
      producer->lpvPartner == true
    ] | order(_updatedAt desc) {
      name,"slug": slug.current,
      vintage,
      beverageType,
      alcoholFree,
      color,
      bottleImage,
      editorialImage,
      producer->{_id, name}
    }`
  );

  const seenProducers = new Set<string>();

  const selectionWines = partnerWines.filter((wine) => {
    const producerId = wine.producer?._id;

    if (!producerId || seenProducers.has(producerId)) {
      return false;
    }

    seenProducers.add(producerId);
    return true;
  }).slice(0, 3);

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
    heroImage?: SanityImageSource;
  } | null>(
    `*[
      _type =="producer" &&
   (
     lower(name) match"*bergeville*" ||
     slug.current match"*bergeville*"
   ) &&
      published == true &&
      lpvPartner == true &&
      defined(slug.current)
    ] | order(_updatedAt desc)[0] {
      name,"slug": slug.current,
      municipality,
      oneLiner,
      heroImage
    }`
  );

  const featuredPlace = await client.fetch<HomePlace | null>(
    `*[
      _type =="place" &&
      published == true &&
      defined(slug.current) &&
      (
        lower(name) match"*saucette*" ||
        slug.current match"*saucette*"
      )
    ][0] {
      _id,
      name,"slug": slug.current,
      type,
      city,
      region,
      highlights,
      lpvPartner,
      mediaPermissionStatus,

      coverImage
    }`
  );

  return (
    <main className="bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
          {/* HERO */}
          <section className="lpv-home-hero relative min-h-[78vh] overflow-hidden">
            <Photo
              src="/images/lpv/table-vin.jpg"
              alt="Des amis réunis autour d’une table et de bouteilles de vin"
              className="absolute inset-0 grayscale"
            />

            <div className="absolute inset-0 bg-black/38" />

            <div className="lpv-home-hero-inner lpv-container relative z-10 flex min-h-[78vh] flex-col justify-end pb-10 pt-24 text-[var(--lpv-paper-light)] md:pb-10">
              <p className="lpv-home-hero-kicker lpv-kicker mb-6 text-white/72">
                Le Premier Verre
              </p>

              <h1 className="lpv-home-hero-title lpv-display max-w-5xl text-[clamp(4rem,15vw,5.2rem)] md:text-[clamp(4.6rem,11vw,10.5rem)] leading-[0.82]">
                Wine made
                <br />
                simpler.
              </h1>

              <div className="lpv-home-hero-bottom mt-10 border-t border-white/35 pt-5 md:flex md:items-end md:justify-between md:gap-12">
                <p className="lpv-kicker text-white/75">
                  Wine, seen from here.
                </p>

                <nav
                  aria-label="Explorer Le Premier Verre"
                  className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.18em] text-white/82 md:mt-0 md:flex md:flex-wrap md:justify-end md:gap-x-7"
                >
                  <Link href="/en/wines">Wines →</Link>
                  <Link href="/en/producers">Producers →</Link>
                  <Link href="/en/places">Places →</Link>
                  <Link href="/en/journal">Read →</Link>
                </nav>
              </div>
        </div>
      </section>

      {/* CE SOIR */}
      <section className="bg-[var(--lpv-paper)]">
        <>
        <div className="lpv-home-tonight lpv-container py-20 md:py-28 lg:py-32">

          <div className="grid md:mx-6 md:grid-cols-2 md:items-stretch lg:mx-10 xl:mx-14">

            {/* PHOTO */}
            <div className="h-[320px] overflow-hidden sm:h-[380px] md:h-[460px]">
              <Photo
                src="/images/lpv/bouteille-ce-soir.jpg"
                alt="Moment de table autour du vin"
              />
            </div>

            {/* TEXTE */}
            <div className="flex min-h-[360px] flex-col justify-center px-0 py-10 md:min-h-0 md:px-12 md:py-12 lg:px-16">

              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Start here
              </p>

              <h2 className="lpv-display mt-5 text-[clamp(3.4rem,11vw,4.5rem)] leading-[0.86] tracking-[-0.05em] md:mt-7 md:text-[clamp(4.4rem,6.2vw,6.6rem)]">
                A bottle
                <br />
                for tonight.
              </h2>

              <div className="mt-7 md:mt-8">
                <Link
                  href="/en/tonight"
                  className="lpv-text-link w-fit"
                >
                  What are we drinking tonight? <span>→</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
        </>
      </section>

      {/* SÉLECTION DU MOMENT */}
      <section className="bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)]">
        <>
        <div className="lpv-home-wines lpv-container py-8 md:py-12">
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="lpv-display text-[clamp(2.7rem,6vw,4.15rem)] leading-[0.9] tracking-[-0.04em]">
                Three bottles for right now.
              </h2>
            </div>

            <Link
              href="/en/wines"
              className="lpv-text-link hidden shrink-0 text-white md:flex"
            >
              All wines <span>→</span>
            </Link>
          </div>

          <div className="lpv-home-wine-rail mt-8 grid md:mt-10 md:grid-cols-3">
            {selectionWines.map((wine, index) => {
              const editorialUrl = wine.editorialImage
                ? urlFor(wine.editorialImage)
                    .width(1200)
                    .height(1500)
                    .fit("crop")
                    .url()
                : null;

              const typeLabel =
                wine.beverageType ==="cider"
                  ?"Cider"
                  : wine.color ==="rouge"
                    ?"Red"
                    : wine.color ==="blanc"
                      ?"White"
                      : wine.color ==="rose"
                        ?"Rosé"
                        : wine.color ==="bulles"
                          ?"Sparkling"
                          :"Wine";

              return (
                <Link
                  key={wine.slug}
                  href={`/en/wines/${wine.slug}`}
                  className={`group block py-8 md:px-8 md:py-10 ${
                    index > 0
                      ?"border-t border-white/20 md:border-l md:border-t-0"
                      :""
                  }`}
                >
                  <div className="overflow-hidden bg-white/5">
                    {editorialUrl ? (
                      <img
                        src={editorialUrl}
                        alt={wine.name}
                        className="aspect-[4/5] w-full object-cover"
                      />
                    ) : (
                      <BottleStage
                        image={wine.bottleImage}
                        alt={wine.name}
                        color={
                          wine.beverageType ==="cider" ? undefined : wine.color
                        }
                        variant="card"
                        className="!h-[360px]"
                      />
                    )}
                  </div>

                  <div className="border-t border-white/20 pt-5">
                    <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/55">
                      {[typeLabel, wine.alcoholFree ?"Alcohol-free" : null]
                        .filter(Boolean)
                        .join(" ·")}
                    </p>

                    <h3 className="lpv-display mt-3 text-[clamp(1.8rem,2.5vw,2.6rem)] leading-[0.94]">
                      {wine.name}
                    </h3>

                    {wine.producer?.name ? (
                      <p className="mt-4 text-sm leading-5 text-white/60">
                        {wine.producer.name}
                        {wine.vintage ? ` · ${wine.vintage}` :""}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
        </>
      </section>

      {/* DÉCOUVRIR — TROIS RENDEZ-VOUS */}
      <section className="bg-[var(--lpv-paper)]">
        <div className="lpv-home-discovery lpv-container py-14 md:py-20">

          <div className="mb-10 md:mb-14">
              <>
<h2 className="lpv-display max-w-[900px] text-[clamp(3.2rem,5vw,5rem)] leading-[0.9] tracking-[-0.045em]">
                Worth discovering this week.
              </h2>
              </>
            </div>

          <div className="space-y-7 md:space-y-8">

            {/* PRODUCTEUR */}
            {featuredProducer ? (
              <>
<article className="grid md:grid-cols-[0.42fr_0.58fr] md:items-stretch">

                <Link
                  href={`/en/producers/${featuredProducer.slug}`}
                  className="lpv-luxury-image block h-[270px] overflow-hidden md:h-[310px]"
                >
                  {featuredProducer.heroImage ? (
                    <Photo
                      src={urlFor(featuredProducer.heroImage)
                        .width(1200)
                        .height(800)
                        .fit("crop")
                        .url()}
                      alt={featuredProducer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/[0.035]">
                        <span className="text-[13px] italic text-[var(--lpv-muted)]">
                          Photo coming soon.
                        </span>
                      </div>
                  )}
                </Link>

                <div className="lpv-discovery-copy flex min-h-[270px] flex-col justify-center py-8 md:min-h-[310px] md:px-12 md:py-8 lg:px-16">

                  <h3 className="lpv-display max-w-[680px] text-[clamp(2.4rem,3.5vw,3.8rem)] leading-[0.93] tracking-[-0.04em]">
                    {featuredProducer.name}
                  </h3>

                  <p className="mt-3 text-[13px] text-[var(--lpv-muted)]">
                    In the Eastern Townships
                    {featuredProducer.municipality ? (
                      <> · {featuredProducer.municipality}, Quebec</>
                    ) : null}
                  </p>

                  {featuredProducer.oneLiner ? (
                    <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-[var(--lpv-ink)]">
                      At Bergeville, everything revolves around bubbles. Quebec sparkling wines made with precision, without losing sight of the pleasure.
                    </p>
                  ) : null}

                  <Link
                    href={`/en/producers/${featuredProducer.slug}`}
                    className="mt-7 inline-flex w-fit items-center gap-3 text-[14px] font-medium text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
                  >
                    View producer <span>→</span>
                  </Link>

                </div>
              </article>
              </>
            ) : null}


            {/* BONNE ADRESSE */}
            {featuredPlace ? (
              <>
<article className="grid md:grid-cols-[0.42fr_0.58fr] md:items-stretch">

                <Link
                  href={`/en/places/${featuredPlace.slug}`}
                  className="lpv-luxury-image block h-[270px] overflow-hidden md:h-[310px]"
                >
                  {featuredPlace.slug ==="saucette" ? (
                    <img
                      src="/images/lpv/bonnes%20adresses/saucette1.jpg"
                      alt={featuredPlace.name}
                      className="h-full w-full object-cover"
                    />
                  ) : featuredPlace.coverImage ? (
                    <img
                      src={urlFor(featuredPlace.coverImage)
                        .width(1200)
                        .height(800)
                        .fit("crop")
                        .url()}
                      alt={featuredPlace.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/[0.035]">
                        <span className="text-[13px] italic text-[var(--lpv-muted)]">
                          Photo coming soon.
                        </span>
                      </div>
                  )}
                </Link>

                <div className="lpv-discovery-copy flex min-h-[270px] flex-col justify-center py-8 md:min-h-[310px] md:px-12 md:py-8 lg:px-16">

                  <h3 className="lpv-display max-w-[680px] text-[clamp(2.4rem,3.5vw,3.8rem)] leading-[0.93] tracking-[-0.04em]">
                    {featuredPlace.name}
                  </h3>

                  <p className="mt-3 text-[13px] text-[var(--lpv-muted)]">
                    Place
                    {(featuredPlace.city || featuredPlace.region) ? (
                      <> · {[featuredPlace.city, featuredPlace.region]
                        .filter(Boolean)
                        .join(" ·")}</>
                    ) : null}
                  </p>

                  {featuredPlace.highlights?.[0] ? (
                    <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-[var(--lpv-ink)]">
                      A wine shop that turns into a wine bar at night, with bottles chosen to be enjoyed rather than collected.
                    </p>
                  ) : null}

                  <Link
                    href={`/en/places/${featuredPlace.slug}`}
                    className="mt-7 inline-flex w-fit items-center gap-3 text-[14px] font-medium text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
                  >
                    Discover the place <span>→</span>
                  </Link>

                </div>
              </article>
              </>
            ) : null}


            {/* À LIRE */}
            {featuredArticle ? (
              <>
<article className="grid md:grid-cols-[0.42fr_0.58fr] md:items-stretch">

                <Link
                  href={`/en/journal/${featuredArticle.slug}`}
                  className="lpv-luxury-image block h-[270px] overflow-hidden md:h-[310px]"
                >
                  {featuredArticle.coverImage ? (
                    <img
                      src={urlFor(featuredArticle.coverImage)
                        .width(1200)
                        .height(800)
                        .fit("crop")
                        .url()}
                      alt={featuredArticle.titleEn || featuredArticle.title}
                      className="h-full w-full object-cover grayscale"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/[0.035]">
                        <span className="text-[13px] italic text-[var(--lpv-muted)]">
                          Photo coming soon.
                        </span>
                      </div>
                  )}
                </Link>

                <div className="lpv-discovery-copy flex min-h-[270px] flex-col justify-center py-8 md:min-h-[310px] md:px-12 md:py-8 lg:px-16">

                  <h3 className="lpv-display max-w-[720px] text-[clamp(2.2rem,3.2vw,3.5rem)] leading-[0.94] tracking-[-0.04em]">
                    {featuredArticle.titleEn || featuredArticle.title}
                  </h3>

                  <p className="mt-3 text-[13px] text-[var(--lpv-muted)]">
                    Read
                  </p>

                  {featuredArticle.excerpt ? (
                    <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-[var(--lpv-ink)]">
                      Twenty bottles to help you figure out what you like, one glass at a time.
                    </p>
                  ) : null}

                  <Link
                    href={`/en/journal/${featuredArticle.slug}`}
                    className="mt-7 inline-flex w-fit items-center gap-3 text-[14px] font-medium text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
                  >
                    Read article <span>→</span>
                  </Link>

                </div>
              </article>
              </>
            ) : null}

          </div>




        </div>

      </section>

      {/* NEWSLETTER */}
      <section className="bg-[var(--lpv-cocoa)] text-[var(--lpv-paper-light)]">
        <>
        <div className="lpv-home-newsletter lpv-container grid gap-0 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
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
              A bottle, a place and an idea worth keeping close.
            </p>

            <Link
              href="/en/newsletter"
              className="lpv-text-link mt-10 w-fit text-white"
            >
              Subscribe <span>→</span>
            </Link>
          </div>
        </div>
        </>
      </section>
    </main>
  );
}
