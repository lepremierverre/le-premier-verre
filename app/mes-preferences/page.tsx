import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import PreferencesForm from "@/components/preferences/PreferencesForm";
import CaveNav from "@/components/cave/CaveNav";

export const dynamic = "force-dynamic";

export default async function MesPreferencesPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <section className="lpv-container py-12 md:py-20">
          <h1 className="lpv-display text-[clamp(3.6rem,8vw,7rem)] leading-[0.88] tracking-[-0.045em]">
            Mes préférences.
          </h1>

          <p className="mt-6 max-w-xl text-[0.95rem] leading-7 md:text-base">
            Quelques repères pour mieux comprendre ce que tu aimes.
          </p>

          <Link
            href="/connexion"
            className="mt-8 inline-flex border-b border-[var(--lpv-ink)] pb-1 text-[13px] font-medium"
          >
            Se connecter →
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container pt-10 md:pt-16">
        <h1 className="lpv-display text-[clamp(3.6rem,8vw,7rem)] leading-[0.88] tracking-[-0.045em]">
          Mes préférences.
        </h1>

        <p className="mt-6 max-w-xl text-[0.95rem] leading-7 md:text-base">
          Quelques repères pour mieux comprendre ce que tu aimes.
        </p>
      </section>

      <div className="mt-14 md:mt-20">
        <CaveNav />
      </div>

      <PreferencesForm locale="fr" />
    </main>
  );
}
