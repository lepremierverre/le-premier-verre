import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const editorialQuery = `{
  "articles": *[
    _type == "article" &&
    published == true &&
    !(_id in path("drafts.**"))
  ] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    titleEn,
    "slug": slug.current,
    excerpt,
    excerptEn,
    category,
    categoryEn,
    "imageUrl": coverImage.asset->url,
    publishedAt
  },

  "guides": *[
    _type == "guide" &&
    published == true
  ] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    titleEn,
    "slug": slug.current,
    excerpt,
    excerptEn,
    guideType,
    difficulty,
    estimatedReadingTime,
    estimatedReadingTimeEn,
    "imageUrl": coverImage.asset->url,
    publishedAt
  }
}`;

export async function GET() {
  try {
    const data = await client.fetch(editorialQuery);

    return NextResponse.json(data);
  } catch (error) {
    console.error("LPV editorial content error:", error);

    return NextResponse.json(
      {
        articles: [],
        guides: [],
      },
      { status: 500 }
    );
  }
}
