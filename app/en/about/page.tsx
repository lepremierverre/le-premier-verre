import Link from "next/link";

export const metadata = {
  title: "About | Le Premier Verre",
  description:
    "About Le Premier Verre, a Quebec editorial platform dedicated to wine.",
  alternates: {
    canonical: "/en/about",
    languages: {
      "fr-CA": "/a-propos",
      "en-CA": "/en/about",
      "x-default": "/a-propos",
    },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f3efe6] px-6 py-16 text-[#211d19] sm:px-10 md:py-24">
      <article className="mx-auto max-w-[820px]">
        <Link
          href="/en"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#776e65] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <div className="mt-20 md:mt-28">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#85786d]">
            About
          </p>

          <h1 className="mt-7 max-w-[760px] text-[clamp(2.8rem,7vw,5.8rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            Wine without making it more complicated than it needs to be.
          </h1>

          <div className="mt-14 max-w-[620px] space-y-7 text-[0.98rem] leading-8 text-[#625a52]">
            <p>
              Le Premier Verre is a Quebec editorial platform dedicated to
              bottles, producers, places and stories that make you want to
              discover wine differently.
            </p>

            <p>
              You don&apos;t need to master the vocabulary or know every
              appellation. We&apos;re here to help you choose, understand,
              taste and feel like exploring a little further.
            </p>

            <p>
              Le Premier Verre officially launches on October 15, 2026.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
