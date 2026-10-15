import fs from "node:fs";
import { normalizeBottleImage } from "./lib/normalize-bottle-image.mjs";

const candidates = [
  "public/images/lpv/photos bouteilles/janedoeSAQ.png",
  "public/images/lpv/photos bouteilles/janedoe-saq.png",
];

const source = candidates.find(fs.existsSync);

if (!source) {
  throw new Error(
    "janedoeSAQ.png introuvable dans public/images/lpv/photos bouteilles/"
  );
}

const output =
  "public/images/lpv/photos bouteilles/pinard-final/jane-doe-2024.png";

const input = fs.readFileSync(source);
const result = await normalizeBottleImage(input);

fs.writeFileSync(output, result.buffer);

console.log("\n✓ Jane Doe traitée avec le moteur LPV existant");
console.log(`Source   : ${source}`);
console.log(`Sortie   : ${output}`);
console.log(`Canevas  : ${result.width} × ${result.height}`);
console.log(`Produit  : ${result.productWidth} × ${result.productHeight}`);
console.log("\n✓ Aucune autre image modifiée");
