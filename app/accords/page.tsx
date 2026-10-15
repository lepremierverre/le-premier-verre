import Link from "next/link";

export const metadata = {
  title: "Accords | Le Premier Verre",
  description: "Les accords arrivent bientôt sur Le Premier Verre.",
};

export default function AccordsPage() {
  return (
    <main className="bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container">
        <div className="flex min-h-[72vh] items-center justify-center py-20">
          <div className="w-full max-w-[720px] text-center">
            <h1 className="lpv-display mx-auto text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.025em]">
              Les accords arrivent bientôt.
            </h1>

            <p className="mt-7 text-[0.95rem] font-normal text-[var(--lpv-ink)]">
              On y travaille.
            </p>

            <Link
              href="/vins"
              className="mt-10 inline-flex items-center gap-3 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span>Voir les vins</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
