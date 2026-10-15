import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const producers = await client.fetch(`
  *[_type == "producer" && (
    name match "*Joy Hill*" ||
    slug.current match "*joy-hill*"
  )]{
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
    facebook,
    openToVisitors,
    reservationRequired,
    "country": country->name,
    "countryId": country._ref,
    "region": region->name,
    "regionId": region._ref,
    "appellation": appellation->name,
    "appellationId": appellation._ref,
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
    "signatureGrapes": signatureGrapes[]->{_id,name,"slug":slug.current},
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

console.log("\n===== JOY HILL =====");
console.dir(producers, { depth: 10 });

const ids = producers.map(p => p._id);

const wines = ids.length
  ? await client.fetch(`
      *[_type == "wine" && producer._ref in $ids] | order(name asc){
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
    `, { ids })
  : [];

console.log("\n===== VINS JOY HILL =====");
console.dir(wines, { depth: 8 });
