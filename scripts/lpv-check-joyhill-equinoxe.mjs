import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

for (const search of ["joy", "equinoxe", "équinoxe"]) {
  const producers = await client.fetch(`
    *[
      _type == "producer" &&
      (
        lower(name) match $search ||
        lower(slug.current) match $search
      )
    ]{
      _id,
      name,
      "slug": slug.current,
      published,
      website,
      instagram,
      "wines": *[
        _type == "wine" &&
        references(^._id)
      ]{
        _id,
        name,
        "slug": slug.current,
        published,
        beverageType,
        color,
        vintage,
        "bottle": bottleImage.asset->originalFilename,
        "editorial": editorialImage.asset->originalFilename
      }
    }
  `, { search: `*${search}*` });

  if (producers.length) {
    console.log(`\n===== ${search.toUpperCase()} =====`);
    console.dir(producers, { depth: null });
  }
}
