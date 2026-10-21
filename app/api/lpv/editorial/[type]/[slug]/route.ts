import { NextResponse } from "next/server";
import { getArticle, getGuide } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      type: string;
      slug: string;
    }>;
  }
) {
  try {
    const { type, slug } = await context.params;

    if (!slug || !["article", "guide"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid editorial request" },
        { status: 400 }
      );
    }

    const item =
      type === "article"
        ? await getArticle(slug)
        : await getGuide(slug);

    if (!item) {
      return NextResponse.json(
        { error: "Editorial content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      type,
      item,
    });
  } catch (error) {
    console.error("LPV editorial detail error:", error);

    return NextResponse.json(
      { error: "Unable to load editorial content" },
      { status: 500 }
    );
  }
}
