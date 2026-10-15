import { cookies } from "next/headers";
import { client } from "@/sanity/lib/client";

const FAVORITES_COOKIE = "lepremierverre_favorites";

function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return [
    ...new Set(
      input.filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      )
    ),
  ];
}

async function readFavoriteSlugs(): Promise<string[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(FAVORITES_COOKIE)?.value;

  if (!raw) return [];

  try {
    return normalizeStringArray(JSON.parse(raw));
  } catch {
    return [];
  }
}

async function writeFavoriteSlugs(slugs: string[]) {
  const cookieStore = await cookies();

  cookieStore.set(FAVORITES_COOKIE, JSON.stringify(slugs), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const favorites = await readFavoriteSlugs();

  return Response.json({
    ok: true,
    active: slug ? favorites.includes(slug) : false,
    favorites,
    count: favorites.length,
  });
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: "Body JSON invalide." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return Response.json(
      { ok: false, error: "Body JSON invalide." },
      { status: 400 }
    );
  }

  const payload = body as { slug?: unknown };
  const slug =
    typeof payload.slug === "string" ? payload.slug.trim() : "";

  if (!slug) {
    return Response.json(
      { ok: false, error: "Le slug du vin est requis." },
      { status: 400 }
    );
  }

  const existingWine = await client.fetch<{ _id: string } | null>(
    `*[
      _type == "wine" &&
      slug.current == $slug &&
      published == true
    ][0]{ _id }`,
    { slug }
  );

  if (!existingWine) {
    return Response.json(
      { ok: false, error: "Vin introuvable." },
      { status: 404 }
    );
  }

  const favorites = await readFavoriteSlugs();
  const isActive = favorites.includes(slug);

  const nextFavorites = isActive
    ? favorites.filter((item) => item !== slug)
    : [slug, ...favorites];

  await writeFavoriteSlugs(nextFavorites);

  return Response.json({
    ok: true,
    active: !isActive,
    favorites: nextFavorites,
    count: nextFavorites.length,
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return Response.json(
      { ok: false, error: "Le slug du vin est requis." },
      { status: 400 }
    );
  }

  const favorites = await readFavoriteSlugs();
  const nextFavorites = favorites.filter((item) => item !== slug);

  await writeFavoriteSlugs(nextFavorites);

  return Response.json({
    ok: true,
    active: false,
    favorites: nextFavorites,
    count: nextFavorites.length,
  });
}
