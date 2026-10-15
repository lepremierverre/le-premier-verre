import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ClientError } from "@sanity/client";

import { writeClient } from "@/sanity/lib/write-client";

type RouteContext = {
  params: Promise<{
    listId: string;
  }>;
};

async function getOwnedList(listId: string, userId: string) {
  return writeClient.fetch(
    `*[_type == "wineList" && _id == $listId && userId == $userId][0]{
      _id,
      _rev,
      userId,
      name,
      wines
    }`,
    { listId, userId }
  );
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listId } = await context.params;
  const list = await getOwnedList(listId, userId);

  if (!list) {
    return NextResponse.json(
      { error: "Liste introuvable." },
      { status: 404 }
    );
  }

  await writeClient.delete(listId);

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listId } = await context.params;
  const list = await getOwnedList(listId, userId);

  if (!list) {
    return NextResponse.json(
      { error: "Liste introuvable." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const action = body?.action;
  const wineId =
    typeof body?.wineId === "string" ? body.wineId.trim() : "";

  if (!wineId || !["add", "remove"].includes(action)) {
    return NextResponse.json(
      { error: "Action ou vin invalide." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  let changed = false;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const currentList = await getOwnedList(listId, userId);

    if (!currentList) {
      return NextResponse.json(
        { error: "Liste introuvable." },
        { status: 404 }
      );
    }

    const wines = Array.isArray(currentList.wines)
      ? currentList.wines
      : [];

    const alreadyExists = wines.some(
      (wine: { _ref?: string }) => wine?._ref === wineId
    );

    if (action === "add" && alreadyExists) {
      changed = false;
      break;
    }

    if (action === "remove" && !alreadyExists) {
      changed = false;
      break;
    }

    try {
      if (action === "add") {
        await writeClient
          .patch(listId)
          .ifRevisionId(currentList._rev)
          .setIfMissing({ wines: [] })
          .append("wines", [
            {
              _type: "reference",
              _ref: wineId,
              _key: crypto.randomUUID(),
            },
          ])
          .set({ updatedAt: now })
          .commit();
      } else {
        await writeClient
          .patch(listId)
          .ifRevisionId(currentList._rev)
          .unset([`wines[_ref=="${wineId}"]`])
          .set({ updatedAt: now })
          .commit();
      }

      changed = true;
      break;
    } catch (error) {
      const isRevisionConflict =
        error instanceof ClientError &&
        error.statusCode === 409;

      if (!isRevisionConflict) {
        throw error;
      }

      if (attempt === 4) {
        return NextResponse.json(
          {
            error:
              "La liste a été modifiée simultanément. Veuillez réessayer.",
          },
          { status: 409 }
        );
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 25 * (attempt + 1))
      );
    }
  }

  return NextResponse.json({
    ok: true,
    action,
    changed,
    wineId,
    listId,
  });
}
