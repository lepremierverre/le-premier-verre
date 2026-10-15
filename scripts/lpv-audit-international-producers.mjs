import { createClient } from "@sanity/client";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const quebecSlugs = [
  "cidrerie-michel-jodoin",
  "cidrerie-milton",
  "cidrerie-du-minot",
  "domaine-lafrance",
  "domaine-saint-basile",
  "domaine-des-cotes-d-ardoise",
  "domaine-du-nival",
  "val-caudalies",
  "vignoble-de-l-orpailleur",
];

const producers = await client.fetch(
  `*[
    _type == "producer" &&
    lpvPartner != true &&
    !(slug.current in $quebecSlugs)
  ] | order(country->name asc, region->name asc, name asc) {
    name,
    "slug": slug.current,
    municipality,
    "country": country->name,
    "region": region->name,
    "appellation": appellation->name,

    oneLiner,
    oneLinerEn,
    shortBio,
    shortBioEn,
    "hasBioFr": defined(bio) && count(bio) > 0,
    "hasBioEn": defined(bioEn) && count(bioEn) > 0,

    "grapes": signatureGrapes[]->name,

    website,
    instagram,

    "wineCount": count(wines[]),
    openToVisitors,
    address,
    visitDetails,
    visitDetailsEn
  }`,
  { quebecSlugs }
);

console.log(`\n===== PRODUCTEURS D'AILLEURS NON PARTENAIRES : ${producers.length} =====\n`);

for (const p of producers) {
  console.log("--------------------------------------------------");
  console.log("NOM :", p.name);
  console.log("SLUG :", p.slug);
  console.log("PAYS :", p.country || "ABSENT");
  console.log("RÉGION :", p.region || "ABSENTE");
  console.log("APPELLATION :", p.appellation || "ABSENTE");
  console.log("MUNICIPALITÉ :", p.municipality || "ABSENTE");
  console.log("ONE LINER FR :", p.oneLiner ? "OUI" : "NON");
  console.log("ONE LINER EN :", p.oneLinerEn ? "OUI" : "NON");
  console.log("BIO FR :", p.hasBioFr ? "OUI" : "NON");
  console.log("BIO EN :", p.hasBioEn ? "OUI" : "NON");
  console.log("CÉPAGES :", p.grapes?.join(" · ") || "AUCUN");
  console.log("VINS :", p.wineCount ?? 0);
  console.log("SITE :", p.website || "ABSENT");
  console.log("INSTAGRAM :", p.instagram || "ABSENT");
  console.log(
    "INFOS VISITE :",
    p.openToVisitors !== null ||
    p.address ||
    p.visitDetails ||
    p.visitDetailsEn
      ? "OUI"
      : "NON"
  );
}

console.log("\n===== FIN =====");
