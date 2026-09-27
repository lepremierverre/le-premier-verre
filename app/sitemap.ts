import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";

const BASE_URL = "https://lepremierverre.com";

type SitemapDocument = {
  slug: string;
  _updatedAt?: string;
};

type StaticPair = {
  fr: string;
  en: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const staticPages: StaticPair[] = [
  { fr: "", en: "/en", changeFrequency: "weekly", priority: 1 },
  { fr: "/ce-soir", en: "/en/tonight", changeFrequency: "weekly", priority: 0.9 },
  { fr: "/vins", en: "/en/wines", changeFrequency: "daily", priority: 0.9 },
  { fr: "/accords", en: "/en/pairings", changeFrequency: "weekly", priority: 0.9 },
  { fr: "/producteurs", en: "/en/producers", changeFrequency: "weekly", priority: 0.8 },
  { fr: "/regions", en: "/en/regions", changeFrequency: "weekly", priority: 0.8 },
  { fr: "/cepages", en: "/en/grapes", changeFrequency: "monthly", priority: 0.8 },
  { fr: "/bonnes-adresses", en: "/en/places", changeFrequency: "weekly", priority: 0.8 },
  { fr: "/guides", en: "/en/guides", changeFrequency: "weekly", priority: 0.8 },
  { fr: "/blog", en: "/en/journal", changeFrequency: "weekly", priority: 0.8 },
  { fr: "/a-propos", en: "/en/about", changeFrequency: "yearly", priority: 0.6 },
  { fr: "/contact", en: "/en/contact", changeFrequency: "yearly", priority: 0.5 },
  { fr: "/newsletter", en: "/en/newsletter", changeFrequency: "monthly", priority: 0.5 },
  {
    fr: "/politique-confidentialite",
    en: "/en/privacy-policy",
    changeFrequency: "yearly",
    priority: 0.2,
  },
];

function alternates(frPath: string, enPath: string) {
  return {
    languages: {
      "fr-CA": `${BASE_URL}${frPath}`,
      "en-CA": `${BASE_URL}${enPath}`,
      "x-default": `${BASE_URL}${frPath}`,
    },
  };
}

function staticEntries(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticPages.flatMap((page) => {
    const alternateLanguages = alternates(page.fr, page.en);

    return [
      {
        url: `${BASE_URL}${page.fr}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: alternateLanguages,
      },
      {
        url: `${BASE_URL}${page.en}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: alternateLanguages,
      },
    ];
  });
}

function dynamicEntries(
  documents: SitemapDocument[],
  frRoute: string,
  enRoute: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
): MetadataRoute.Sitemap {
  return documents
    .filter((document) => document.slug)
    .flatMap((document) => {
      const frPath = `/${frRoute}/${document.slug}`;
      const enPath = `/en/${enRoute}/${document.slug}`;
      const lastModified = document._updatedAt
        ? new Date(document._updatedAt)
        : new Date();

      const alternateLanguages = alternates(frPath, enPath);

      return [
        {
          url: `${BASE_URL}${frPath}`,
          lastModified,
          changeFrequency,
          priority,
          alternates: alternateLanguages,
        },
        {
          url: `${BASE_URL}${enPath}`,
          lastModified,
          changeFrequency,
          priority,
          alternates: alternateLanguages,
        },
      ];
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    wines,
    foods,
    producers,
    regions,
    grapes,
    articles,
    guides,
  ] = await Promise.all([
    client.fetch<SitemapDocument[]>(`
      *[
        _type == "wine" &&
        published == true &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        "slug": slug.current,
        _updatedAt
      }
    `),

    client.fetch<SitemapDocument[]>(`
      *[
        _type == "food" &&
        published == true &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        "slug": slug.current,
        _updatedAt
      }
    `),

    client.fetch<SitemapDocument[]>(`
      *[
        _type == "producer" &&
        published == true &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        "slug": slug.current,
        _updatedAt
      }
    `),

    client.fetch<SitemapDocument[]>(`
      *[
        _type == "region" &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        "slug": slug.current,
        _updatedAt
      }
    `),

    client.fetch<SitemapDocument[]>(`
      *[
        _type == "grape" &&
        slug.current != "assemblage-cepages-hybrides" &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        "slug": slug.current,
        _updatedAt
      }
    `),

    client.fetch<SitemapDocument[]>(`
      *[
        _type == "article" &&
        published == true &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        "slug": slug.current,
        _updatedAt
      }
    `),

    client.fetch<SitemapDocument[]>(`
      *[
        _type == "guide" &&
        published == true &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ]{
        "slug": slug.current,
        _updatedAt
      }
    `),
  ]);

  return [
    ...staticEntries(),
    ...dynamicEntries(wines, "vins", "wines", 0.8, "weekly"),
    ...dynamicEntries(foods, "accords", "pairings", 0.8, "weekly"),
    ...dynamicEntries(producers, "producteurs", "producers", 0.7, "monthly"),
    ...dynamicEntries(regions, "regions", "regions", 0.7, "monthly"),
    ...dynamicEntries(grapes, "cepages", "grapes", 0.7, "monthly"),
    ...dynamicEntries(articles, "blog", "journal", 0.8, "monthly"),
    ...dynamicEntries(guides, "guides", "guides", 0.8, "monthly"),
  ];
}
