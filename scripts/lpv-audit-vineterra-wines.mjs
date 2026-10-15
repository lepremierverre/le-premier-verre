import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const wines = await client.fetch(`
  *[
    _type == "wine" &&
    (
      name match "*Cheval*" ||
      name match "*Magie*" ||
      name match "*Lac sans fond*" ||
      name match "*Apasciaro*" ||
      name match "*Revivo*" ||
      name match "*Vineterra*" ||
      producer->name match "*Vineterra*"
    )
  ] | order(name asc) {
    _id,
    name,
    vintage,
    "slug": slug.current,
    color,
    type,
    image,
    "producerId": producer->_id,
    "producer": producer->name,
    "producerSlug": producer->slug.current
  }
`);

console.log("===== VINS VINETERRA OU CUVÉES ASSOCIÉES =====");
console.log(JSON.stringify(wines, null, 2));
