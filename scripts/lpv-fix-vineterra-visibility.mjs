import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const producerId = "producer-vineterra";

  const producer = await client.getDocument(producerId);

  if (!producer || producer.slug?.current !== "vineterra") {
    throw new Error("Vineterra introuvable. Rien n'a été modifié.");
  }

  const country = await client.fetch(`
    *[
      _type == "country" &&
      (
        lower(name) == "canada" ||
        slug.current == "canada"
      )
    ][0]{
      _id,
      name,
      "slug": slug.current
    }
  `);

  if (!country?._id) {
    throw new Error("Référence Canada introuvable. Rien n'a été modifié.");
  }

  const regions = await client.fetch(`
    *[
      _type == "region" &&
      (
        lower(name) match "*montérégie*" ||
        lower(name) match "*monteregie*" ||
        slug.current match "*monteregie*"
      )
    ]{
      _id,
      name,
      "slug": slug.current
    }
  `);

  console.log("Canada trouvé :", country);
  console.log("Régions Montérégie trouvées :", regions);

  if (regions.length !== 1) {
    throw new Error(
      `Il faut exactement 1 région Montérégie. Trouvé : ${regions.length}. Rien n'a été modifié.`
    );
  }

  const region = regions[0];

  const heroPath =
    "public/images/lpv/producteurs/Vineterra Edited-28.PNG";

  if (!fs.existsSync(heroPath)) {
    throw new Error(`Hero introuvable : ${heroPath}`);
  }

  console.log("\nUpload de la hero Vineterra...");

  const heroAsset = await client.assets.upload(
    "image",
    fs.createReadStream(heroPath),
    {
      filename: "Vineterra Edited-28.PNG",
      title: "Domaine Vineterra",
    }
  );

  console.log("Hero uploadée :", heroAsset._id);

  await client
    .patch(producerId)
    .set({
      country: {
        _type: "reference",
        _ref: country._id,
      },
      region: {
        _type: "reference",
        _ref: region._id,
      },
      heroImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: heroAsset._id,
        },
      },
      mediaPermissionStatus: "provided_by_producer",
      mediaCredit: "Domaine Vineterra",
      lpvPartner: true,
      published: true,
    })
    .commit();

  const check = await client.fetch(`
    *[_id == $id][0]{
      _id,
      name,
      "slug": slug.current,
      published,
      lpvPartner,
      municipality,
      mediaPermissionStatus,
      mediaCredit,
      heroImage,
      country->{_id, name, "slug": slug.current},
      region->{_id, name, "slug": slug.current}
    }
  `, { id: producerId });

  console.log("\n===== VINETERRA APRÈS PATCH =====");
  console.log(JSON.stringify(check, null, 2));

  if (
    check?.published !== true ||
    check?.lpvPartner !== true ||
    check?.country?.slug !== "canada" ||
    !check?.region ||
    !check?.heroImage
  ) {
    throw new Error("La validation finale a échoué.");
  }

  console.log("\n✓ Publié");
  console.log("✓ Partenaire LPV");
  console.log("✓ Canada");
  console.log("✓ Région :", check.region.name);
  console.log("✓ Hero présente");
  console.log("✓ Crédit : © Domaine Vineterra");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
