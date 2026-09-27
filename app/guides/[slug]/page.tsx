import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { guideBySlugQuery } from "@/sanity/lib/queries";
import { buildDynamicMetadata } from "@/lib/seo/dynamic-metadata";

export const revalidate = 60;

type RelatedItem = {
  _id: string;
  name?: string;
  title?: string;
  slug?: string;
};

type Guide = {
  title: string;
  excerpt?: string;
  content?: PortableTextBlock[];
  coverImage?: SanityImageSource;
  guideType?: string;
  difficulty?: string;
  estimatedReadingTime?: string;
  publishedAt?: string;
  relatedCountries?: RelatedItem[];
  relatedRegions?: RelatedItem[];
  relatedAppellations?: RelatedItem[];
  relatedGrapes?: RelatedItem[];
  relatedWines?: RelatedItem[];
  relatedProducers?: RelatedItem[];
  relatedPlaces?: RelatedItem[];
};

function formatLabel(value?: string) {
  if (!value) return null;

  const labels: Record<string, string> = {
    beginner: "Débutant",
    buying: "Guide d’achat",
    region: "Guide régional",
    grape: "Guide cépage",
    pairing: "Guide accords",
    tasting: "Guide dégustation",
    travel: "Guide voyage",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return labels[value] || value.replace(/[-_]/g, " ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return buildDynamicMetadata({
    entity: "guide",
    slug,
    locale: "fr",
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const guide = await client.fetch<Guide | null>(
    guideBySlugQuery,
    { slug }
  );

  if (!guide) notFound();

  const imageSrc = guide.coverImage
    ? urlFor(guide.coverImage)
        .width(1800)
        .height(1400)
        .fit("crop")
        .url()
    : null;

  const relatedGroups = [
    ["Pays", guide.relatedCountries],
    ["Régions", guide.relatedRegions],
    ["Appellations", guide.relatedAppellations],
    ["Cépages", guide.relatedGrapes],
  ].filter(([, items]) => Array.isArray(items) && items.length > 0) as [
    string,
    RelatedItem[]
  ][];

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="lpv-container pb-24">
        <div className="pt-8 md:pt-10">
          <Link href="/guides" className="lpv-text-link">
            <span>←</span> Retour aux guides
          </Link>
        </div>

        <section className="grid gap-12 border-b border-[var(--lpv-line)] pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              {formatLabel(guide.guideType) || "Guide"}
            </p>

            <h1 className="lpv-display mt-7 text-[clamp(4.5rem,8vw,8.5rem)] leading-[0.84]">
              {guide.title}
            </h1>

            {guide.excerpt ? (
              <p className="mt-8 max-w-lg text-lg leading-8 text-[var(--lpv-muted)]">
                {guide.excerpt}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-4 border-t border-[var(--lpv-line)] pt-7 text-xs uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
              {guide.difficulty ? (
                <span>{formatLabel(guide.difficulty)}</span>
              ) : null}

              {guide.estimatedReadingTime ? (
                <span>· {guide.estimatedReadingTime}</span>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden bg-[var(--lpv-paper-light)]">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={guide.title}
                className="min-h-[620px] w-full object-cover md:min-h-[780px]"
              />
            ) : (
              <div className="flex min-h-[620px] items-center justify-center">
                <p className="text-sm text-[var(--lpv-muted)]">
                  Image à ajouter dans Sanity.
                </p>
              </div>
            )}
          </div>
        </section>

        {guide.content?.length ? (
          <section className="grid gap-10 border-b border-[var(--lpv-line)] py-16 md:grid-cols-[0.3fr_0.7fr] md:py-24">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Le guide
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
                À savoir.
              </h2>
            </div>

            <div className="lpv-prose max-w-3xl">
              <PortableText value={guide.content} />
            </div>
          </section>
        ) : (
          <section className="border-b border-[var(--lpv-line)] py-20 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              En préparation
            </p>

            <h2 className="lpv-display mt-6 text-5xl">
              Le contenu arrive bientôt.
            </h2>
          </section>
        )}

        {relatedGroups.length > 0 ? (
          <section className="grid gap-10 border-b border-[var(--lpv-line)] py-16 md:grid-cols-[0.3fr_0.7fr] md:py-20">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Pour continuer
              </p>

              <h2 className="lpv-display mt-6 text-5xl leading-[0.9] md:text-6xl">
                Aller plus loin.
              </h2>
            </div>

            <div>
              {relatedGroups.map(([label, items]) => (
                <div
                  key={label}
                  className="border-t border-[var(--lpv-line)] py-6"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                    {label}
                  </p>

                  <div className="mt-4 space-y-3">
                    {items.map((item) => (
                      <p key={item._id} className="text-xl">
                        {item.name || item.title}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
