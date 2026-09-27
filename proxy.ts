import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/ma-cave(.*)",
  "/mon-carnet(.*)",
  "/mes-vins(.*)",
  "/mes-listes(.*)",
  "/scan(.*)",
  "/favoris(.*)",
  "/panier(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

/*
 * Fonctionnalités conservées dans le code,
 * mais volontairement invisibles au public
 * jusqu'à leur lancement officiel.
 *
 * Elles restent accessibles sur localhost
 * pour permettre leur développement et leurs tests.
 */
const isFutureRoute = createRouteMatcher([
  "/carte(.*)",
  "/sommelier(.*)",
  "/scan(.*)",
  "/premium(.*)",
  "/boutique(.*)",
  "/panier(.*)",
  "/recommandation(.*)",
  "/ma-cave(.*)",
  "/apercu(.*)",
  "/vignobles(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  const hostname = req.nextUrl.hostname;
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  /*
   * Pré-lancement :
   * la vraie page d'accueil reste visible localement,
   * tandis que le domaine public affiche la page d'attente.
   */
  if (pathname === "/" && !isLocal) {
    return NextResponse.rewrite(
      new URL("/disponible-bientot", req.url)
    );
  }

  if (pathname === "/en" && !isLocal) {
    return NextResponse.rewrite(
      new URL("/en/disponible-bientot", req.url)
    );
  }

  /*
   * Routes des fonctionnalités futures :
   * invisibles en production, disponibles localement.
   */
  if (!isLocal && isFutureRoute(req)) {
    return NextResponse.rewrite(
      new URL("/_indisponible", req.url)
    );
  }

  if (isProtectedRoute(req) || isAdminRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
