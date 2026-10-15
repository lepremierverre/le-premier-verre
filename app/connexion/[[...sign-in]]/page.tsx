import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export default async function ConnexionPage() {
  const { userId } = await auth();

  if (userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <section className="lpv-container flex min-h-[calc(100vh-78px)] items-center py-16">
          <div className="w-full border-y border-[var(--lpv-line)] py-16 md:py-24">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Espace personnel
            </p>

            <h1 className="lpv-display mt-7 max-w-5xl text-[clamp(4.5rem,9vw,9rem)] leading-[0.84]">
              Tu es déjà
              <br />
              connectée.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--lpv-muted)]">
              Ton carnet, tes favoris et tes bouteilles sont prêts à être
              retrouvés.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/mon-carnet"
                className="lpv-button lpv-button-dark"
              >
                Ouvrir mon carnet
              </Link>

              <Link href="/vins" className="lpv-text-link">
                Explorer les vins <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container grid min-h-[calc(100vh-78px)] gap-12 py-12 lg:grid-cols-[0.48fr_0.52fr] lg:items-center lg:py-20">
        <div>
          <Link href="/" className="lpv-text-link">
            <span>←</span> Retour à l’accueil
          </Link>

          <p className="lpv-kicker mt-16 text-[var(--lpv-cocoa)]">
            Espace personnel
          </p>

          <h1 className="lpv-display mt-7 max-w-3xl text-[clamp(4.5rem,8vw,8.5rem)] leading-[0.84]">
            Bon retour.
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-[var(--lpv-muted)]">
            Retrouve ton carnet, tes favoris et les bouteilles gardées sous la
            main.
          </p>

          <div className="mt-10 border-t border-[var(--lpv-line)] pt-7">
            <p className="text-sm leading-7 text-[var(--lpv-muted)]">
              Pas encore de compte?
            </p>

            <Link href="/inscription" className="lpv-text-link mt-4">
              Créer un compte <span>→</span>
            </Link>
          </div>
        </div>

        <div className="flex min-h-[620px] items-center border-y border-[var(--lpv-line)] py-12 lg:border-y-0 lg:border-l lg:pl-16 xl:pl-24">
          <SignIn
            fallbackRedirectUrl="/mon-carnet"
            signUpFallbackRedirectUrl="/mon-carnet"
            
          />
        </div>
      </section>
    </main>
  );
}
