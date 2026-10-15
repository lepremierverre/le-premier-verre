import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const result = await client.fetch(`{
  "producers": *[
    _type == "producer" &&
    (
      lower(name) match "*pigeon*hill*" ||
      slug.current match "*pigeon*hill*"
    )
  ]{
    _id,
    name,
    "slug": slug.current,
    published,
    lpvPartner,
    producerType,
    foundedYear,
    municipality,
    address,
    country,
    region,
    website,
    instagram,
    email,
    phone,
    openToVisitors,
    reservationRequired,

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

    mediaPermissionStatus,
    mediaCredit,
    secondaryImageCredit,

    "hero": heroImage.asset->{
      _id,
      originalFilename,
      url,
      metadata { dimensions }
    },

    "photo": photo.asset->{
      _id,
      originalFilename,
      url,
      metadata { dimensions }
    },

    "secondary": secondaryImage.asset->{
      _id,
      originalFilename,
      url,
      metadata { dimensions }
    },

    "signatureGrapes": signatureGrapes[]->{
      _id,
      name,
      "slug": slug.current
    }
  },

  "wines": *[
    _type == "wine" &&
    (
      producer->name match "*Pigeon Hill*" ||
      producer->slug.current match "*pigeon-hill*"
    )
  ] | order(published desc, name asc) {
    _id,
    name,
    vintage,
    "slug": slug.current,
    published,
    beverageType,
    color,
    approxPrice,
    alcohol,
    sugar,
    bottleSize,
    servingTemperature,
    purchaseChannel,
    purchaseUrl,
    purchaseLastChecked,

    oneLiner,
    oneLinerEn,
    tastingKeywords,
    tastingKeywordsEn,
    perfectFor,
    perfectForEn,
    whyWeRecommend,
    whyWeRecommendEn,

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

    "producer": producer->name,
    "region": region->name,
    "appellation": appellation->name,
    "grapes": grapes[]->{_id,name},

    "image": bottleImage.asset->{
      _id,
      originalFilename,
      url,
      metadata { dimensions }
    }
  }
}`);

console.dir(result, { depth: null });
