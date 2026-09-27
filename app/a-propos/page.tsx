import Link from "next/link";

export const metadata = {
  title: "À propos | Le Premier Verre",
  description: "À propos du Premier Verre, plateforme éditoriale québécoise consacrée au vin.",
  alternates: {
    canonical: "/a-propos",
    languages: {
      "fr-CA": "/a-propos",
      "en-CA": "/en/about",
      "x-default": "/a-propos",
    },
  },
};

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-[#f3efe6] px-6 py-16 text-[#211d19] sm:px-10 md:py-24">
      <article className="mx-auto max-w-[820px]">
        <Link
          href="/"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#776e65] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <div className="mt-20 md:mt-28">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#85786d]">
            À propos
          </p>

          <h1 className="mt-7 max-w-[760px] text-[clamp(2.8rem,7vw,5.8rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            Le vin sans le rendre plus compliqué qu’il ne l’est.
          </h1>

          <div className="mt-14 max-w-[620px] space-y-7 text-[0.98rem] leading-8 text-[#625a52]">
            <p>
              Le Premier Verre est une plateforme éditoriale québécoise consacrée
              aux bouteilles, aux producteurs, aux lieux et aux histoires qui
              donnent envie de découvrir le vin autrement.
            </p>

            <p>
              Ici, pas besoin de maîtriser le vocabulaire ni de connaître toutes
              les appellations. On veut surtout aider à choisir, comprendre,
              goûter et avoir envie d’aller voir un peu plus loin.
            </p>

            <p>
              Le Premier Verre ouvrira officiellement le 15 octobre 2026.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
