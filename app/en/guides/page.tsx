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
  estimatedReadingTime?: string;
  estimatedReadingTimeEn?: string;
};

function formatLabel(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    beginner: "Beginner",
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

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-6 py-10 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
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
              Simple reference points to help you choose, taste and
              understand what is in the glass.
            </p>

            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--lpv-cocoa)] md:mt-7">
              {guides.length} guide{guides.length > 1 ? "s" : ""} published
              {guides.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="lpv-container py-10 md:py-24">
        <div className="flex items-end justify-between border-b border-[var(--lpv-line)] pb-5 md:pb-6">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              To read
            </p>

            <h2 className="lpv-display mt-3 text-[2.8rem] leading-[0.95] md:mt-5 md:text-7xl md:leading-none">
              Go further.
            </h2>
          </div>
        </div>

        {guides.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide, index) => {
              const imageSrc = guide.coverImage
                ? urlFor(guide.coverImage)
                    .width(1000)
                    .height(1200)
                    .fit("crop")
                    .url()
                : null;

              return (
                <article
                  key={guide._id}
                  className={`group border-b border-[var(--lpv-line)] py-7 md:py-10 ${
                    index % 3 !== 2
                      ? "xl:border-r xl:pr-10"
                      : "xl:pl-10"
                  } ${
                    index % 3 === 1
                      ? "xl:px-10"
                      : ""
                  }`}
                >
                  <Link href={`/en/guides/${guide.slug}`} className="block">
                    <div className="overflow-hidden bg-[var(--lpv-paper-light)]">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={guide.titleEn || guide.title}
                          className="aspect-[4/5] h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                        />
                      ) : (
                        <div className="flex aspect-[4/5] items-center justify-center">
                          <p className="text-sm text-[var(--lpv-muted)]">
                            Image coming soon
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="pt-5 md:pt-7">
                    <div className="flex items-start justify-between gap-6">
                      <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                        {formatLabel(guide.guideType) || "Guide"}
                      </p>

                      <span className="text-[0.6rem] tracking-[0.16em] text-[var(--lpv-muted)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <Link href={`/en/guides/${guide.slug}`}>
                      <h2 className="lpv-display mt-3 text-[clamp(2.6rem,11vw,3.3rem)] leading-[0.92] transition-opacity group-hover:opacity-60 md:mt-5 md:text-[clamp(3rem,4vw,4.8rem)] md:leading-[0.9]">
                        {guide.titleEn || guide.title}
                      </h2>
                    </Link>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)] md:mt-5">
                      {guide.difficulty ? (
                        <span>{formatLabel(guide.difficulty)}</span>
                      ) : null}

                      {guide.estimatedReadingTime ? (
                        <span>· {guide.estimatedReadingTimeEn || guide.estimatedReadingTime}</span>
                      ) : null}
                    </div>

                    {guide.excerpt ? (
                      <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--lpv-muted)] md:mt-6 md:leading-7">
                        {guide.excerptEn || guide.excerpt}
                      </p>
                    ) : null}

                    <Link
                      href={`/en/guides/${guide.slug}`}
                      className="lpv-text-link mt-5 md:mt-8"
                    >
                      Read the guide <span>→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-14 text-center md:py-24">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Coming soon
            </p>

            <h2 className="lpv-display mx-auto mt-4 max-w-2xl text-[2.8rem] leading-[0.95] md:mt-6 md:text-7xl md:leading-none">
              Our first guides are coming.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[0.9rem] leading-6 text-[var(--lpv-muted)] md:mt-6 md:text-base md:leading-8">
              Regions, grapes, pairings and the fundamentals of wine will be
              added progressively.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
