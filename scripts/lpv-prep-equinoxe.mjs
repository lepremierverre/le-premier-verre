import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const producer = await client.fetch(`
  *[_id == "producer-ferme-cidricole-equinoxe"][0]{
    _id, name, "slug": slug.current, website, instagram
  }
`);

const category = await client.fetch(`
  *[_id == "category-cidres" || lower(name) match "*cidre*"]{
    _id, name, "slug": slug.current
  }
`);

const foods = await client.fetch(`
  *[_type == "food"] | order(name asc) {
    _id, name, nameEn, "slug": slug.current
  }
`);

const refs = await client.fetch(`
  *[_id in [
    "d9fc0ce6-5f30-4e00-8bc5-63146a0a6407",
    "region-quebec",
    "55a9fe9a-b3fe-41d6-8145-6adca1a818a8"
  ]]{
    _id, _type, name, nameEn
  }
`);

console.log("\n===== ÉQUINOXE — PRÉPARATION =====");

console.log("\nPRODUCTEUR");
console.dir(producer, {depth:null});

console.log("\nCATÉGORIE CIDRE");
console.dir(category, {depth:null});

console.log("\nPAYS / RÉGION");
console.dir(refs, {depth:null});

console.log("\nACCORDS DISPONIBLES");
for (const f of foods) {
  console.log(`${f._id} | ${f.name} | ${f.nameEn || ""}`);
}

console.log("\n===== FIN =====");
