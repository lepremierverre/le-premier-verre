import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ProfileActions from "@/components/profile/ProfileActions";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MonProfilPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/connexion");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/connexion");
  }

  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    "—";

  const firstName = user.firstName || "—";
  const lastName = user.lastName || "—";

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-7 py-10 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-20">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Mon compte
            </p>

            <h1 className="lpv-display mt-5 max-w-5xl text-[clamp(3.6rem,14vw,5rem)] leading-[0.84] md:mt-7 md:text-[clamp(4.8rem,9vw,8.5rem)] md:leading-[0.82]">
              Informations
              <br />
              personnelles.
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-6 md:border-t-0 md:pb-2">
            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
              Les informations liées à ton compte Le Premier Verre et les
              réglages qui permettent de le sécuriser.
            </p>

            <Link href="/ma-cave" className="lpv-text-link mt-7">
              Retour à Ma cave <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container py-10 md:py-16">
          <div className="grid gap-8 md:grid-cols-[0.42fr_1fr] md:gap-16">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                Identité
              </p>

              <h2 className="lpv-display mt-4 text-[2.8rem] leading-[0.92] md:mt-5 md:text-6xl">
                Tes informations.
              </h2>
            </div>

            <ProfileActions locale="fr" />
        </div>
      </div>
    </section>
    </main>
  );
}
