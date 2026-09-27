import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import PreferencesForm from "@/components/preferences/PreferencesForm";
import CaveNav from "@/components/cave/CaveNav";

export const dynamic = "force-dynamic";

export default async function PreferencesPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <section className="border-b border-[var(--lpv-line)]">
          <div className="lpv-container grid gap-7 py-10 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-24">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                My space
              </p>

              <h1 className="lpv-display mt-4 text-[clamp(3.7rem,14vw,4.7rem)] leading-[0.84] md:mt-7 md:text-[clamp(4.5rem,10vw,9rem)] md:leading-[0.82]">
                My preferences.
              </h1>
            </div>

            <div className="border-t border-[var(--lpv-line)] pt-4 md:border-t-0 md:pb-2 md:pt-6">
              <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
                A few simple clues about what you enjoy drinking.
              </p>

              <Link
                href="/en/sign-in"
                className="lpv-button lpv-button-dark mt-8"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      {/* MA CAVE */}
      <section>
        <div className="lpv-container grid gap-6 py-9 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-14">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              My cellar
            </p>

            <h1 className="lpv-display mt-4 text-[clamp(3.2rem,13vw,4.2rem)] leading-[0.86] md:mt-5 md:text-[clamp(4rem,7vw,6.5rem)] md:leading-[0.84]">
              My preferences.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-1">
            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              A few clues to better understand what you like.
              You can change them at any time.
            </p>
          </div>
        </div>
      </section>

      <CaveNav />

      <PreferencesForm locale="en" />
    </main>
  );
}
