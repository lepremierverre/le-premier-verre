import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

async function main() {
  const producer = await client.fetch(`
    *[
      _type == "producer" &&
      slug.current == "domaine-du-nival"
    ][0]{
      _id,
      name,
      "slug": slug.current,
      published,
      lpvPartner,
      producerType,
      municipality,
      address,
      foundedYear,
      website,
      instagram,
      openToVisitors,
      reservationRequired,
      "country": country->name,
      "region": region->name,
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
      visitDetails,
      visitDetailsEn,
      "signatureGrapes": signatureGrapes[]->{_id,name},
      heroImage,
      photo,
      secondaryImage,
      "wines": *[
        _type == "wine" &&
        producer._ref == ^._id &&
        published == true
      ]{
        _id,
        name,
        vintage,
        "slug": slug.current,
        color,
        bottleImage
      }
    }
  `);

  console.dir(producer, { depth: 12 });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
