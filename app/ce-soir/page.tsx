import Link from "next/link";

const choices = [
  {
    title: "Je reçois.",
    text: "Une bouteille pour mettre sur la table.",
    href: "/guides",
  },
  {
    title: "J’apporte une bouteille.",
    text: "Quelque chose qui fait bien, sans trop y penser.",
    href: "/vins",
  },
  {
    title: "Je veux être surpris.",
    text: "Sortir un peu de ce que tu bois d’habitude.",
    href: "/vins",
  },
  {
    title: "Je veux sortir.",
    text: "Un bar, une table ou une adresse à essayer.",
    href: "/bonnes-adresses",
  },
  {
    title: "Je ne sais pas.",
    text: "Commence simplement par les bouteilles.",
    href: "/vins",
  },
];

export default function CeSoirPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container">
        <div className="mx-auto max-w-[920px] pb-16 pt-20 text-center md:pb-24 md:pt-28">
          <h1 className="lpv-display text-[clamp(3.4rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.035em]">
            Ce soir, on boit quoi?
          </h1>

          <p className="mx-auto mt-7 max-w-md text-base leading-7">
            Dis-nous juste ce qui se passe.
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
              À table
            </p>

            <h2 className="lpv-display mt-5 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]">
              Je cuisine.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--lpv-muted)]">
              Les accords arrivent bientôt.
            </p>

            <Link
              href="/accords"
              className="mt-7 inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span>Voir les accords</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="border border-[var(--lpv-line)] p-7 md:p-9">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em]">
              Sans alcool
            </p>

            <h2 className="lpv-display mt-5 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95]">
              Pas ce soir.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--lpv-muted)]">
              Quelque chose de bon dans le verre, sans alcool.
            </p>

            <Link
              href="/sans-alcool"
              className="mt-7 inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
            >
              <span>Voir le sans-alcool</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
