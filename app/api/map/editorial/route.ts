import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const editorialMapQuery = `{
  "producers": *[
    _type == "producer" &&
    published == true
  ] | order(name asc)[0...3] {
    _id,
    name,
    "slug": slug.current,
    municipality,
    oneLiner,
    "imageUrl": coalesce(heroImage.asset->url, photo.asset->url),
    country->{name},
    region->{name}
  },

  "regions": *[
    _type == "region"
  ] | order(name asc)[0...3] {
    _id,
    name,
    "slug": slug.current,
    "imageUrl": heroImage.asset->url,
    description,
    country->{name}
  },

  "guides": *[
    _type == "guide" &&
    published == true
  ] | order(publishedAt desc, _createdAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imageUrl": coverImage.asset->url,
    guideType
  },

  "articles": *[
    _type == "article" &&
    !(_id in path("drafts.**")) &&
    !(slug.current in [
      "recevoir-sans-se-compliquer-la-vie",
      "une-journee-cantons-de-l-est",
      "comment-choisir-une-bouteille-quand-on-ne-connait-rien-au-vin"
    ])
  ] | order(publishedAt desc, _createdAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    "imageUrl": coverImage.asset->url
  }
}`;

export async function GET() {
  try {
    const data = await client.fetch(editorialMapQuery);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Map editorial content error:", error);

    return NextResponse.json(
      {
        producers: [],
        regions: [],
        guides: [],
        articles: [],
      },
      { status: 500 }
    );
  }
}
