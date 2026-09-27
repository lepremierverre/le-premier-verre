import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";

const BASE_URL = "https://lepremierverre.com";

export type SeoEntity =
  | "wine"
  | "food"
  | "producer"
  | "region"
  | "grape"
  | "place"
  | "article"
  | "guide";

type SeoDocument = {
  title?: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
};

const routeMap: Record<
  SeoEntity,
  { fr: string; en: string }
> = {
  wine: { fr: "vins", en: "wines" },
  food: { fr: "accords", en: "pairings" },
  producer: { fr: "producteurs", en: "producers" },
  region: { fr: "regions", en: "regions" },
  grape: { fr: "cepages", en: "grapes" },
  place: { fr: "bonnes-adresses", en: "places" },
  article: { fr: "blog", en: "journal" },
  guide: { fr: "guides", en: "guides" },
};

const queries: Record<SeoEntity, string> = {
  wine: `
    *[
      _type == "wine" &&
      slug.current == $slug &&
      published == true &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": name,
      "titleEn": name,
      "description": coalesce(oneLiner, editorialNote),
      "descriptionEn": coalesce(oneLinerEn, oneLiner)
    }
  `,

  food: `
    *[
      _type == "food" &&
      slug.current == $slug &&
      published == true &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": coalesce(seoTitle, name),
      "titleEn": coalesce(seoTitleEn, nameEn, seoTitle, name),
      "description": coalesce(seoDescription, oneLiner),
      "descriptionEn": coalesce(seoDescriptionEn, oneLinerEn, seoDescription, oneLiner)
    }
  `,

  producer: `
    *[
      _type == "producer" &&
      slug.current == $slug &&
      published == true &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": name,
      "titleEn": name,
      "description": coalesce(oneLiner, shortBio),
      "descriptionEn": coalesce(oneLinerEn, shortBioEn, oneLiner, shortBio)
    }
  `,

  region: `
    *[
      _type == "region" &&
      slug.current == $slug &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": name,
      "titleEn": coalesce(nameEn, name),
      "description": locationText,
      "descriptionEn": coalesce(locationTextEn, locationText)
    }
  `,

  grape: `
    *[
      _type == "grape" &&
      slug.current == $slug &&
      slug.current != "assemblage-cepages-hybrides" &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": name,
      "titleEn": name,
      "description": coalesce(oneLiner, description),
      "descriptionEn": coalesce(oneLinerEn, descriptionEn, oneLiner)
    }
  `,

  place: `
    *[
      _type == "place" &&
      slug.current == $slug &&
      published == true &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": name,
      "titleEn": name,
      "description": description,
      "descriptionEn": coalesce(descriptionEn, description)
    }
  `,

  article: `
    *[
      _type == "article" &&
      slug.current == $slug &&
      published == true &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": title,
      titleEn,
      "description": excerpt,
      "descriptionEn": coalesce(excerptEn, excerpt)
    }
  `,

  guide: `
    *[
      _type == "guide" &&
      slug.current == $slug &&
      published == true &&
      !(_id in path("drafts.**"))
    ][0] {
      "title": title,
      titleEn,
      "description": excerpt,
      "descriptionEn": coalesce(excerptEn, excerpt)
    }
  `,
};

function cleanDescription(value?: string) {
  if (!value || typeof value !== "string") return undefined;

  const cleaned = value.replace(/\s+/g, " ").trim();

  if (!cleaned) return undefined;

  return cleaned.length > 160
    ? `${cleaned.slice(0, 157).trimEnd()}…`
    : cleaned;
}

export async function buildDynamicMetadata({
  entity,
  slug,
  locale,
}: {
  entity: SeoEntity;
  slug: string;
  locale: "fr" | "en";
}): Promise<Metadata> {
  const document = await client.fetch<SeoDocument | null>(
    queries[entity],
    { slug }
  );

  const routes = routeMap[entity];

  const frPath = `/${routes.fr}/${slug}`;
  const enPath = `/en/${routes.en}/${slug}`;

  const canonicalPath = locale === "en" ? enPath : frPath;

  const title =
    locale === "en"
      ? document?.titleEn || document?.title || "Le Premier Verre"
      : document?.title || "Le Premier Verre";

  const description = cleanDescription(
    locale === "en"
      ? document?.descriptionEn || document?.description
      : document?.description
  );

  return {
    title,
    description,

    alternates: {
      canonical: canonicalPath,
      languages: {
        "fr-CA": frPath,
        "en-CA": enPath,
        "x-default": frPath,
      },
    },

    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonicalPath}`,
      siteName: "Le Premier Verre",
      locale: locale === "en" ? "en_CA" : "fr_CA",
      type: "website",
    },
  };
}
