import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  const p = await client.fetch(`
    *[_type == "producer" && slug.current == "vineterra"][0]{
      _id,
      name,
      "slug": slug.current,

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

      heroImage,
      secondaryImage,
      secondaryImageCredit,

      openToVisitors,
      visitDetails,
      visitDetailsEn,

      website,
      instagram,

      wines[]->{
        _id,
        name
      }
    }
  `);

  console.log(JSON.stringify(p, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
