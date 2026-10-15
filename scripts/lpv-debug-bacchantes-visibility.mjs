import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  console.log("\n===== COMPARAISON VINETERRA / BACCHANTES =====");

  const docs = await client.fetch(`
    *[_id in ["producer-vineterra", "producer-les-bacchantes"]]{
      _id,
      _type,
      name,
      "slug": slug.current,
      published,
      lpvPartner,
      municipality,

      "countryId": country._ref,
      "country": country->name,

      "regionId": region._ref,
      "region": region->name,

      openToVisitors,
      reservationRequired,

      "hero": heroImage.asset._ref,
      "photo": photo.asset._ref,
      "logo": logo.asset._ref,

      mediaPermissionStatus,

      oneLiner,
      shortBio,

      "bioCount": count(bio),
      "approachCount": count(approach)
    }
  `);

  console.log(JSON.stringify(docs, null, 2));

  console.log("\n===== TEST REQUÊTE SIMPLE =====");

  const bacchantes = await client.fetch(`
    *[
      _type == "producer" &&
      slug.current == "les-bacchantes"
    ][0]{
      _id,
      name,
      "slug": slug.current,
      published,
      lpvPartner
    }
  `);

  console.log(JSON.stringify(bacchantes, null, 2));

  console.log("\n===== PRODUCTEURS PUBLIÉS =====");

  const published = await client.fetch(`
    *[
      _type == "producer" &&
      published == true
    ] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      lpvPartner
    }
  `);

  const visible = published.find(
    (p) => p._id === "producer-les-bacchantes"
  );

  console.log(
    visible
      ? "✓ Les Bacchantes passe published == true"
      : "✗ Les Bacchantes ne passe PAS published == true"
  );

  console.log("\n===== PARTENAIRES PUBLIÉS =====");

  const partners = await client.fetch(`
    *[
      _type == "producer" &&
      published == true &&
      lpvPartner == true
    ] | order(name asc) {
      _id,
      name,
      "slug": slug.current
    }
  `);

  console.log(
    partners.map((p) => `${p.name} | ${p.slug}`).join("\n")
  );
}

main().catch((error) => {
  console.error("\nERREUR :", error);
  process.exit(1);
});
