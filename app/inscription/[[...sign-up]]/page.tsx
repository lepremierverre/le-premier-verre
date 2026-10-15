import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignUp } from "@clerk/nextjs";

export default async function InscriptionPage() {
  const { userId } = await auth();

  if (userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <section className="lpv-container flex min-h-[calc(100vh-78px)] items-center py-16">
          <div className="w-full border-y border-[var(--lpv-line)] py-16 md:py-24">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Compte actif
            </p>

            <h1 className="lpv-display mt-7 max-w-5xl text-[clamp(4.5rem,9vw,9rem)] leading-[0.84]">
              Ton compte
              <br />
              existe déjà.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--lpv-muted)]">
              Tu peux maintenant retrouver ton carnet et continuer à construire
              ta bibliothèque personnelle.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/mon-carnet"
                className="lpv-button lpv-button-dark"
              >
                Ouvrir mon carnet
              </Link>

              <Link href="/vins" className="lpv-text-link">
                Découvrir les vins <span>→</span>
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
            Rejoindre Le Premier Verre
          </p>

          <h1 className="lpv-display mt-7 max-w-3xl text-[clamp(4.5rem,8vw,8.5rem)] leading-[0.84]">
            Garde une trace
            <br />
            de ce que tu bois.
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-[var(--lpv-muted)]">
            Crée ton carnet personnel, conserve tes favoris et retrouve les
            bouteilles qui valent la peine d’être rouvertes.
          </p>

          <div className="mt-10 border-t border-[var(--lpv-line)] pt-7">
            <p className="text-sm leading-7 text-[var(--lpv-muted)]">
              Tu as déjà un compte?
            </p>

            <Link href="/connexion" className="lpv-text-link mt-4">
              Se connecter <span>→</span>
            </Link>
          </div>
        </div>

        <div className="flex min-h-[620px] items-center border-y border-[var(--lpv-line)] py-12 lg:border-y-0 lg:border-l lg:pl-16 xl:pl-24">
          <SignUp
            fallbackRedirectUrl="/mon-carnet"
            signInFallbackRedirectUrl="/mon-carnet"
            
          />
        </div>
      </section>
    </main>
  );
}
