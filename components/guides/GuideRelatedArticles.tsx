import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { urlFor } from "@/sanity/lib/image";

export type GuideRelatedArticle = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
  category?: string;
  categoryEn?: string;
  coverImage?: SanityImageSource;
};

type GuideRelatedArticlesProps = {
  articles?: GuideRelatedArticle[];
  locale: "fr" | "en";
};

export default function GuideRelatedArticles({
  articles = [],
  locale,
}: GuideRelatedArticlesProps) {
  if (!articles.length) return null;

  const isEnglish = locale === "en";

  return (
    <section className="border-b border-[var(--lpv-line)] py-14 md:py-20">
      <div className="mb-8 border-b border-[var(--lpv-line)] pb-5 md:mb-10">
        <p className="lpv-kicker text-[var(--lpv-cocoa)]">
          {isEnglish ? "Keep reading" : "Pour continuer"}
        </p>

        <h2 className="lpv-display mt-3 text-[2.8rem] leading-none md:mt-5 md:text-6xl">
          {isEnglish ? "A little more." : "Un peu plus loin."}
        </h2>
      </div>

      <div className="space-y-10">
        {articles.map((article) => {
          const title = isEnglish
            ? article.titleEn || article.title
            : article.title;

          const excerpt = isEnglish
            ? article.excerptEn || article.excerpt
            : article.excerpt;

          const category = isEnglish
            ? article.categoryEn || article.category
            : article.category;

          const imageSrc = article.coverImage
            ? urlFor(article.coverImage)
                .width(1200)
                .height(800)
                .fit("crop")
                .url()
            : null;

          const href = isEnglish
            ? `/en/journal/${article.slug}`
            : `/blog/${article.slug}`;

          return (
            <Link
              key={article._id}
              href={href}
              className="group grid gap-6 md:grid-cols-[0.42fr_0.58fr] md:items-center md:gap-10"
            >
              <div className="overflow-hidden bg-[var(--lpv-paper-light)]">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={title}
                    className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                  />
                ) : (
                  <div className="flex aspect-[3/2] items-center justify-center">
                    <p className="text-sm text-[var(--lpv-muted)]">
                      {isEnglish ? "Image coming soon" : "Image à venir"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
                  {isEnglish ? "Article" : "Article"}
                  {category ? ` · ${category}` : ""}
                </p>

                <h3 className="lpv-display mt-4 max-w-2xl text-[2.5rem] leading-[0.92] md:text-5xl">
                  {title}
                </h3>

                {excerpt ? (
                  <p className="mt-5 max-w-xl text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
                    {excerpt}
                  </p>
                ) : null}

                <span className="lpv-text-link mt-6 inline-flex">
                  {isEnglish ? "Read the article" : "Lire l’article"}{" "}
                  <span>→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
