import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <article className="mx-auto max-w-[820px] px-5 pb-24 pt-8 sm:px-8 md:pb-32 md:pt-10">
        <Link
          href="/en"
          className="text-[0.65rem] uppercase tracking-[0.22em] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <header className="mt-28 md:mt-36">
          <h1 className="lpv-display max-w-[800px] text-[clamp(3.4rem,7vw,6.2rem)] leading-[0.88] tracking-[-0.045em]">
            Wine without making it more complicated than it needs to be.
          </h1>
        </header>

        <div className="mt-16 max-w-[690px] space-y-8 text-[1rem] leading-8 md:mt-20 md:text-[1.05rem] md:leading-8">
          <p>
            Le Premier Verre is a Quebec-based editorial platform dedicated
            to wine, the people who make it and the places where we like to
            drink it. It started with a simple observation. Once you become
            interested in wine, you quickly encounter an enormous amount of
            information, vocabulary and unwritten rules. Grapes,
            appellations, vintages, winemaking methods, regions, producers.
            All of it can be fascinating, but you shouldn’t have to know
            everything to choose a good bottle or feel like discovering
            something new.
          </p>

          <p>
            Le Premier Verre was created to make that world easier to explore,
            without simplifying it to the point of taking away what makes it
            interesting.
          </p>

          <p>
            Here you’ll find bottles worth discovering, producers from Quebec
            and beyond, regions, grape varieties, appellations and places
            worth knowing. We also talk about what we drink, how we choose it,
            what we eat with it and the people behind the bottles. The
            directory is there to search and explore, the guides offer useful
            reference points when you’re not quite sure where to start, and
            the articles give you room to go a little further. Our selections
            are built around the questions people actually ask in front of a
            shelf or a wine list: what to bring to a friend’s place, what to
            open tonight or what to try when you feel like stepping outside
            your usual choices.
          </p>

          <p>
            Quebec wine also has an important place here. The province is
            home to producers, vineyards and cider makers that deserve to be
            better known, visited and talked about. Le Premier Verre wants to
            help people discover them while keeping the door wide open to
            what is being made elsewhere.
          </p>

          <p>
            Most importantly, there isn’t just one right way to be interested
            in wine. You might want to understand what an appellation means,
            find a bottle under $25, discover a vineyard for the weekend or
            simply figure out what to drink with dinner. You can know a lot,
            a little or almost nothing. Le Premier Verre is here to offer a
            few useful reference points, spark curiosity and make the next
            glass a little easier to choose.
          </p>
        </div>
      </article>
    </main>
  );
}
