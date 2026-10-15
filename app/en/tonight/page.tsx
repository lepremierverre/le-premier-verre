import Link from "next/link";

const choices = [
  {
    title: "I’m hosting.",
    text: "A bottle to put on the table.",
    href: "/en/guides",
  },
  {
    title: "I’m bringing a bottle.",
    text: "Something that works without overthinking it.",
    href: "/en/wines",
  },
  {
    title: "Surprise me.",
    text: "Try something outside your usual choices.",
    href: "/en/wines",
  },
  {
    title: "I’m going out.",
    text: "A bar, a table or somewhere worth trying.",
    href: "/en/places",
  },
  {
    title: "I don’t know.",
    text: "Just start with the bottles.",
    href: "/en/wines",
  },
];

export default function TonightPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container">
        <div className="mx-auto max-w-[920px] pb-16 pt-20 text-center md:pb-24 md:pt-28">
          <h1 className="lpv-display text-[clamp(3.4rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.035em]">
            What are we drinking tonight?
          </h1>

          <p className="mx-auto mt-7 max-w-md text-base leading-7">
            Just tell us what’s happening.
          </p>
        </div>

        <div className="mx-auto max-w-[1100px] border-t border-[var(--lpv-line)]">
          {choices.map((choice) => (
            <Link
              key={choice.title}
              href={choice.href}
              className="group grid gap-3 border-b border-[var(--lpv-line)] py-7 md:grid-cols-[1fr_0.8fr_auto] md:items-center md:gap-10 md:py-9"
            >
              <h2 className="lpv-display text-[clamp(2rem,4vw,3.6rem)] leading-[0.95]">
                {choice.title}
              </h2>

              <p className="max-w-sm text-sm leading-6 text-[var(--lpv-muted)]">
                {choice.text}
              </p>

              <span
                aria-hidden="true"
                className="text-base transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="mx-auto grid max-w-[1100px] gap-6 py-14 md:grid-cols-2 md:py-20">
          <div className="border border-[var(--lpv-line)] p-7 md:p-9">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em]">
              At the table
            </p>

            <h2 className="lpv-display mt-5 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]">
              I’m cooking.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--lpv-muted)]">
              Pairings are coming soon.
            </p>

            <Link
              href="/en/pairings"
              className="mt-7 inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span>See pairings</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="border border-[var(--lpv-line)] p-7 md:p-9">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em]">
              Alcohol-free
            </p>

            <h2 className="lpv-display mt-5 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]">
              Not tonight.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--lpv-muted)]">
              Something good in the glass, without alcohol.
            </p>

            <Link
              href="/en/alcohol-free"
              className="mt-7 inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span>See alcohol-free</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
