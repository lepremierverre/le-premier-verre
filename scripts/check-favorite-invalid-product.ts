import { prisma } from "../lib/prisma";

async function main() {
  const clientEventId = "lpv-favorite-invalid-product-20261010-01";

  const count = await prisma.analyticsEvent.count({
    where: { clientEventId },
  });

  console.log("Nombre d'événements enregistrés :", count);

  if (count !== 0) {
    throw new Error("ÉCHEC : l'événement invalide a été enregistré.");
  }

  console.log("✅ Aucun événement invalide enregistré.");
}

main()
  .catch((error) => {
    console.error("❌ TEST ÉCHOUÉ", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
