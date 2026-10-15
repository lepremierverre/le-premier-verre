import Link from "next/link";

export const metadata = {
  title: "Pairings | Le Premier Verre",
  description: "Pairings are coming soon to Le Premier Verre.",
};

export default function PairingsPage() {
  return (
    <main className="bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container">
        <div className="flex min-h-[72vh] items-center justify-center py-20">
          <div className="w-full max-w-[720px] text-center">
            <h1 className="lpv-display mx-auto text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.025em]">
              Pairings are coming soon.
            </h1>

            <p className="mt-7 text-[0.95rem] font-normal text-[var(--lpv-ink)]">
              We’re working on it.
            </p>

            <Link
              href="/en/wines"
              className="mt-10 inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span>View wines</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
