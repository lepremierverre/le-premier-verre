import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const all = await client.fetch(`
  *[_type == "producer" && published == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    published,
    lpvPartner,
    municipality,
    heroImage,
    mediaPermissionStatus,
    country->{name, "slug": slug.current},
    region->{name, "slug": slug.current}
  }
`);

const vineterra = all.find(
  (p) => p._id === "producer-vineterra" || p.slug === "vineterra"
);

console.log("\nVINETERRA DANS LA QUERY PUBLIÉE :");
console.log(JSON.stringify(vineterra ?? null, null, 2));

console.log("\nNOMBRE TOTAL DE PRODUCTEURS PUBLIÉS :", all.length);

console.log("\nPARTENAIRES PUBLIÉS :");
console.log(
  all
    .filter((p) => p.lpvPartner === true)
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      municipality: p.municipality,
      country: p.country?.name ?? null,
      region: p.region?.name ?? null,
      hasHero: !!p.heroImage,
    }))
);
