import Link from "next/link";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

export const metadata = {
  title: "Newsletter | Le Premier Verre",
  description: "Receive news and discoveries from Le Premier Verre.",
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
    <main className="min-h-screen bg-[#f3efe6] px-6 py-16 text-[#211d19] sm:px-10 md:py-24">
      <div className="mx-auto max-w-[920px]">
        <Link
          href="/en"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#776e65] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <div className="mt-20 md:mt-28">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#85786d]">
            The newsletter
          </p>

          <h1 className="mt-7 max-w-[760px] text-[clamp(3rem,8vw,6.4rem)] font-medium leading-[0.94] tracking-[-0.06em]">
            Your next glass starts here.
          </h1>

          <p className="mt-10 max-w-[560px] text-[0.98rem] leading-8 text-[#625a52]">
            Discoveries, bottles and places worth sharing.
          </p>

          <NewsletterForm />
        </div>
      </div>
    </main>
  );
}
