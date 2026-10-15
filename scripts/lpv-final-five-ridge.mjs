import { createClient } from "@sanity/client";

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

const PRODUCER = "bb61af16-e4c6-42ad-968c-edd0752d054c";

const KEEP = new Set([
  "wine-domaine-du-ridge-le-batonnier",
  "wine-domaine-du-ridge-blanc-domaine-du-ridge",
  "wine-domaine-du-ridge-seyval-vidal",
  "wine-domaine-du-ridge-les-petites-cuvees-vidal-brut",
  "wine-domaine-du-ridge-le-litre-du-ridge-rose",
]);

const wines = await client.fetch(`
  *[_type == "wine" && producer._ref == $producer]{
    _id,
    name,
    published
  }
`, { producer: PRODUCER });

console.log("\n===== PLAN RIDGE =====");

for (const wine of wines) {
  console.log(
    KEEP.has(wine._id) ? "✓ GARDER  " : "○ MASQUER ",
    wine.name,
    `[${wine._id}]`
  );
}

const found = new Set(wines.map(w => w._id));

for (const id of KEEP) {
  if (!found.has(id)) {
    throw new Error(`Fiche à conserver introuvable : ${id}`);
  }
}

if (KEEP.size !== 5) {
  throw new Error("La liste KEEP doit contenir exactement 5 vins.");
}

/*
 * Compléter Le Litre du Ridge Rosé selon le nouveau format LPV.
 */
await client
  .patch("wine-domaine-du-ridge-le-litre-du-ridge-rose")
  .set({
    beverageType: "wine",

    oneLiner:
      "Un litre de rosé québécois sec, léger et généreux, rempli de fraise, de framboise et de fraîcheur.",

    oneLinerEn:
      "A dry, light and generous one-litre Québec rosé filled with strawberry, raspberry and freshness.",

    tastingKeywords: [
      "fraise",
      "framboise",
      "floral",
      "petits fruits rouges",
      "fraîcheur",
    ],

    tastingKeywordsEn: [
      "strawberry",
      "raspberry",
      "floral",
      "red berries",
      "fresh",
    ],

    perfectFor: [
      "Pique-nique",
      "Apéro",
      "Grande tablée",
    ],

    perfectForEn: [
      "Picnic",
      "Aperitif",
      "A large gathering",
    ],

    whyWeRecommend:
      "On le recommande parce que son format d’un litre et son profil léger en font une bouteille particulièrement conviviale. Sec, fruité et peu alcoolisé, c’est le genre de rosé qu’on ouvre sans cérémonie pour un pique-nique, un apéro ou une grande tablée.",

    whyWeRecommendEn:
      "We recommend it because its one-litre format and light profile make it particularly convivial. Dry, fruity and relatively low in alcohol, it is the kind of rosé made for an easy picnic, aperitif or large gathering.",

    tastingNotes:
      "La fraise et la framboise dominent, accompagnées de notes florales et de petits fruits rouges. La bouche reste légère, fraîche et généreuse.",

    tastingNotesEn:
      "Strawberry and raspberry lead the profile, joined by floral notes and red berries. The palate stays light, fresh and generous.",

    editorialNote:
      "Le format d’un litre donne immédiatement le ton : c’est un rosé pensé pour être partagé. Plus décontracté que démonstratif, il mise sur le fruit, la fraîcheur et une vraie facilité à table.",

    editorialNoteEn:
      "The one-litre format immediately sets the tone: this is a rosé made for sharing. More relaxed than showy, it is built around fruit, freshness and genuine ease at the table.",

    body: 2,
    sweetness: 1,
    roundness: 3,
    acidity: 4,
    tannins: 1,

    fruitIntensity: 4,
    minerality: 2,
    savory: 1,
    intensity: 3,
    complexity: 2,
    oakInfluence: 1,

    servingTemperature: "6–8 °C",
    decant: false,

    style: "Rosé sec, léger, fruité et généreux",

    aromas: [
      "Fraise",
      "Framboise",
      "Notes florales",
      "Petits fruits rouges",
    ],

    flavors: [
      "Fraise",
      "Framboise",
      "Petits fruits rouges",
    ],

    texture: "Légère, fraîche et généreuse.",
    finish: "Fraîche et fruitée.",

    alcohol: 10.3,
    sugar: "1,2 g/L",
    bottleSize: "1 L",

    experienceLevel: "beginner",

    seoTitle:
      "Le Litre du Ridge Rosé | Domaine du Ridge | Le Premier Verre",

    seoTitleEn:
      "Le Litre du Ridge Rosé | Domaine du Ridge | Le Premier Verre",

    seoDescription:
      "Découvrez Le Litre du Ridge Rosé, un rosé québécois sec, léger et fruité en format 1 litre, aux notes de fraise et de framboise.",

    seoDescriptionEn:
      "Discover Le Litre du Ridge Rosé, a dry, light and fruity Québec rosé in a one-litre bottle, with strawberry and raspberry notes.",
  })
  .commit();

/*
 * Visibilité :
 * exactement 5 vins Ridge publiés.
 */
for (const wine of wines) {
  await client
    .patch(wine._id)
    .set({ published: KEEP.has(wine._id) })
    .commit();
}

/*
 * Vérification finale.
 */
const final = await client.fetch(`
  *[_type == "wine" && producer._ref == $producer] | order(name asc) {
    _id,
    name,
    published,
    beverageType,
    "bottleImage": bottleImage.asset._ref,
    oneLiner,
    oneLinerEn,
    tastingNotes,
    tastingNotesEn,
    editorialNote,
    editorialNoteEn
  }
`, { producer: PRODUCER });

const visible = final.filter(w => w.published === true);
const hidden = final.filter(w => w.published !== true);

console.log("\n════════ RIDGE FINAL ════════");
console.log(`TOTAL    : ${final.length}`);
console.log(`VISIBLES : ${visible.length}`);
console.log(`MASQUÉS  : ${hidden.length}`);

console.log("\n===== VISIBLES =====");
for (const w of visible) {
  console.log(
    "✓",
    w.name,
    "| type:", w.beverageType || "ABSENT",
    "| photo:", w.bottleImage ? "✓" : "—",
    "| nouveau format:",
    w.oneLiner && w.oneLinerEn &&
    w.tastingNotes && w.tastingNotesEn &&
    w.editorialNote && w.editorialNoteEn
      ? "✓"
      : "INCOMPLET"
  );
}

console.log("\n===== MASQUÉS =====");
for (const w of hidden) {
  console.log("○", w.name);
}

if (visible.length !== 5) {
  throw new Error(`ERREUR : ${visible.length} vins visibles au lieu de 5.`);
}

for (const id of KEEP) {
  const wine = visible.find(w => w._id === id);
  if (!wine) {
    throw new Error(`Vin conservé absent : ${id}`);
  }
}

console.log("\n✓ EXACTEMENT 5 VINS RIDGE VISIBLES");
console.log("✓ LES 9 AUTRES SONT CONSERVÉS MAIS MASQUÉS");
console.log("✓ LE LITRE ROSÉ EST AU NOUVEAU FORMAT FR + EN");
