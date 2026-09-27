import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import WineListsClient from "@/components/lists/WineListsClient";

export default async function MesListesPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 md:px-12 lg:px-16">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Mon espace
          </p>

          <h1 className="lpv-display mt-5 max-w-5xl text-[clamp(4.5rem,10vw,10rem)] leading-[0.78] tracking-[-0.075em]">
            Mes listes.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--lpv-muted)]">
            Connecte-toi pour créer et retrouver tes listes de vins.
          </p>

          <Link
            href="/connexion"
            className="mt-10 inline-flex border-b border-[var(--lpv-ink)] pb-1 text-xs uppercase tracking-[0.22em]"
          >
            Se connecter →
          </Link>
        </div>
      </main>
    );
  }


  return <WineListsClient locale="fr" />;
}
