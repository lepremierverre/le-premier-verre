import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const guides = await client.fetch(`
  *[_type == "guide"] | order(_createdAt asc) {
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
    "coverImage": coverImage.asset->{
      _id,
      url,
      originalFilename
    }
  }
`);

console.log("\n===== GUIDES LPV =====\n");
console.dir(guides, { depth: null });
