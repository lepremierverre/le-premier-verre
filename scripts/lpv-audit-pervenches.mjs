import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  console.log("\n========================================");
  console.log("LES PERVENCHES — AUDIT SANITY");
  console.log("========================================\n");

  const producers = await client.fetch(`
    *[
      _type == "producer" &&
      (
        name match "*Pervenches*" ||
        slug.current match "*pervenches*"
      )
    ]{
      _id,
      _type,
      name,
      "slug": slug.current,
      producerType,
      published,
      lpvPartner,

      municipality,
      address,
      phone,
      email,
      website,
      instagram,
      foundedYear,

      openToVisitors,
      reservationRequired,
      visitDetails,
      visitDetailsEn,

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

      mediaPermissionStatus,
      mediaCredit,
      mediaPermissionDate,
      mediaPermissionNote,

      "photo": photo.asset->{
        _id,
        originalFilename,
        url,
        metadata{dimensions}
      },
      "heroImage": heroImage.asset->{
        _id,
        originalFilename,
        url,
        metadata{dimensions}
      },
      "secondaryImage": secondaryImage.asset->{
        _id,
        originalFilename,
        url,
        metadata{dimensions}
      },
      secondaryImageCredit,

      "country": country->{_id,name,"slug":slug.current},
      "region": region->{_id,name,"slug":slug.current},

      "signatureGrapes": signatureGrapes[]->{
        _id,
        name,
        "slug": slug.current
      }
    }
  `);

  if (!producers.length) {
    console.log("⚠️ Aucun producteur Les Pervenches trouvé dans Sanity.");
  } else {
    console.log(`✓ ${producers.length} producteur(s) trouvé(s)\n`);
    console.dir(producers, { depth: null });
  }

  const ids = producers.map((p) => p._id);

  let wines = [];

  if (ids.length) {
    wines = await client.fetch(
      `
      *[
        _type == "wine" &&
        producer._ref in $ids
      ] | order(name asc){
        _id,
        name,
        "slug": slug.current,
        vintage,
        color,
        published,
        approxPrice,
        purchaseChannel,
        purchaseChannelDetails,
        purchaseUrl,
        purchaseLastChecked,
        oneLiner,
        oneLinerEn,
        tastingKeywords,
        perfectFor,
        beverageType,
        "producer": producer->{name,"slug":slug.current},
        "country": country->{name,"slug":slug.current},
        "region": region->{name,"slug":slug.current},
        "appellation": appellation->{name,"slug":slug.current},
        "grapes": grapes[]->{name,"slug":slug.current},
        "bottleImage": bottleImage.asset->{
          _id,
          originalFilename,
          url,
          metadata{dimensions}
        },
        dna,
        dnaMetadata
      }
    `,
      { ids }
    );
  }

  console.log("\n========================================");
  console.log("VINS LIÉS");
  console.log("========================================\n");

  if (!wines.length) {
    console.log("⚠️ Aucun vin lié aux Pervenches.");
  } else {
    console.log(`✓ ${wines.length} vin(s) lié(s)\n`);
    console.dir(wines, { depth: null });
  }

  console.log("\n========================================");
  console.log("RÉSUMÉ");
  console.log("========================================\n");

  for (const p of producers) {
    console.log(`Producteur        : ${p.name}`);
    console.log(`ID                : ${p._id}`);
    console.log(`Slug              : ${p.slug}`);
    console.log(`Type              : ${p.producerType ?? "MANQUANT"}`);
    console.log(`Publié            : ${p.published ?? "MANQUANT"}`);
    console.log(`Partenaire LPV    : ${p.lpvPartner ?? "MANQUANT"}`);
    console.log(`Municipalité      : ${p.municipality ?? "MANQUANT"}`);
    console.log(`Instagram         : ${p.instagram ?? "MANQUANT"}`);
    console.log(`Site              : ${p.website ?? "MANQUANT"}`);
    console.log(`Hero              : ${p.heroImage?.originalFilename ?? "MANQUANT"}`);
    console.log(`Photo secondaire  : ${p.secondaryImage?.originalFilename ?? "MANQUANT"}`);
    console.log(`Crédit média      : ${p.mediaCredit ?? "MANQUANT"}`);
    console.log(`Bio FR            : ${p.bio?.length ?? 0} bloc(s)`);
    console.log(`Bio EN            : ${p.bioEn?.length ?? 0} bloc(s)`);
    console.log(`Approche FR       : ${p.approach?.length ?? 0} bloc(s)`);
    console.log(`Approche EN       : ${p.approachEn?.length ?? 0} bloc(s)`);
    console.log(`Cépages signature : ${p.signatureGrapes?.length ?? 0}`);
    console.log(`Vins liés         : ${wines.filter(w => w.producer?.slug === p.slug).length}`);
    console.log("");
  }
}

main().catch((err) => {
  console.error("\n❌ AUDIT ÉCHOUÉ");
  console.error(err);
  process.exit(1);
});
