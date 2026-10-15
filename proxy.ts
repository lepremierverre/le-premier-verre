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

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req) || isAdminRoute(req)) {
      await auth.protect();
    }

    return NextResponse.next();
  },
  {
    frontendApiProxy: {
      enabled: true,
      path: "/__clerk",
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
