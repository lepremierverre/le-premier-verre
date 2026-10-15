import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const producer = "bb61af16-e4c6-42ad-968c-edd0752d054c";

const wines = await client.fetch(`
  *[_type == "wine" && producer._ref == $producer] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    published,
    beverageType,
    approxPrice,
    bottleSize,
    "bottleImage": bottleImage.asset._ref,
    "editorialImage": editorialImage.asset._ref,
    "labelImage": labelImage.asset._ref,
    oneLiner,
    oneLinerEn,
    tastingNotes,
    tastingNotesEn,
    editorialNote,
    editorialNoteEn
  }
`, { producer });

console.log("\n════════ DOMAINE DU RIDGE — SANITY ACTUEL ════════\n");

for (const w of wines) {
  console.log("--------------------------------------------------");
  console.log("NOM       :", w.name);
  console.log("ID        :", w._id);
  console.log("SLUG      :", w.slug);
  console.log("PUBLIÉ    :", w.published);
  console.log("TYPE      :", w.beverageType);
  console.log("PRIX      :", w.approxPrice);
  console.log("FORMAT    :", w.bottleSize);
  console.log("BOUTEILLE :", w.bottleImage || "ABSENTE");
  console.log("EDITORIAL :", w.editorialImage || "ABSENTE");
  console.log("LABEL     :", w.labelImage || "ABSENTE");
  console.log("ONE FR    :", w.oneLiner ? "✓" : "—");
  console.log("ONE EN    :", w.oneLinerEn ? "✓" : "—");
  console.log("NOTE FR   :", w.tastingNotes ? "✓" : "—");
  console.log("NOTE EN   :", w.tastingNotesEn ? "✓" : "—");
  console.log("EDIT FR   :", w.editorialNote ? "✓" : "—");
  console.log("EDIT EN   :", w.editorialNoteEn ? "✓" : "—");
}

console.log("\nTOTAL :", wines.length);
