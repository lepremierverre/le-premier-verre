import { createClient } from "@sanity/client";
import { WINE_DNA_DIMENSIONS } from "../lib/wine-dna";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

async function main() {
  const wines = await client.fetch<any[]>(`*[
    _type == "wine" &&
    !(_id in path("drafts.**"))
  ]{
    _id,
    name,
    color,
    dnaMetadata,
    ${WINE_DNA_DIMENSIONS.join(",\n    ")}
  }`);

  const rows = WINE_DNA_DIMENSIONS.map((dimension) => {
    const valid = wines.filter((wine) => {
      const value = wine[dimension];
      return typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 1 && value <= 5;
    });

    const explicit = valid.filter((wine) => {
      const confidence = wine.dnaMetadata?.[dimension]?.confidence;
      return typeof confidence === "number" &&
        Number.isFinite(confidence);
    });

    const absent = valid.filter((wine) => {
      const confidence = wine.dnaMetadata?.[dimension]?.confidence;
      return typeof confidence !== "number" ||
        !Number.isFinite(confidence);
    });

    return {
      dimension,
      validValues: valid.length,
      explicitConfidence: explicit.length,
      defaultConfidence: absent.length,
      explicitBelowOne: explicit.filter(
        (wine) => wine.dnaMetadata[dimension].confidence < 1
      ).length,
    };
  });

  console.log("\nWINE DNA CONFIDENCE AUDIT");
  console.log("Wines:", wines.length);
  console.table(rows);

  const validTotal = rows.reduce(
    (sum, row) => sum + row.validValues, 0
  );
  const explicitTotal = rows.reduce(
    (sum, row) => sum + row.explicitConfidence, 0
  );
  const defaultTotal = rows.reduce(
    (sum, row) => sum + row.defaultConfidence, 0
  );

  console.log("\nSUMMARY", {
    wines: wines.length,
    dimensions: WINE_DNA_DIMENSIONS.length,
    validValues: validTotal,
    explicitConfidence: explicitTotal,
    defaultConfidence: defaultTotal,
    explicitCoverage: validTotal
      ? Number((explicitTotal / validTotal).toFixed(4))
      : null,
  });

  console.log("\nWINES WITH MOST MISSING CONFIDENCE METADATA");
  console.table(
    wines.map((wine) => {
      const validDimensions = WINE_DNA_DIMENSIONS.filter((dimension) => {
        const value = wine[dimension];
        return typeof value === "number" &&
          Number.isFinite(value) &&
          value >= 1 && value <= 5;
      });

      const missing = validDimensions.filter((dimension) => {
        const confidence = wine.dnaMetadata?.[dimension]?.confidence;
        return typeof confidence !== "number" ||
          !Number.isFinite(confidence);
      });

      return {
        wine: wine.name ?? wine._id,
        color: wine.color ?? "unknown",
        validDimensions: validDimensions.length,
        missingConfidence: missing.length,
        dimensions: missing.join(", "),
      };
    })
    .sort((a, b) => b.missingConfidence - a.missingConfidence)
    .slice(0, 20)
  );
}

main().catch((error) => {
  console.error("WINE DNA CONFIDENCE AUDIT FAILED", error);
  process.exit(1);
});
