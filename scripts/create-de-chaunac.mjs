import { createClient } from "@sanity/client";
import crypto from "node:crypto";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

if (!client.config().token) {
  throw new Error("Token Sanity absent.");
}

const sourceForHash = {
  name: "De Chaunac",
  oneLiner:
    "Un cépage hybride rouge de climat froid, généralement souple et fruité, marqué par les petits fruits noirs et rouges et une acidité fraîche.",
  aromas: ["Cerise noire", "Mûre", "Prune", "Framboise", "Épices"],
  simplePairings: [
    "Charcuteries",
    "Porc rôti",
    "Burger",
    "Fromages à pâte ferme",
  ],
};

const translationSourceHash = crypto
  .createHash("sha256")
  .update(JSON.stringify(sourceForHash))
  .digest("hex");

const doc = {
  _id: "grape-de-chaunac",
  _type: "grape",

  name: "De Chaunac",
  slug: {
    _type: "slug",
    current: "de-chaunac",
  },

  color: "red",

  oneLiner:
    "Un cépage hybride rouge de climat froid, généralement souple et fruité, marqué par les petits fruits noirs et rouges et une acidité fraîche.",

  oneLinerEn:
    "A cold-climate red hybrid grape, generally supple and fruit-forward, with dark and red berry notes and fresh acidity.",

  aromas: [
    "Cerise noire",
    "Mûre",
    "Prune",
    "Framboise",
    "Épices",
  ],

  aromasEn: [
    "Black cherry",
    "Blackberry",
    "Plum",
    "Raspberry",
    "Spices",
  ],

  body: 3,
  acidity: 4,
  tannins: 3,

  servingTemperature: "14–16 °C",

  simplePairings: [
    "Charcuteries",
    "Porc rôti",
    "Burger",
    "Fromages à pâte ferme",
  ],

  simplePairingsEn: [
    "Charcuterie",
    "Roast pork",
    "Burgers",
    "Firm cheeses",
  ],

  mainRegions: [
    {
      _key: "region-quebec",
      _type: "reference",
      _ref: "region-quebec",
    },
    {
      _key: "region-cantons-est",
      _type: "reference",
      _ref: "55a9fe9a-b3fe-41d6-8145-6adca1a818a8",
    },
    {
      _key: "region-monteregie",
      _type: "reference",
      _ref: "region-monteregie",
    },
  ],

  tryNext: [
    {
      _key: "dechaunac-marechal",
      _type: "grapeSuggestion",
      grape: {
        _type: "reference",
        _ref: "grape-marechal-foch",
      },
      reason:
        "Pour poursuivre avec un autre rouge hybride de climat froid, fruité et polyvalent.",
      reasonEn:
        "For another versatile, fruit-driven red hybrid suited to cold climates.",
    },
    {
      _key: "dechaunac-frontenac",
      _type: "grapeSuggestion",
      grape: {
        _type: "reference",
        _ref: "grape-frontenac-noir",
      },
      reason:
        "Pour découvrir un rouge nordique généralement plus intense et porté par une acidité vive.",
      reasonEn:
        "To discover a northern red that is generally more intense and driven by lively acidity.",
    },
    {
      _key: "dechaunac-sabrevois",
      _type: "grapeSuggestion",
      grape: {
        _type: "reference",
        _ref: "grape-sabrevois",
      },
      reason:
        "Pour rester dans les hybrides rouges québécois avec davantage de structure et de fruits noirs.",
      reasonEn:
        "To stay with Québec red hybrids while moving toward more structure and dark fruit.",
    },
  ],

  seoTitle:
    "De Chaunac : profil, arômes et accords | Le Premier Verre",

  seoTitleEn:
    "De Chaunac: profile, aromas and pairings | Le Premier Verre",

  seoDescription:
    "Découvre le De Chaunac, cépage hybride rouge adapté aux climats froids, au profil fruité, frais et souple.",

  seoDescriptionEn:
    "Discover De Chaunac, a cold-climate red hybrid grape with a fresh, supple and fruit-driven profile.",

  translationSourceHash,
  published: true,
};

await client.createOrReplace(doc);

const saved = await client.fetch(
  `*[_id == "grape-de-chaunac"][0]{
    _id,
    name,
    "slug": slug.current,
    published,
    color,
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
    "regions": mainRegions[]->name,
    "tryNext": tryNext[]{ "grape": grape->name, reason, reasonEn }
  }`
);

console.log(JSON.stringify(saved, null, 2));

const problems = [];

if (!saved) problems.push("document absent");
if (!saved?.published) problems.push("non publié");
if (!saved?.oneLinerEn) problems.push("oneLinerEn absent");
if (saved?.aromas?.length < 3) problems.push("aromas incomplets");
if (saved?.aromasEn?.length < 3) problems.push("aromasEn incomplets");
if (saved?.simplePairings?.length !== 4) problems.push("simplePairings != 4");
if (saved?.simplePairingsEn?.length !== 4) problems.push("simplePairingsEn != 4");
if (saved?.regions?.length < 1) problems.push("régions absentes");
if (saved?.tryNext?.length < 2) problems.push("tryNext incomplet");
if (saved?.tryNext?.some(x => !x.grape)) problems.push("référence tryNext cassée");

if (problems.length) {
  console.error("\n❌ QA De Chaunac :", problems.join(" · "));
  process.exit(1);
}

console.log("\n✓ De Chaunac créé");
console.log("✓ FR + EN");
console.log("✓ références résolues");
console.log("✓ publié");
console.log("✓ QA réussie");
