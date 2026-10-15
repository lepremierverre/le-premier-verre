import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const grapes = await client.fetch(`
  *[_type == "grape" && lower(name) in [
    "gamay",
    "chardonnay",
    "melon de bourgogne",
    "pinot blanc",
    "blaufränkisch",
    "grüner veltliner",
    "riesling",
    "pineau d'aunis"
  ]]{
    _id,
    name,
    "slug": slug.current
  }
`);

const countries = await client.fetch(`
  *[_type == "country" && name match "Canada"]{
    _id,
    name,
    "slug": slug.current
  }
`);

const regions = await client.fetch(`
  *[_type == "region" && (
    name match "*Cantons*" ||
    name match "*Estrie*" ||
    nameEn match "*Eastern Townships*"
  )]{
    _id,
    name,
    nameEn,
    "slug": slug.current
  }
`);

console.log("\n===== CÉPAGES TROUVÉS =====");
console.table(grapes);

console.log("\n===== CANADA =====");
console.table(countries);

console.log("\n===== RÉGIONS =====");
console.table(regions);
