export const bilingualRoutes = {
  home: {
    fr: "/",
    en: "/en",
  },
  tonight: {
    fr: "/ce-soir",
    en: "/en/tonight",
  },
  wines: {
    fr: "/vins",
    en: "/en/wines",
  },
  pairings: {
    fr: "/accords",
    en: "/en/pairings",
  },
  producers: {
    fr: "/producteurs",
    en: "/en/producers",
  },
  regions: {
    fr: "/regions",
    en: "/en/regions",
  },
  grapes: {
    fr: "/cepages",
    en: "/en/grapes",
  },
  places: {
    fr: "/bonnes-adresses",
    en: "/en/places",
  },
  guides: {
    fr: "/guides",
    en: "/en/guides",
  },
  journal: {
    fr: "/blog",
    en: "/en/journal",
  },
  search: {
    fr: "/recherche",
    en: "/en/search",
  },
  about: {
    fr: "/a-propos",
    en: "/en/about",
  },
  contact: {
    fr: "/contact",
    en: "/en/contact",
  },
  newsletter: {
    fr: "/newsletter",
    en: "/en/newsletter",
  },
  privacy: {
    fr: "/politique-confidentialite",
    en: "/en/privacy-policy",
  },
  signIn: {
    fr: "/connexion",
    en: "/en/sign-in",
  },
  signUp: {
    fr: "/inscription",
    en: "/en/sign-up",
  },
  favorites: {
    fr: "/favoris",
    en: "/en/favorites",
  },
  notebook: {
    fr: "/mon-carnet",
    en: "/en/notebook",
  },
  lists: {
    fr: "/mes-listes",
    en: "/en/lists",
  },
  preferences: {
    fr: "/mes-preferences",
    en: "/en/preferences",
  },

  // Futures
  cellar: {
    fr: "/ma-cave",
    en: "/en/my-cellar",
  },
  map: {
    fr: "/carte",
    en: "/en/map",
  },
  sommelier: {
    fr: "/sommelier",
    en: "/en/sommelier",
  },
  scanner: {
    fr: "/scan",
    en: "/en/scan",
  },
  recommendation: {
    fr: "/recommandation",
    en: "/en/recommendation",
  },
  premium: {
    fr: "/premium",
    en: "/en/premium",
  },
  shop: {
    fr: "/boutique",
    en: "/en/shop",
  },
  cart: {
    fr: "/panier",
    en: "/en/cart",
  },
} as const;

export type SiteLocale = "fr" | "en";
export type BilingualRouteKey = keyof typeof bilingualRoutes;
