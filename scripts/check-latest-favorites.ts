import { prisma } from "../lib/prisma";

async function main() {
  const events = await prisma.analyticsEvent.findMany({
    where: { eventName: "favorite_added" },
    orderBy: { receivedAt: "desc" },
    take: 10,
    select: {
      id: true,
      receivedAt: true,
      sessionId: true,
      pagePath: true,
      contentId: true,
      contentType: true,
      price: true,
      priceBand: true,
      isReportable: true,
      qualityReason: true,
    },
  });

  console.log("\n===== DERNIERS ÉVÉNEMENTS FAVORIS =====");
  console.dir(events, { depth: null });

  if (events.length === 0) {
    console.log("Aucun événement favorite_added trouvé.");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
