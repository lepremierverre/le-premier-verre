import { prisma } from "../lib/prisma";

async function main() {
  const clientEventId = "test-favorite-1791664656-44425";

  const row = await prisma.analyticsEvent.findUnique({
    where: { clientEventId },
  });

  console.log("\n===== ÉVÉNEMENT FAVORITE_ADDED =====");
  console.dir(row, { depth: null });

  if (!row) {
    throw new Error("Aucune ligne trouvée en base.");
  }

  const checks = {
    eventName: row.eventName === "favorite_added",
    contentType: row.contentType === "product",
    province: row.province === null,
    priceIsCanonical: row.price !== 99999,
    priceBandIsCanonical: row.priceBand !== "FAUX-PRICE-BAND",
  };

  console.log("\n===== CONTRÔLES =====");
  console.table(checks);

  if (Object.values(checks).some((passed) => !passed)) {
    throw new Error("Un ou plusieurs contrôles ont échoué.");
  }

  console.log("\n✅ Canonicalisation favorite_added validée.");
}

main()
  .catch((error) => {
    console.error("\n❌ VÉRIFICATION ÉCHOUÉE");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
