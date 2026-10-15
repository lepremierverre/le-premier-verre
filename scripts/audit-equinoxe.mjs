import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const producers = await client.fetch(`
  *[_type == "producer" &&
    (
      name match "*Équinoxe*" ||
      name match "*Equinoxe*" ||
      slug.current match "*equinoxe*"
    )
  ]{
    _id,
    _type,
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
    facebook,
    openToVisitors,
    reservationRequired,

    "country": country->name,
    "region": region->name,
    "appellation": appellation->name,

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

    "signatureGrapes": signatureGrapes[]->{
      _id,
      name,
      "slug": slug.current
    },

    certifications,
    farmingPractices,
    signatureStyles,

    heroImage,
    photo,
    secondaryImage,
    mediaCredit,
    secondaryImageCredit,
    mediaPermissionStatus,
    mediaPermissionDate,
    mediaPermissionNote,

    seoTitle,
    seoTitleEn,
    seoDescription,
    seoDescriptionEn
  }
`);

console.log("\n===== PRODUCTEUR =====");
console.dir(producers, { depth: 8 });

const producerIds = producers.map(p => p._id);

const wines = producerIds.length
  ? await client.fetch(`
      *[_type == "wine" && producer._ref in $producerIds] | order(name asc){
        _id,
        name,
        vintage,
        "slug": slug.current,
        published,
        color,
        approxPrice,
        purchaseUrl,
        bottleImage,
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
        dnaMetadata
      }
    `, { producerIds })
  : [];

console.log("\n===== VINS / CIDRES RATTACHÉS =====");
console.dir(wines, { depth: 8 });

console.log("\n===== FICHIERS LOCAUX ÉQUINOXE =====");
