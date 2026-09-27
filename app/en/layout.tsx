import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Le Premier Verre",
    template: "%s | Le Premier Verre",
  },
  description:
    "A Quebec platform for discovering wines, producers, places and guides with simplicity.",
  alternates: {
    canonical: "/en",
    languages: {
      "fr-CA": "/",
      "en-CA": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Le Premier Verre",
    description:
      "Wines, producers, places, guides and stories to discover wine differently.",
    url: "https://lepremierverre.com/en",
    siteName: "Le Premier Verre",
    locale: "en_CA",
    type: "website",
  },
};

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
