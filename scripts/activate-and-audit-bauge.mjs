import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  await client
    .patch("producer-vignoble-de-la-bauge")
    .set({
      mediaPermissionStatus: "authorized_by_producer",
      mediaCredit: "Vignoble de la Bauge",
      secondaryImageCredit: "Vignoble de la Bauge",
      mediaPermissionNote:
        "Le producteur a autorisé Le Premier Verre à utiliser les photos fournies pour sa fiche.",
    })
    .commit();

  console.log("✓ Photos La Bauge autorisées et activées");

  const examples = await client.fetch(`
    *[
      _type == "wine" &&
      published == true &&
      defined(bottleImage) &&
      defined(body) &&
      defined(acidity) &&
      defined(intensity)
    ][0...3]{
      _id,
      name,
      vintage,
      "slug": slug.current,
      color,
      wineType,
      style,
      approxPrice,
      price,
      purchaseUrl,
      bottleImage,
      producer,
      grapes,
      region,
      country,
      appellation,
      alcohol,
      description,
      descriptionEn,
      tastingNotes,
      tastingNotesEn,
      pairing,
      pairingEn,
      servingTemperature,
      body,
      sweetness,
      roundness,
      acidity,
      tannins,
      fruitIntensity,
      minerality,
      intensity,
      complexity,
      oakInfluence,
      savory,
      dnaMetadata,
      published
    }
  `);

  console.log("\n===== STRUCTURE DE VINS LPV COMPLETS =====");
  console.dir(examples, { depth: 12 });

  const grapes = await client.fetch(`
    *[_type == "grape"]{
      _id,
      name,
      "slug": slug.current
    } | order(name asc)
  `);

  console.log("\n===== CÉPAGES DISPONIBLES PERTINENTS =====");
  console.dir(
    grapes.filter(g =>
      /frontenac|vidal|savagnin|marquette|petite pearl|st.?pépin|seyval/i.test(g.name || "")
    ),
    { depth: 5 }
  );
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
