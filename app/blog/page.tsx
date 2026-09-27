import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { articlesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  author?: string;
  coverImage?: SanityImageSource;
  publishedAt?: string;
  _createdAt?: string;
};

function formatDate(value?: string) {
  if (!value) return null;

  return new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogPage() {
  const articles = await client.fetch<Article[]>(articlesQuery);

  const featured = articles[0];
  const remaining = articles.slice(1);

  const featuredTitleLength = featured?.title?.length || 0;
  const featuredTitleSize =
    featuredTitleLength > 70
      ? "md:text-[clamp(3.6rem,4.4vw,5.1rem)]"
      : featuredTitleLength > 50
        ? "md:text-[clamp(4rem,4.8vw,5.5rem)]"
        : featuredTitleLength > 35
          ? "md:text-[clamp(4.3rem,5.2vw,6rem)]"
          : "md:text-[clamp(4.6rem,5.7vw,6.6rem)]";

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-6 py-10 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-10 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Le journal
            </p>

            <h1 className="lpv-display mt-5 max-w-5xl text-[clamp(3.7rem,15vw,4.7rem)] leading-[0.84] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)] md:leading-[0.82]">
              Des histoires
              <br />
              à ouvrir.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Des idées, des rencontres et des façons plus simples de penser le
              vin, la table et les moments qu’on partage.
            </p>

            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--lpv-cocoa)] md:mt-7">
              {articles.length} article{articles.length > 1 ? "s" : ""} publié
              {articles.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="border-b border-[var(--lpv-line)]">
          <Link
            href={`/blog/${featured.slug}`}
            className="group lpv-container grid gap-8 py-10 md:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] md:items-start md:gap-12 md:py-24 xl:items-stretch"
          >
            <div className="overflow-hidden bg-[var(--lpv-paper-light)] xl:h-full">
              {featured.coverImage ? (
                <img
                  src={urlFor(featured.coverImage)
                    .width(1500)
                    .height(1000)
                    .fit("crop")
                    .url()}
                  alt={featured.title}
                  className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.015] xl:aspect-auto xl:h-full"
                />
              ) : (
                <div className="flex aspect-[3/2] items-center justify-center xl:h-full xl:aspect-auto">
                  <p className="text-sm text-[var(--lpv-muted)]">
                    Image à venir
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:h-full md:pt-0">
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                À la une
                {featured.category ? ` · ${featured.category}` : ""}
              </p>

              <h2
                className={`lpv-display mt-4 text-[clamp(2.7rem,11vw,3.45rem)] leading-[0.9] md:mt-6 md:leading-[0.88] ${featuredTitleSize}`}
              >
                {featured.title}
              </h2>

              {featured.excerpt ? (
                <p className="mt-5 max-w-xl text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:mt-7 md:text-base md:leading-8">
                  {featured.excerpt}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.15em] text-[var(--lpv-muted)] md:mt-8 md:gap-4">
                {featured.author ? <span>{featured.author}</span> : null}

                {formatDate(featured.publishedAt || featured._createdAt) ? (
                  <span>
                    · {formatDate(featured.publishedAt || featured._createdAt)}
                  </span>
                ) : null}
              </div>

              <span className="lpv-text-link mt-6 md:mt-auto md:pt-8">
                Lire l’article <span>→</span>
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="lpv-container py-10 md:py-24">
        <div className="border-b border-[var(--lpv-line)] pb-6">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Dernières parutions
          </p>

          <h2 className="lpv-display mt-3 text-[2.8rem] leading-none md:mt-5 md:text-7xl">
            À lire.
          </h2>
        </div>

        {remaining.length > 0 ? (
          <div className="grid gap-x-8 md:grid-cols-2 lg:gap-x-10 xl:grid-cols-3">
            {remaining.map((article, index) => {
              const imageSrc = article.coverImage
                ? urlFor(article.coverImage)
                    .width(1200)
                    .height(1000)
                    .fit("crop")
                    .url()
                : null;

              return (
                <article
                  key={article._id}
                  className="group flex h-full flex-col py-7 md:py-10"
                >
                  <Link href={`/blog/${article.slug}`} className="block">
                    <div className="overflow-hidden bg-[var(--lpv-paper-light)]">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={article.title}
                          className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.015] xl:aspect-auto xl:h-full"
                        />
                      ) : (
                        <div className="flex aspect-[3/2] items-center justify-center xl:h-full xl:aspect-auto">
                          <p className="text-sm text-[var(--lpv-muted)]">
                            Image à venir
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col pt-5 md:pt-7">
                    <div className="flex items-baseline justify-between gap-6">
                      <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                        {article.category || "Article"}
                      </p>

                      <span className="lpv-kicker text-[var(--lpv-muted)]">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                    </div>

                    <Link href={`/blog/${article.slug}`}>
                      <h2 className="lpv-display mt-4 text-[clamp(2.5rem,10vw,3.15rem)] leading-[0.92] transition-opacity group-hover:opacity-60 md:mt-5 md:text-[clamp(3rem,4vw,4.8rem)] md:leading-[0.9]">
                        {article.title}
                      </h2>
                    </Link>

                    {article.excerpt ? (
                      <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--lpv-muted)] md:mt-6 md:leading-7">
                        {article.excerpt}
                      </p>
                    ) : null}

                    <p className="mt-auto pt-6 text-xs uppercase tracking-[0.14em] text-[var(--lpv-muted)] md:pt-8">
                      {[
                        article.author,
                        formatDate(article.publishedAt || article._createdAt),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="lpv-text-link mt-6 md:mt-8"
                    >
                      Lire <span>→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : featured ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[var(--lpv-muted)]">
              D’autres articles arrivent bientôt.
            </p>
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Bientôt
            </p>

            <h2 className="lpv-display mt-6 text-5xl md:text-7xl">
              Le journal prend forme.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--lpv-muted)]">
              Les premiers articles seront publiés progressivement.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
