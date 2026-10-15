import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { getCellarByUser, createCellarBottle } from "@/lib/db/cellar";

export async function GET() {
  const user = await requireUser();
  const items = await getCellarByUser(user.id);

  return NextResponse.json({ success: true, items });
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const body = await request.json();

  const contentId = String(body?.contentId || body?.wineId || "");
  const contentType = String(body?.contentType || "wine");
  const quantity = Number(body?.quantity || 1);

  const purchasePrice =
    body?.purchasePrice !== undefined && body?.purchasePrice !== ""
      ? Number(body.purchasePrice)
      : null;

  const purchaseDate = body?.purchaseDate ? new Date(body.purchaseDate) : null;

  const location = body?.location ? String(body.location) : null;

  const drinkingWindow = body?.drinkingWindow
    ? String(body.drinkingWindow)
    : null;

  const personalNote = body?.personalNote ? String(body.personalNote) : null;

  const rating =
    body?.rating !== undefined && body?.rating !== ""
      ? Number(body.rating)
      : null;

  if (!contentId) {
    return NextResponse.json(
      { success: false, error: "contentId manquant" },
      { status: 400 }
    );
  }

  const created = await createCellarBottle(user.id, {
    contentId,
    contentType,
    quantity,
    purchasePrice,
    purchaseDate,
    location,
    drinkingWindow,
    personalNote,
    rating,
  });

  return NextResponse.json({ success: true, item: created });
}