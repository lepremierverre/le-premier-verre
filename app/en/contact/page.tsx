import Link from "next/link";

export const metadata = {
  title: "Contact | Le Premier Verre",
  description: "Get in touch with Le Premier Verre.",
  alternates: {
    canonical: "/en/contact",
    languages: {
      "fr-CA": "/contact",
      "en-CA": "/en/contact",
      "x-default": "/contact",
    },
  },
};

export default function ContactPage() {
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
<h1 className="mt-7 max-w-[700px] text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.06em]">
            Write to us.
          </h1>

          <div className="mt-10 max-w-[650px] space-y-6 md:mt-12">
          <p className="mt-12 max-w-[560px] text-[1rem] leading-8 text-[#625a52]">
            A bottle we should discover, a project you’d like to share, a place we should know about or an idea for a collaboration? Write to us.
          </p>

          <p className="mt-12 max-w-[560px] text-[1rem] leading-8 text-[#625a52]">
            Producers, vineyards, cider makers, restaurants, wine shops, wine professionals or simply curious readers, we love discovering what’s happening around wine in Quebec and beyond. Whether it’s a proposal, a question, an invitation or simply a hello, our inbox is open.
          </p>
        </div>

          <a
            href="mailto:contact@lepremierverre.com"
            className="mt-12 inline-block border-b border-[#75695f] pb-2 text-[1rem] transition-opacity hover:opacity-50"
          >
            contact@lepremierverre.com
          </a>
        </div>
      </article>
    </main>
  );
}
