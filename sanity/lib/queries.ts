const wineVisibilityFilter = "&& published == true";

export const articlesQuery = `*[
  _type == "article" &&
  !(_id in path("drafts.**")) &&
  !(slug.current in [
    "recevoir-sans-se-compliquer-la-vie",
    "une-journee-cantons-de-l-est",
    "comment-choisir-une-bouteille-quand-on-ne-connait-rien-au-vin"
  ])
] | order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  excerpt,
  excerptEn,
  category,
  categoryEn,
  coverImage,
  author,
  publishedAt,
  _createdAt
}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  excerpt,
  excerptEn,
  content[]{
    ...,
    _type == "articleWineCard" => {
      _key,
      _type,
      wine->{
        _id,
        name,
        "slug": slug.current,
        vintage,
        color,
        bottleImage,
        approxPrice,
        oneLiner,
        producer->{
          _id,
          name,
          "slug": slug.current
        }
      }
    },
    _type == "articleProducerCard" => {
      _key,
      _type,
      producer->{
        _id,
        name,
        "slug": slug.current,
        municipality,
        heroImage,
        oneLiner,
        openToVisitors
      }
    },
    _type == "articlePlaceCard" => {
      _key,
      _type,
      place->{
        _id,
        name,
        "slug": slug.current,
        type,
        city,
        region,
        address,
        website,
        coverImage,
        published
      }
    }
  },
  contentEn[]{
    ...,
    _type == "articleWineCard" => {
      _key,
      _type,
      wine->{
        _id,
        name,
        "slug": slug.current,
        vintage,
        color,
        bottleImage,
        approxPrice,
        oneLiner,
        oneLinerEn,
        producer->{
          _id,
          name,
          "slug": slug.current
        }
      }
    },
    _type == "articleProducerCard" => {
      _key,
      _type,
      producer->{
        _id,
        name,
        "slug": slug.current,
        municipality,
        heroImage,
        oneLiner,
        oneLinerEn,
        openToVisitors
      }
    },
    _type == "articlePlaceCard" => {
      _key,
      _type,
      place->{
        _id,
        name,
        "slug": slug.current,
        type,
        city,
        region,
        address,
        website,
        coverImage,
        published
      }
    }
  },
  category,
  categoryEn,
  coverImage,
  "imageUrl": coverImage.asset->url,
  author,
  tags,
  tagsEn,
  tagsJson,
  publishedAt,
  _createdAt,
  relatedWines[]->{
    _id,
    name,
    "slug": slug.current,
    vintage,
    color,
    bottleImage,
    editorialImage{
      asset,
      hotspot,
      crop,
      alt,
      credit
    },
    approxPrice,
    oneLiner,
    oneLinerEn,
    producer->{
      _id,
      name,
      "slug": slug.current
    }
  }
}`;

export const guidesQuery = `*[_type == "guide" && published == true] | order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  excerpt,
  excerptEn,
  coverImage,
  guideType,
  difficulty,
  estimatedReadingTime,
  estimatedReadingTimeEn,
  publishedAt,
  _createdAt
}`;

export const guideBySlugQuery = `*[_type == "guide" && slug.current == $slug && published == true][0] {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  excerpt,
  excerptEn,
  content,
  contentEn,
  coverImage,
  "imageUrl": coverImage.asset->url,
  guideType,
  difficulty,
  estimatedReadingTime,
  estimatedReadingTimeEn,
  publishedAt,
  _createdAt,
  relatedCountries[]->{_id, name, "slug": slug.current},
  relatedRegions[]->{_id, name, "slug": slug.current},
  relatedAppellations[]->{_id, name, "slug": slug.current},
  relatedGrapes[]->{_id, name, "slug": slug.current},
  relatedArticles[]->{
    _id,
    title,
    titleEn,
    "slug": slug.current,
    excerpt,
    excerptEn,
    category,
    categoryEn,
    coverImage
  },
  relatedWines[]->{_id, name, "slug": slug.current, vintage, color, bottleImage},
  relatedProducers[]->{_id, name, "slug": slug.current, logo, photo},
  relatedPlaces[]->{_id, name, "slug": slug.current, type, city, coverImage}
}`;

export const vineyardsQuery = `*[_type == "vineyard" && published == true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  excerpt,
  city,
  province,
  coverImage,
  hasRestaurant,
  hasAccommodation,
  hasTerrace,
  hasShop,
  hasGuidedTour,
  hasTasting
}`;

export const vineyardBySlugQuery = `*[_type == "vineyard" && slug.current == $slug && published == true][0] {
  _id,
  name,
  "slug": slug.current,
  logo,
  coverImage,
  gallery,
  excerpt,
  description,
  address,
  city,
  province,
  country->{name, "slug": slug.current},
  latitude,
  longitude,
  phone,
  email,
  website,
  instagram,
  facebook,
  bookingUrl,
  hasRestaurant,
  hasAccommodation,
  hasTerrace,
  hasShop,
  hasGuidedTour,
  hasTasting,
  allowsPets,
  openingHours,
  averagePrice,
  producers[]->{_id, name, "slug": slug.current, logo},
  wines[]->{_id, name, "slug": slug.current, vintage, color, bottleImage},
  articles[]->{_id, title, "slug": slug.current, excerpt, coverImage}
}`;

export const producersQuery = `*[_type == "producer" && published == true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  municipality,
  logo,
  photo,
  heroImage,
  mediaPermissionStatus,
  mediaCredit,
  lpvPartner,
  producerType,
  oneLiner,
  oneLinerEn,
  shortBio,
  shortBioEn,
  country->{name, "slug": slug.current},
  region->{name, "slug": slug.current}
}`;

export const producerBySlugQuery = `*[_type == "producer" && slug.current == $slug && published == true][0] {
  _id,
  name,
  "slug": slug.current,
  lpvPartner,
  producerType,

  municipality,
  country->{name, "slug": slug.current},
  region->{name, "slug": slug.current},
  appellation->{name, "slug": slug.current},

  logo,
  photo,
  heroImage,
  secondaryImage,
  secondaryImageCredit,

  mediaPermissionStatus,
  mediaCredit,
  mediaPermissionDate,
  mediaPermissionNote,

  oneLiner,
  oneLinerEn,
  shortBio,
  shortBioEn,
  bio,
  bioEn,

  approach[]{
    _key,
    title,
    text
  },

  approachEn[]{
    _key,
    title,
    text
  },

  signatureGrapes[]->{
    _id,
    name,
    "slug": slug.current
  },

  whyWeFollow,
  whyWeFollowEn,

  openToVisitors,
  visitDetails,
  visitDetailsEn,
  address,
  reservationRequired,
  website,

  foundedYear,
  founder,
  currentOwner,
  winemaker,
  philosophy,
  farmingPractices,
  certifications,
  signatureStyles,
  instagram,
  facebook,
  email,
  phone,

  "wines": *[
    _type == "wine" &&
    published == true &&
    references(^._id)
  ] | order(vintage desc, name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    beverageType,
    alcoholFree,
    color,
    bottleImage,
    editorialImage{
      asset,
      hotspot,
      crop,
      alt,
      credit
    },
    approxPrice
  },

  articles[]->{_id, title, "slug": slug.current, excerpt, coverImage},
  guides[]->{_id, title, "slug": slug.current, excerpt, coverImage}
}`;

export const winesQuery = `*[_type == "wine" ${wineVisibilityFilter}] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  vintage,
  beverageType,
  alcoholFree,
  color,
  style,
  appleVarieties,
  saqPrice,
  bottleImage,
  editorialImage{
    asset,
    hotspot,
    crop,
    alt,
    credit
  },
  producer->{name, "slug": slug.current},
  vineyard->{name, "slug": slug.current},
  country->{name, "slug": slug.current},
  region->{name, "slug": slug.current},
  appellation->{name, "slug": slug.current}
}`;

export const wineBySlugQuery = `*[_type == "wine" && slug.current == $slug ${wineVisibilityFilter}][0] {
  _id,
  name,
  "slug": slug.current,
  vintage,
  beverageType,
  alcoholFree,
  color,
  style,
  appleVarieties,
  bottleImage,
  editorialImage{
    asset,
    hotspot,
    crop,
    alt,
    credit
  },
  labelImage,
  producer->{_id, name, "slug": slug.current, logo},
  vineyard->{_id, name, "slug": slug.current, coverImage},
  country->{name, "slug": slug.current},
  region->{name, "slug": slug.current},
  "isQuebec": coalesce(country->name == "Canada" && region->name match "Québec*", false),
  appellation->{name, "slug": slug.current},
  grapes[]->{name, "slug": slug.current},
  saqPrice,
  domainPrice,
  availableAtSaq,
  availableAtDomain,
  servingTemperature,
  cellaringPotential,
  alcohol,
  sugar,
  acidity,
  body,
  tannins,
  isOrganic,
  isNatural,
  isBiodynamic,
  isVegan,
  foodPairings[]->{_id, name, nameEn, "slug": slug.current, category, image},
  articles[]->{_id, title, "slug": slug.current, excerpt, coverImage},
  tastingNotes,

  approxPrice,
  purchaseChannel,
  purchaseChannelDetails,
  purchaseChannelDetailsEn,
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
  tastingNotesEn,
  editorialNoteEn,

  sweetness,
  roundness,
  decant,

  certifications,
  aromas,
  flavors,
  texture,
  finish,
  intensity,
  complexity,
  oakInfluence,
  aging,
  soil,
  harvestMethod,
  bottleSize,
  sku,
  editorialNote,
  occasionTags,
  experienceLevel
}`;

export const placesQuery = `*[_type == "place" && published == true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  type,
  city,
  region,
  highlights,
  highlightsEn,
  coverImage,
  lpvPartner,
  mediaPermissionStatus,
  mediaCredit
}`;

export const placeBySlugQuery = `*[_type == "place" && slug.current == $slug && published == true][0] {
  _id,
  name,
  "slug": slug.current,
  type,
  city,
  region,
  highlights,
  highlightsEn,
  address,
  website,
  instagram,
  instagramPosts[]{url},
  description,
  descriptionEn,
  coverImage,
  secondaryImage,
  secondaryImageCredit,
  mediaPermissionStatus,
  mediaCredit,
  lpvPartner,

  producer->{
    _id,
    name,
    "slug": slug.current
  },

  availableWines[]->{
    _id,
    name,
    "slug": slug.current,
    vintage,
    color,
    bottleImage,
    approxPrice,
    producer->{_id, name, "slug": slug.current}
  },

  "producerWines": *[
    _type == "wine" &&
    published == true &&
    producer._ref == ^.producer._ref
  ] | order(vintage desc, name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    color,
    bottleImage,
    approxPrice,
    producer->{_id, name, "slug": slug.current}
  }
}`;

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug && published == true][0] {
  _id,
  title,
  "slug": slug.current,
  pageType,
  heroTitle,
  heroText,
  coverImage,
  content,
  seoTitle,
  seoDescription
}`;

export const homeSettingsQuery = `*[_type == "siteSettings"][0] {
  heroEyebrow,
  heroTitle,
  heroText,
  primaryButtonLabel,
  primaryButtonHref,
  secondaryButtonLabel,
  secondaryButtonHref,
  introTitle,
  introText
}`;

import { client } from "@/sanity/lib/client";

export async function getArticles() {
  return client.fetch(articlesQuery);
}

export async function getArticle(slug: string) {
  return client.fetch(articleBySlugQuery, { slug });
}

export async function getGuide(slug: string) {
  return client.fetch(guideBySlugQuery, { slug });
}

export async function getRelatedArticles(category?: string, currentId?: string) {
  if (!category || !currentId) {
    return client.fetch(
      `*[_type == "article" && !(_id in path("drafts.**"))][0...3] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        category,
        coverImage,
        publishedAt,
        _createdAt
      }`
    );
  }

  return client.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && category == $category && _id != $currentId][0...3] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      category,
      coverImage,
      publishedAt,
      _createdAt
    }`,
    { category, currentId }
  );
}


export const countriesQuery = `*[_type == "country"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  descriptionEn
}`;

export const countryBySlugQuery = `*[_type == "country" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  descriptionEn,
  wineHistory,
  wineHistoryEn,
  climate,
  climateEn,
  wineSurface,
  wineSurfaceEn,
  annualProduction,
  annualProductionEn,
  mainWineStyles,
  mainWineStylesEn,
  seoTitle,
  seoTitleEn,
  seoDescription,
  seoDescriptionEn,
  "regionCount": count(*[_type == "region" && references(^._id)]),
  "appellationCount": count(*[_type == "appellation" && references(^._id)]),
  "producerCount": count(*[_type == "producer" && published == true && references(^._id)]),
  "vineyardCount": count(*[_type == "vineyard" && published == true && references(^._id)]),
  "wineCount": count(*[_type == "wine" && published == true && references(^._id)]),
  "regions": *[_type == "region" && references(^._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description
  },
  "appellationCount": count(*[_type == "appellation" && references(^._id)]),
  "producerCount": count(*[_type == "producer" && published == true && references(^._id)]),
  "vineyardCount": count(*[_type == "vineyard" && published == true && references(^._id)]),
  "wineCount": count(*[_type == "wine" && published == true && references(^._id)]),
  "appellations": *[_type == "appellation" && references(^._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  },
  "producers": *[_type == "producer" && published == true && references(^._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo
  },
  "vineyards": *[_type == "vineyard" && published == true && references(^._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    city,
    province,
    coverImage
  },
  "wines": *[_type == "wine" && published == true && references(^._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    color,
    bottleImage
  }
}`;

export const regionsQuery = `*[_type == "region"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  descriptionEn,
  introduction,
  introductionEn,
  heroImage,
  country->{name, "slug": slug.current}
}`;

export const regionBySlugQuery = `*[_type == "region" && slug.current == $slug][0] {
  _id,
  name,
  nameEn,
  "slug": slug.current,

  country->{name, nameEn, "slug": slug.current},
  parentRegion->{name, nameEn, "slug": slug.current},

  heroImage,

  introduction,
  introductionEn,
  locationText,
  locationTextEn,

  latitude,
  longitude,
  mapZoom,

  mapPolygon[]{
    _key,
    latitude,
    longitude
  },

  climate,
  climateEn,

  signatureGrapes[]->{
    _id,
    name,
    nameEn,
    "slug": slug.current
  },

  characteristics[]{
    _key,
    title,
    text
  },

  characteristicsEn[]{
    _key,
    title,
    text
  },

  guides[]->{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage
  },

  description,
  descriptionEn,
  overview,
  overviewEn,
  soilTypes,
  soilTypesEn,
  mainWineStyles,
  mainWineStylesEn,
  seoTitle,
  seoTitleEn,
  seoDescription,
  seoDescriptionEn,

  "appellations": *[
    _type == "appellation" &&
    references(^._id)
  ] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  },

  "producers": *[
    _type == "producer" &&
    published == true &&
    region._ref == ^._id
  ] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    municipality,
    oneLiner,
    oneLinerEn,
    logo,
    photo,
    heroImage
  },

  "vineyards": *[
    _type == "vineyard" &&
    published == true &&
    references(^._id)
  ] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    city,
    province,
    coverImage
  },

  "wines": *[
    _type == "wine" &&
    published == true &&
    region._ref == ^._id
  ] | order(vintage desc, name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    color,
    bottleImage,
    approxPrice,
    producer->{
      name,
      "slug": slug.current
    }
  }
}`;

export const appellationsQuery = `*[_type == "appellation"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  country->{name, "slug": slug.current},
  region->{name, "slug": slug.current},
  grapes[]->{name, "slug": slug.current},
  description,
  descriptionEn
}`;

export const appellationBySlugQuery = `*[_type == "appellation" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  descriptionEn,
  climate,
  climateEn,
  soilTypes,
  soilTypesEn,
  authorizedWineStyles,
  authorizedWineStylesEn,
  productionRules,
  productionRulesEn,
  foodPairingNotes,
  foodPairingNotesEn,
  seoTitle,
  seoTitleEn,
  seoDescription,
  seoDescriptionEn,
  country->{name, "slug": slug.current},
  region->{name, "slug": slug.current},
  grapes[]->{name, "slug": slug.current},
  "wines": *[_type == "wine" && published == true && references(^._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    color,
    bottleImage,
    producer->{name, "slug": slug.current}
  },
  "producers": *[_type == "producer" && published == true && references(^._id)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo
  }
}`;

export const grapesQuery = `*[_type == "grape" && slug.current != "assemblage-cepages-hybrides"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  color,
  heroImage,
  oneLiner,
  oneLinerEn,
  aromas,
  aromasEn,
  body,
  acidity,
  tannins
}`;

export const grapeBySlugQuery = `*[_type == "grape" && slug.current == $slug && slug.current != "assemblage-cepages-hybrides"][0] {
  _id,
  name,
  "slug": slug.current,
  color,
  heroImage,
  oneLiner,
  oneLinerEn,
  aromas,
  aromasEn,
  body,
  acidity,
  tannins,
  servingTemperature,
  simplePairings,
  simplePairingsEn,
  description,
  descriptionEn,
  history,
  historyEn,
  flavors,
  flavorsEn,
  agingPotential,
  agingPotentialEn,
  mainRegions[]->{
    _id,
    name,
    "slug": slug.current,
    heroImage,
    country->{name, "slug": slug.current}
  },
  tryNext[]{
    _key,
    reason,
    reasonEn,
    grape->{
      _id,
      name,
      "slug": slug.current,
      color,
      heroImage,
      oneLiner,
      oneLinerEn
    }
  },
  "wines": *[
    _type == "wine" &&
    published == true &&
    references(^._id)
  ] | order(vintage desc, name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    color,
    bottleImage,
    approxPrice,
    producer->{name, "slug": slug.current}
  },
  seoTitle,
  seoTitleEn,
  seoDescription,
  seoDescriptionEn,
  published
}`;

export const foodsQuery = `
  *[
    _type == "food" &&
    published == true &&
    !(_id in path("drafts.**"))
  ]
  | order(name asc) {
    _id,
    name,
    nameEn,
    "slug": slug.current,
    category,
    image,
    oneLiner,
    oneLinerEn,
    wineStyles,
    wineStylesEn,
    servingTip,
    servingTipEn
  }
`;
