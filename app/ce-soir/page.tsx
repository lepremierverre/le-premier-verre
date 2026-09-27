import Link from "next/link";

const moments = [
  {
    number: "01",
    eyebrow: "À table",
    title: "Je cuisine.",
    description:
      "Trouver une bouteille selon le plat, la sauce, la saison ou simplement ce qu’il reste dans le frigo.",
    href: "/accords",
  },
  {
    number: "02",
    eyebrow: "Recevoir",
    title: "Je reçois.",
    description:
      "Une bouteille rassembleuse qui accompagne la table sans prendre toute la place.",
    href: "/guides",
  },
  {
    number: "03",
    eyebrow: "Apporter",
    title: "J’arrive avec une bouteille.",
    description:
      "Trouver une valeur sûre selon le budget, l’occasion et les personnes autour de la table.",
    href: "/vins",
  },
  {
    number: "04",
    eyebrow: "Découvrir",
    title: "Je veux être surpris.",
    description:
      "Sortir de ses habitudes avec une bouteille moins évidente et quelque chose à raconter.",
    href: "/vins",
  },
  {
    number: "05",
    eyebrow: "Sortir",
    title: "Je veux aller quelque part.",
    description:
      "Un bar à vin, un restaurant, un caviste ou une adresse à garder pour plus tard.",
    href: "/bonnes-adresses",
  },
  {
    number: "06",
    eyebrow: "Instinct",
    title: "Je ne sais pas.",
    description:
      "Quelques questions simples pour trouver la bouteille qui correspond au moment.",
    href: "/vins",
  },
];

export default function CeSoirPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="border-b border-[var(--lpv-line)]">
        <div className="lpv-container grid gap-8 py-12 md:grid-cols-[0.68fr_0.32fr] md:items-end md:gap-12 md:py-24">
          <div>
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Ce soir
            </p>

            <h1 className="lpv-display mt-5 max-w-6xl text-[clamp(4rem,17vw,5.2rem)] leading-[0.84] md:mt-7 md:text-[clamp(4.8rem,10vw,10rem)] md:leading-[0.82]">
              Qu’est-ce
              <br />
              qu’on ouvre?
            </h1>
          </div>

          <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-2 md:pt-6">
            <p className="max-w-md text-base leading-7 text-[var(--lpv-muted)] md:leading-8">
              Commence par le moment. Le repas, les gens, l’envie ou le budget
              viennent ensuite.
            </p>

            <Link
              href="/accords"
              className="lpv-text-link mt-6 md:mt-8"
            >
              Partir de ce qu’on mange <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="lpv-container py-12 md:py-24">
        <div className="border-b border-[var(--lpv-line)] pb-5 md:pb-6">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            Choisir le moment
          </p>

          <h2 className="lpv-display mt-4 text-[2.75rem] leading-none md:mt-5 md:text-7xl">
            Par où commencer.
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
              Sans alcool
            </p>

            <h2 className="lpv-display mt-4 text-[2.75rem] leading-[0.92] md:mt-6 md:text-7xl md:leading-[0.9]">
              Je ne bois pas
              <br />
              ce soir.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-base leading-7 text-[var(--lpv-muted)] md:text-lg md:leading-8">
              Pas besoin d’alcool pour avoir quelque chose de bon dans le verre.
              Découvre des bouteilles choisies pour ce qu’elles ont à offrir,
              tout simplement.
            </p>

            <Link
              href="/sans-alcool"
              className="lpv-button lpv-button-dark mt-7 md:mt-9"
            >
              Découvrir le sans-alcool
            </Link>
          </div>
        </div>
      </section>

      <section className="lpv-container py-12 md:py-24">
        <div className="grid gap-0 md:grid-cols-3 md:gap-10">
          <Link
            href="/vins"
            className="group border-t border-[var(--lpv-line)] py-7 md:py-0 md:pt-6"
          >
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Répertoire
            </p>

            <h2 className="lpv-display mt-4 text-[2.15rem] leading-[0.94] md:mt-6 md:text-5xl md:leading-[0.92]">
              Voir toutes
              <br />
              les bouteilles.
            </h2>

            <span className="lpv-text-link mt-6 md:mt-8">
              Explorer <span>→</span>
            </span>
          </Link>

          <Link
            href="/guides"
            className="group border-t border-[var(--lpv-line)] py-7 md:py-0 md:pt-6"
          >
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Comprendre
            </p>

            <h2 className="lpv-display mt-4 text-[2.15rem] leading-[0.94] md:mt-6 md:text-5xl md:leading-[0.92]">
              Lire sans
              <br />
              trop compliquer.
            </h2>

            <span className="lpv-text-link mt-6 md:mt-8">
              Voir les guides <span>→</span>
            </span>
          </Link>

          <Link
            href="/bonnes-adresses"
            className="group border-t border-[var(--lpv-line)] py-7 md:py-0 md:pt-6"
          >
            <p className="lpv-kicker text-[var(--lpv-cocoa)]">
              Sortir
            </p>

            <h2 className="lpv-display mt-4 text-[2.15rem] leading-[0.94] md:mt-6 md:text-5xl md:leading-[0.92]">
              Trouver une
              <br />
              bonne adresse.
            </h2>

            <span className="lpv-text-link mt-6 md:mt-8">
              Découvrir <span>→</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
