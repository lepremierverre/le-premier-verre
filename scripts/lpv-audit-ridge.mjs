import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const producers = await client.fetch(`
  *[
    _type == "producer" &&
    (
      name match "*Ridge*" ||
      slug.current match "*ridge*"
    )
  ]{
    _id,
    name,
    "slug": slug.current,
    municipality,
    region,
    country,
    oneLiner,
    oneLinerEn,
    shortBio,
    shortBioEn,
    bio,
    bioEn,
    approach,
    approachEn,
    whyWeFollow,
    whyWeFollowEn,
    openToVisitors,
    reservationRequired,
    visitDetails,
    visitDetailsEn,
    website,
    instagram,
    heroImage,
    grapes[]->{
      _id,
      name,
      "slug": slug.current
    }
  }
`);

console.log("\n===== PRODUCTEUR RIDGE =====");
console.log(JSON.stringify(producers, null, 2));

for (const producer of producers) {
  const wines = await client.fetch(`
    *[
      _type == "wine" &&
      references($producerId)
    ] | order(name asc) {
      _id,
      name,
      vintage,
      "slug": slug.current,
      color,
      type,
      image
    }
  `, { producerId: producer._id });

  console.log(`\n===== VINS LIÉS À ${producer.name} =====`);
  console.log(JSON.stringify(wines, null, 2));
}
