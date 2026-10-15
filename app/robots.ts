import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin-acces/",
        "/api/",
        "/studio/",
        "/connexion/",
        "/inscription/",
        "/favoris/",
        "/mon-carnet/",
        "/mes-vins/",
        "/mes-listes/",
        "/ma-cave/",
        "/carte/",
        "/sommelier/",
        "/scan/",
        "/premium/",
        "/boutique/",
        "/panier/",
        "/recherche/",
      ],
    },
    sitemap: "https://lepremierverre.com/sitemap.xml",
    host: "https://lepremierverre.com",
  };
}
