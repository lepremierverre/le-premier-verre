import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    return (
      <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
        <section className="lpv-container flex min-h-[calc(100vh-78px)] items-center py-16">
          <div className="w-full border-y border-[var(--lpv-line)] py-16 md:py-24">
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Personal space
            </p>

            <h1 className="lpv-display mt-7 max-w-5xl text-[clamp(4.5rem,9vw,9rem)] leading-[0.84]">
              You&apos;re already
              <br />
              signed in.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--lpv-muted)]">
              Your notebook, favourites and bottles are ready when you are.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/en/notebook"
                className="lpv-button lpv-button-dark"
              >
                Open my notebook
              </Link>

              <Link href="/en/wines" className="lpv-text-link">
                Explore wines <span>→</span>
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
            <Link href="/en" className="lpv-text-link">
              <span>←</span> Back to home
            </Link>

            <p className="lpv-kicker mt-16 text-[var(--lpv-cocoa)]">
              Personal space
            </p>

            <h1 className="lpv-display mt-7 max-w-3xl text-[clamp(4.5rem,8vw,8.5rem)] leading-[0.84]">
              Welcome back.
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-[var(--lpv-muted)]">
              Find your notebook, favourites and the bottles you&apos;ve kept
              close at hand.
            </p>

            <div className="mt-10 border-t border-[var(--lpv-line)] pt-7">
              <p className="text-sm leading-7 text-[var(--lpv-muted)]">
                Don&apos;t have an account yet?
              </p>

              <Link href="/en/sign-up" className="lpv-text-link mt-4">
                Create an account <span>→</span>
              </Link>
            </div>
          </div>

          <div className="flex min-h-[620px] items-center border-y border-[var(--lpv-line)] py-12 lg:border-y-0 lg:border-l lg:pl-16 xl:pl-24">
            <SignIn
              path="/en/sign-in"
              signUpUrl="/en/sign-up"
              fallbackRedirectUrl="/apres-connexion"
              signUpFallbackRedirectUrl="/apres-connexion"
            />
          </div>
        </section>
    </main>
  );
}
