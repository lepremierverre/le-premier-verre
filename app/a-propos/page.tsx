import Link from "next/link";

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="mx-auto max-w-[820px] px-5 pb-24 pt-8 sm:px-8 md:pb-32 md:pt-10">
        <Link
          href="/"
          className="text-[0.65rem] uppercase tracking-[0.22em] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <header className="mt-28 md:mt-36">
          <h1 className="lpv-display max-w-[800px] text-[clamp(3.4rem,7vw,6.2rem)] leading-[0.88] tracking-[-0.045em]">
            Le vin sans le rendre plus compliqué qu’il ne l’est.
          </h1>
        </header>

        <div className="mt-16 max-w-[690px] space-y-8 text-[1rem] leading-8 md:mt-20 md:text-[1.05rem] md:leading-8">
          <p>
            Le Premier Verre est une plateforme éditoriale québécoise
            consacrée au vin, aux gens qui le font et aux endroits où on aime
            le boire. L’idée est née d’un constat assez simple. Quand on
            s’intéresse au vin, on se retrouve rapidement devant énormément
            d’information, de vocabulaire et de codes. Cépages, appellations,
            millésimes, méthodes de vinification, régions, producteurs. Tout
            ça est passionnant, mais on ne devrait pas avoir besoin de tout
            connaître pour choisir une bonne bouteille ou avoir envie d’en
            découvrir une nouvelle.
          </p>

          <p>
            Le Premier Verre a été créé pour rendre cet univers plus facile à
            explorer, sans le simplifier au point de lui enlever ce qui le
            rend intéressant.
          </p>

          <p>
            On y rassemble des bouteilles à découvrir, des producteurs d’ici
            et d’ailleurs, des régions, des cépages, des appellations et de
            bonnes adresses. On y parle aussi de ce qu’on boit, de comment on
            le choisit, de ce qu’on mange avec et des personnes derrière les
            bouteilles. Le répertoire permet de chercher et de découvrir, les
            guides donnent des repères quand on ne sait pas trop par où
            commencer et les articles permettent d’aller un peu plus loin.
            Les sélections, elles, sont pensées pour répondre aux questions
            qu’on se pose vraiment devant une tablette ou un menu : quoi
            apporter chez des amis, quoi ouvrir ce soir ou quoi essayer
            lorsqu’on a envie de sortir un peu de ses habitudes.
          </p>

          <p>
            Une place importante est aussi réservée au vin québécois. Le
            Québec compte des producteurs, des vignobles et des cidreries qui
            méritent d’être mieux connus, visités et racontés. Le Premier
            Verre veut contribuer à les faire découvrir, tout en gardant la
            porte grande ouverte sur ce qui se fait ailleurs.
          </p>

          <p>
            Il n’y a surtout pas une seule bonne façon de s’intéresser au vin
            ici. On peut vouloir comprendre ce qu’est une appellation,
            chercher une bouteille à moins de 25 $, découvrir un vignoble pour
            la fin de semaine ou simplement savoir quoi boire avec le souper.
            On peut en connaître beaucoup, un peu ou presque rien. Le Premier
            Verre est là pour donner des repères, susciter la curiosité et
            rendre le prochain verre un peu plus facile à choisir.
          </p>
        </div>
      </article>
    </main>
  );
}
