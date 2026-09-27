import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { foodsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type FoodCard = {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  category?: string;
  image?: SanityImageSource;
  oneLiner?: string;
  oneLinerEn?: string;
  wineStyles?: string[];
  wineStylesEn?: string[];
  servingTip?: string;
  servingTipEn?: string;
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  page?: string;
}>;

const categoryGroups = [
  {
    value: "",
    label: "All",
  },
  {
    value: "meat",
    label: "Meat",
    categories: ["red-meat", "poultry"],
  },
  {
    value: "sea",
    label: "Fish & seafood",
    categories: ["fish", "seafood"],
  },
  {
    value: "vegetarian",
    label: "Vegetarian",
    categories: ["vegetarian"],
  },
  {
    value: "cheese",
    label: "Cheese & charcuterie",
    categories: ["cheese", "charcuterie"],
  },
  {
    value: "dessert",
    label: "Desserts",
    categories: ["dessert"],
  },
  {
    value: "other",
    label: "Other",
    categories: ["other"],
  },
];

function normalize(value?: string) {
  return value?.trim().toLocaleLowerCase("en-CA") ?? "";
}

function categoryLabel(category?: string) {
  const labels: Record<string, string> = {
    "red-meat": "Meat",
    poultry: "Poultry",
    fish: "Fish",
    seafood: "Seafood",
    vegetarian: "Vegetarian",
    cheese: "Cheese",
    charcuterie: "Charcuterie",
    dessert: "Dessert",
    other: "At the table",
  };

  return category ? labels[category] ?? category : "Pairing";
}

export default async function PairingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const foods = await client.fetch<FoodCard[]>(foodsQuery);

  const query = normalize(params.q);
  const selectedCategory = params.category ?? "";

  const selectedGroup = categoryGroups.find(
    (group) => group.value === selectedCategory
  );

  const filteredFoods = foods.filter((food) => {
    const searchableText = normalize(
      [
        food.nameEn || food.name,
        food.oneLinerEn || food.oneLiner,
        food.category,
        ...(food.wineStylesEn || food.wineStyles || []),
      ]
        .filter(Boolean)
        .join(" ")
    );

    const matchesSearch = !query || searchableText.includes(query);

    const matchesCategory =
      !selectedCategory ||
      Boolean(selectedGroup?.categories?.includes(food.category ?? ""));

    return matchesSearch && matchesCategory;
  });

  const requestedPage = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1
  );

  const foodsPerPage = 12;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFoods.length / foodsPerPage)
  );

  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * foodsPerPage;

  const paginatedFoods = filteredFoods.slice(
    startIndex,
    startIndex + foodsPerPage
  );

  const hasFilters = Boolean(query || selectedCategory);

  function pageHref(page: number) {
    const nextParams = new URLSearchParams();

    if (params.q) nextParams.set("q", params.q);
    if (selectedCategory) nextParams.set("category", selectedCategory);
    if (page > 1) nextParams.set("page", String(page));

    const queryString = nextParams.toString();

    return queryString ? `/en/pairings?${queryString}` : "/en/pairings";
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* INTRO */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-10 py-16 md:grid-cols-[0.68fr_0.32fr] md:items-end md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Pairings
            </p>

            <h1 className="lpv-display mt-7 max-w-6xl text-[clamp(4.8rem,10vw,10rem)] leading-[0.82]">
              What's
              <br />
              on the menu?
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-6 md:border-t-0 md:pb-2">
            <p className="max-w-md text-base leading-8 text-[var(--lpv-muted)]">
              Start with the plate. We'll take care of the glass. Simple,
              precise pairings designed to find the bottles that truly work
              with your meal.
            </p>

            <p className="mt-7 text-xs uppercase tracking-[0.18em] text-[var(--lpv-cocoa)]">
              {foods.length} pairings in the collection
            </p>
          </div>
        </div>
      </section>

      {/* RECHERCHE */}
      <section className="border-b border-[var(--lpv-line)]">
        <form
          method="GET"
          className="lpv-container py-8 md:py-10"
        >
          <div className="grid gap-px bg-[var(--lpv-line)] md:grid-cols-[1.35fr_0.65fr]">
            <label className="bg-[var(--lpv-paper)] p-4">
              <span className="mb-3 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                What's on the menu?
              </span>

              <input
                type="search"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Pizza, salmon, curry, chocolate…"
                className="w-full border-0 bg-transparent py-1 text-base outline-none placeholder:text-[var(--lpv-muted)]/55"
              />
            </label>

            <label className="bg-[var(--lpv-paper)] p-4">
              <span className="mb-3 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                Type of dish
              </span>

              <select
                name="category"
                defaultValue={selectedCategory}
                className="w-full appearance-none border-0 bg-transparent py-1 text-base outline-none"
              >
                {categoryGroups.map((group) => (
                  <option key={group.value || "all"} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <button
              type="submit"
              className="lpv-button lpv-button-dark"
            >
              Find a pairing
            </button>

            {hasFilters ? (
              <Link href="/en/pairings" className="lpv-text-link">
                Reset
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      {/* RACCOURCIS */}
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container flex flex-wrap gap-x-8 gap-y-4 py-6">
          {categoryGroups.map((group) => {
            const active = selectedCategory === group.value;

            return (
              <Link
                key={group.value || "all"}
                href={
                  group.value
                    ? `/en/pairings?category=${group.value}`
                    : "/en/pairings"
                }
                className={`text-xs uppercase tracking-[0.16em] transition-opacity hover:opacity-50 ${
                  active
                    ? "text-[var(--lpv-ink)]"
                    : "text-[var(--lpv-muted)]"
                }`}
              >
                {group.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* COLLECTION */}
      <section className="lpv-container py-16 md:py-24">
        <div className="flex flex-col gap-5 border-b border-[var(--lpv-line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              At the table
            </p>

            <h2 className="lpv-display mt-5 text-5xl leading-none md:text-7xl">
              Find the right glass.
            </h2>
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
            {filteredFoods.length} result
            {filteredFoods.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredFoods.length > 0 ? (
          <>
            <div className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-12">
              {paginatedFoods.map((food, index) => {
                const number = String(startIndex + index + 1).padStart(2, "0");

                return (
                  <article
                    key={food._id}
                    className="group flex min-w-0 min-h-[400px] flex-col border-b border-[var(--lpv-line)] pt-10 pb-4 md:min-h-[440px] md:pt-12 md:pb-4"
                  >
                    <Link
                      href={`/en/pairings/${food.slug}`}
                      className="flex h-full flex-1 flex-col"
                    >
                      <div className="flex items-start justify-between gap-8">
                        <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                          {categoryLabel(food.category)}
                        </p>

                        <span className="text-[0.6rem] tracking-[0.18em] text-[var(--lpv-muted)]">
                          {number}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col pt-10 md:pt-12">
                        <h3 className="lpv-display max-w-[11ch] text-[clamp(3.5rem,5vw,6rem)] leading-[0.84] tracking-[-0.04em] transition-opacity group-hover:opacity-60">
                          {food.nameEn || food.name}
                        </h3>

                        {(food.wineStylesEn || food.wineStyles)?.length ? (
                          <div className="mt-8 flex flex-wrap gap-x-3 gap-y-2">
                            {(food.wineStylesEn || food.wineStyles || [])
                              .slice(0, 3)
                              .map((style, styleIndex) => (
                              <span
                                key={`${style}-${styleIndex}`}
                                className="text-[0.6rem] uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]"
                              >
                                {style}
                                {styleIndex <
                                Math.min(
                                    (food.wineStylesEn || food.wineStyles || []).length,
                                    3
                                  ) - 1
                                  ? " ·"
                                  : ""}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-auto pt-10">
                          {(food.oneLinerEn || food.oneLiner) ? (
                            <p className="max-w-md text-sm leading-7 text-[var(--lpv-muted)]">
                              {food.oneLinerEn || food.oneLiner}
                            </p>
                          ) : null}

                          <div className="mt-7 border-t border-[var(--lpv-line)] py-4">
                            <span className="lpv-text-link">
                              View pairing <span>→</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Pairings pagination"
                className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--lpv-line)] pt-8"
              >
                <div>
                  {currentPage > 1 ? (
                    <Link
                      href={pageHref(currentPage - 1)}
                      className="lpv-text-link"
                    >
                      ← Previous
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      ← Previous
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Link
                      key={page}
                      href={pageHref(page)}
                      aria-current={
                        page === currentPage ? "page" : undefined
                      }
                      className={`flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-opacity hover:opacity-60 ${
                        page === currentPage
                          ? "border-[var(--lpv-ink)] text-[var(--lpv-ink)]"
                          : "border-[var(--lpv-line)] text-[var(--lpv-muted)]"
                      }`}
                    >
                      {page}
                    </Link>
                  ))}
                </div>

                <div>
                  {currentPage < totalPages ? (
                    <Link
                      href={pageHref(currentPage + 1)}
                      className="lpv-text-link"
                    >
                      Next →
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--lpv-muted)]/40">
                      Next →
                    </span>
                  )}
                </div>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              No pairings
            </p>

            <h2 className="lpv-display mt-6 text-5xl">
              Try something else?
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[var(--lpv-muted)]">
              Try another dish or remove the filter to browse
              all pairings.
            </p>

            <Link
              href="/en/pairings"
              className="lpv-button lpv-button-dark mt-8"
            >
              View all pairings
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
