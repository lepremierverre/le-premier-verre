import Link from "next/link";

export const metadata = {
  title: "Contact | Le Premier Verre",
  description: "Nous joindre au Premier Verre.",
  alternates: {
    canonical: "/contact",
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
          href="/"
          className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#776e65] transition-opacity hover:opacity-50"
        >
          ← Le Premier Verre
        </Link>

        <div className="mt-20 md:mt-28">
<h1 className="mt-7 max-w-[700px] text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.06em]">
            Écrivez-nous.
          </h1>

          <div className="mt-10 max-w-[650px] space-y-6 md:mt-12">
          <p className="mt-12 max-w-[560px] text-[1rem] leading-8 text-[#625a52]">
            Une bouteille à nous faire découvrir, un projet à nous présenter, une adresse qu’on devrait connaître ou une idée de collaboration? Écrivez-nous.
          </p>

          <p className="mt-12 max-w-[560px] text-[1rem] leading-8 text-[#625a52]">
            Producteurs, vignobles, cidreries, restaurants, cavistes, professionnels du vin ou simplement curieux, on aime découvrir ce qui se passe autour du vin au Québec et ailleurs. Pour une proposition, une question, une invitation ou simplement pour nous dire bonjour, notre boîte courriel est ouverte.
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
