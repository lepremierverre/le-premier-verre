import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { guidesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Guide = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
  coverImage?: SanityImageSource;
  guideType?: string;
  difficulty?: string;
  estimatedReadingTime?: string | number;
  estimatedReadingTimeEn?: string | number;
};

function formatLabel(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    beginner: "Beginner",
    practical: "Practical guide",
    buying: "Buying guide",
    region: "Regional",
    grape: "Grape",
    pairing: "Pairings",
    tasting: "Tasting",
    travel: "Travel",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  return labels[value] || value.replace(/[-_]/g, " ");
}

export default async function GuidesPage() {
  const guides = await client.fetch<Guide[]>(guidesQuery);
  const featuredGuide = guides[0];

  const imageSrc = featuredGuide?.coverImage
    ? urlFor(featuredGuide.coverImage)
        .width(1800)
        .height(1350)
        .fit("crop")
        .url()
    : null;

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* HERO */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-7 py-10 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Understand
            </p>

            <h1 className="lpv-display mt-4 max-w-5xl text-[clamp(3.9rem,15vw,4.8rem)] leading-[0.84] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)] md:leading-[0.82]">
              The guides.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-4 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Simple reference points to help you choose, taste and understand
              what is in the glass.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED GUIDE */}
      {featuredGuide ? (
        <section className="lpv-container py-12 md:py-24">
          <div className="mb-7 flex items-end justify-between border-b border-[var(--lpv-line)] pb-4 md:mb-12 md:pb-5">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Read now
            </p>

            <span className="text-[0.6rem] uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
              01
            </span>
          </div>

          <article className="group grid gap-8 md:grid-cols-[1.08fr_0.92fr] md:items-center md:gap-14 lg:gap-20">
            <Link
              href={`/en/guides/${featuredGuide.slug}`}
              className="block overflow-hidden bg-[var(--lpv-paper-light)]"
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={featuredGuide.titleEn || featuredGuide.title}
                  className="aspect-[4/3] w-full object-cover object-center transition duration-700 group-hover:scale-[1.015]"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center">
                  <p className="lpv-kicker text-[var(--lpv-muted)]">
                    Image coming soon
                  </p>
                </div>
              )}
            </Link>

            <div className="md:py-4">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                {formatLabel(featuredGuide.guideType) || "Guide"}
              </p>

              <Link href={`/en/guides/${featuredGuide.slug}`}>
                <h2 className="lpv-display mt-4 max-w-3xl text-[clamp(2.8rem,8vw,4.2rem)] leading-[0.9] tracking-[-0.035em] transition-opacity duration-300 group-hover:opacity-60 md:mt-6 md:text-[clamp(3.6rem,5vw,5.8rem)]">
                  {featuredGuide.titleEn || featuredGuide.title}
                </h2>
              </Link>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.16em] text-[var(--lpv-muted)] md:mt-7">
                {featuredGuide.difficulty ? (
                  <span>{formatLabel(featuredGuide.difficulty)}</span>
                ) : null}

                {featuredGuide.difficulty &&
                featuredGuide.estimatedReadingTime ? (
                  <span>·</span>
                ) : null}

                {featuredGuide.estimatedReadingTime ? (
                  <span>
                    {featuredGuide.estimatedReadingTimeEn ||
                      featuredGuide.estimatedReadingTime}{" "}
                    min
                  </span>
                ) : null}
              </div>

              {featuredGuide.excerpt ? (
                <p className="mt-5 max-w-xl text-[0.9rem] leading-7 text-[var(--lpv-muted)] md:mt-7 md:text-base md:leading-8">
                  {featuredGuide.excerptEn || featuredGuide.excerpt}
                </p>
              ) : null}

              <Link
                href={`/en/guides/${featuredGuide.slug}`}
                className="lpv-text-link mt-7 md:mt-9"
              >
                Read the guide <span>→</span>
              </Link>
            </div>
          </article>
        </section>
      ) : null}

      {/* MORE GUIDES */}
      <section className="border-t border-[var(--lpv-line)]">
        <div className="lpv-container py-14 md:py-24">
          <div className="grid gap-7 md:grid-cols-[0.35fr_0.65fr] md:gap-16 lg:gap-24">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Coming soon
              </p>
            </div>

            <div>
              <h2 className="lpv-display max-w-4xl text-[clamp(2.8rem,10vw,4rem)] leading-[0.9] tracking-[-0.035em] md:text-[clamp(4rem,6vw,7rem)]">
                More guides are coming soon. ;)
              </h2>

              <p className="mt-6 max-w-xl text-[0.9rem] leading-7 text-[var(--lpv-muted)] md:mt-8 md:text-base md:leading-8">
                Regions, grapes, pairings, great bottles and everything you
                need to drink less complicated.
              </p>
            </div>
          </div>
        </div>
      </section>
    
      {/* CTA — BESOIN D'INFORMATION */}
      <section className="border-t border-[var(--lpv-line)]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:items-end md:px-10 md:py-20">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Le Premier Verre
            </p>
            <h2 className="lpv-display mt-4 max-w-3xl text-[2.4rem] leading-[0.98] tracking-[-0.04em] md:text-[3.8rem]">
              Can't find the information you're looking for?
            </h2>
          </div>
          <div>
            <p className="max-w-md text-sm leading-6 text-[var(--lpv-ink)] md:text-base md:leading-7">
              Get in touch. We'll help you find the answers you need.
            </p>
            <Link
              href="/en/contact"
              className="mt-6 inline-flex border-b border-[var(--lpv-ink)] pb-2 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-ink)] transition-opacity hover:opacity-55"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
