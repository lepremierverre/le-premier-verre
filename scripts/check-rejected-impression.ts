import { prisma } from "../lib/prisma";

async function main() {
  const clientEventId = "test-fake-impression-1791663892-5687";

  const row = await prisma.analyticsEvent.findUnique({
    where: { clientEventId },
  });

  console.log("Résultat DB :", row);

  if (row !== null) {
    throw new Error(
      "Une impression rejetée par l'API a malgré tout été enregistrée."
    );
  }

  console.log(
    "✅ SUCCÈS : aucune ligne DB n'existe pour l'impression frauduleuse rejetée."
  );
}

main()
  .catch((error) => {
    console.error("❌ TEST ÉCHOUÉ");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
