import { prisma } from "../lib/prisma";

async function main() {
  const clientEventId = "test-impression-1791663782-13910";

  const row = await prisma.analyticsEvent.findUnique({
    where: { clientEventId },
  });

  console.log("\n===== RECOMMENDATION IMPRESSION EN DB =====");
  console.dir(row, { depth: null });

  if (!row) {
    throw new Error("Événement introuvable en DB.");
  }

  console.log("\n===== CONTRÔLES =====");
  console.log("eventName :", row.eventName);
  console.log("contentId :", row.contentId);
  console.log("contentType :", row.contentType);
  console.log("producerId :", row.producerId);
  console.log("price :", row.price);
  console.log("priceBand :", row.priceBand);
  console.log("sourceType :", row.sourceType);
  console.log("sourceId :", row.sourceId);
  console.log("sourceSlug :", row.sourceSlug);
  console.log("recommendationId :", row.recommendationId);
  console.log("recommendationReason :", row.recommendationReason);
  console.log("destinationType :", row.destinationType);
  console.log("destinationId :", row.destinationId);
  console.log("destinationUrl :", row.destinationUrl);
  console.log("metadata :", row.metadata);
  console.log("isReportable :", row.isReportable);
  console.log("qualityReason :", row.qualityReason);
}

main()
  .catch((error) => {
    console.error("\n❌ LECTURE ÉCHOUÉE");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
