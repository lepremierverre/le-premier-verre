import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

export const metadata = {
  title: "Newsletter | Le Premier Verre",
  description:
    "Bottles, producers, places and discoveries from Le Premier Verre.",
  alternates: {
    canonical: "/en/newsletter",
    languages: {
      "fr-CA": "/newsletter",
      "en-CA": "/en/newsletter",
      "x-default": "/newsletter",
    },
  },
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <div className="mx-auto max-w-[920px] px-6 pb-24 pt-16 sm:px-10 md:pb-32 md:pt-24">
        <Link
          href="/en"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <div className="mt-28 md:mt-36">
          <h1 className="max-w-[760px] text-[clamp(3.5rem,8vw,6.4rem)] font-medium leading-[0.94] tracking-[-0.06em]">
            Your next glass starts here.
          </h1>

          <div className="mt-12 max-w-[650px] space-y-5 text-[0.98rem] leading-8 md:mt-14 md:text-[1.02rem]">
            <p>
              Every so often, we send you the bottles we want to share, the
              producers we’re following, the places we’ve discovered and the
              stories we think are worth telling.
            </p>

            <p>
              It’s also where we share new guides, our latest selections,
              Le Premier Verre events and a few discoveries we save for
              subscribers.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </div>
    </main>
  );
}
