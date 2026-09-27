import Link from "next/link";

const moments = [
  {
    number: "01",
    eyebrow: "At the table",
    title: "I'm cooking.",
    description:
      "Find a bouteille selon le plat, la sauce, la saison ou simplement ce qu’il reste dans le frigo.",
    href: "/en/pairings",
  },
  {
    number: "02",
    eyebrow: "Hosting",
    title: "I'm having people over.",
    description:
      "A crowd-pleasing bottle that works with the table without taking over.",
    href: "/en/guides",
  },
  {
    number: "03",
    eyebrow: "Bringing",
    title: "I'm bringing a bottle.",
    description:
      "Find a reliable choice based on the budget, the occasion and the people around the table.",
    href: "/en/wines",
  },
  {
    number: "04",
    eyebrow: "Discovering",
    title: "I want to be surprised.",
    description:
      "Step outside your usual choices with a less obvious bottle and something worth talking about.",
    href: "/en/wines",
  },
  {
    number: "05",
    eyebrow: "Going out",
    title: "I want to go somewhere.",
    description:
      "A wine bar, restaurant, wine shop or a place worth saving for later.",
    href: "/en/places",
  },
  {
    number: "06",
    eyebrow: "Instinct",
    title: "I don't know.",
    description:
      "A few simple questions to find the bottle that fits the moment.",
    href: "/en/wines",
  },
];

export default function TonightPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-8 py-12 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-12 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Tonight
            </p>

            <h1 className="lpv-display mt-5 max-w-6xl text-[clamp(4rem,17vw,5.2rem)] leading-[0.84] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)] md:leading-[0.82]">
              What are
              <br />
              we opening?
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-base leading-7 text-[var(--lpv-muted)] md:leading-8">
              Start with the moment. The meal, the people, the mood or the budget
              come next.
            </p>

            <Link
              href="/en/pairings"
              className="lpv-text-link mt-6 md:mt-8"
            >
              Start with what we&apos;re eating <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="lpv-container py-12 md:py-24">
        <div className="border-b border-[var(--lpv-line)] pb-5 md:pb-6">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Choose the moment
          </p>

          <h2 className="lpv-display mt-4 text-[2.75rem] leading-none md:mt-5 md:text-7xl">
            Where to start.
          </h2>
        </div>

        <div>
          {moments.map((moment) => (
            <Link
              key={moment.number}
              href={moment.href}
              className="group grid gap-2 border-b border-[var(--lpv-line)] py-5 transition-opacity hover:opacity-60 md:grid-cols-[70px_0.9fr_1.1fr_30px] md:items-center md:gap-5 md:py-10"
            >
              <span className="text-[0.62rem] tracking-[0.18em] text-[var(--lpv-muted)]">
                {moment.number}
              </span>

              <div>
                <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                  {moment.eyebrow}
                </p>

                <h3 className="lpv-display mt-2 text-[clamp(2.2rem,9vw,2.7rem)] leading-[0.92] md:mt-4 md:text-[clamp(3rem,5vw,5.5rem)] md:leading-[0.88]">
                  {moment.title}
                </h3>
              </div>

              <p className="max-w-xl text-sm leading-[1.45rem] text-[var(--lpv-muted)] md:leading-7">
                {moment.description}
              </p>

              <span className="mt-1 text-lg transition-transform duration-500 group-hover:translate-x-2 md:mt-0 md:text-xl">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--lpv-line)] bg-[var(--lpv-paper-light)]">
        <div className="lpv-container grid gap-7 py-12 md:grid-cols-[0.38fr_0.62fr] md:items-end md:gap-12 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Alcohol-free
            </p>

            <h2 className="lpv-display mt-4 text-[2.75rem] leading-[0.92] md:mt-6 md:text-7xl md:leading-[0.9]">
              I’m not drinking
              <br />
              tonight.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-base leading-7 text-[var(--lpv-muted)] md:text-lg md:leading-8">
              You don’t need alcohol to have something good in your glass.
              Discover bottles chosen for what they have to offer,
              simply because they’re worth drinking.
            </p>

            <Link
              href="/en/alcohol-free"
              className="lpv-button lpv-button-dark mt-7 md:mt-9"
            >
              Explore alcohol-free
            </Link>
          </div>
        </div>
      </section>

      <section className="lpv-container py-12 md:py-24">
        <div className="grid gap-0 md:grid-cols-3 md:gap-10">
          <Link
            href="/en/wines"
            className="group border-t border-[var(--lpv-line)] py-7 md:py-0 md:pt-6"
          >
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Directory
            </p>

            <h2 className="lpv-display mt-4 text-[2.15rem] leading-[0.94] md:mt-6 md:text-5xl md:leading-[0.92]">
              See all
              <br />
              the bottles.
            </h2>

            <span className="lpv-text-link mt-6 md:mt-8">
              Explore <span>→</span>
            </span>
          </Link>

          <Link
            href="/en/guides"
            className="group border-t border-[var(--lpv-line)] py-7 md:py-0 md:pt-6"
          >
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Understand
            </p>

            <h2 className="lpv-display mt-4 text-[2.15rem] leading-[0.94] md:mt-6 md:text-5xl md:leading-[0.92]">
              Read without
              <br />
              overcomplicating it.
            </h2>

            <span className="lpv-text-link mt-6 md:mt-8">
              See the guides <span>→</span>
            </span>
          </Link>

          <Link
            href="/en/places"
            className="group border-t border-[var(--lpv-line)] py-7 md:py-0 md:pt-6"
          >
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Going out
            </p>

            <h2 className="lpv-display mt-4 text-[2.15rem] leading-[0.94] md:mt-6 md:text-5xl md:leading-[0.92]">
              Find a
              <br />
              good place.
            </h2>

            <span className="lpv-text-link mt-6 md:mt-8">
              Discover <span>→</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
