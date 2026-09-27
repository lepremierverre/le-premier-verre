import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q")?.trim();
  const locale = searchParams.get("locale") === "en" ? "en" : "fr";

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const query = `
    *[
      !(_id in path("drafts.**")) &&
      (
        _type == "wine" ||
        _type == "producer" ||
        _type == "country" ||
        _type == "region" ||
        (_type == "grape" && slug.current != "assemblage-cepages-hybrides") ||
        _type == "article" ||
        _type == "guide"
      ) &&
      (
        name match $search + "*" ||
        title match $search + "*" ||
        nameEn match $search + "*" ||
        titleEn match $search + "*"
      ) &&
      (
        !defined(published) ||
        published == true
      )
    ][0...20]{
      _id,
      _type,
      "title": select(
        $locale == "en" => coalesce(titleEn, nameEn, title, name),
        coalesce(title, name)
      ),
      "slug": slug.current
    }
  `;

  const results = await client.fetch(query, {
    search: q,
    locale,
  });

  return NextResponse.json(results);
}
