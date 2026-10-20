import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const identity = await prisma.$queryRaw<
      Array<{
        database: string;
        schema: string;
        user_name: string;
      }>
    >`
      SELECT
        current_database() AS database,
        current_schema() AS schema,
        current_user AS user_name
    `;

    const tables = await prisma.$queryRaw<
      Array<{ table_name: string }>
    >`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const counts = await prisma.$queryRaw<
      Array<{
        users: bigint;
        cellar_bottles: bigint;
        shop_products: bigint;
      }>
    >`
      SELECT
        (SELECT COUNT(*) FROM "User") AS users,
        (SELECT COUNT(*) FROM "CellarBottle") AS cellar_bottles,
        (SELECT COUNT(*) FROM "ShopProduct") AS shop_products
    `;

    return NextResponse.json({
      database: identity[0]?.database ?? null,
      schema: identity[0]?.schema ?? null,
      user: identity[0]?.user_name ?? null,
      tables: tables.map((row) => row.table_name),
      hasAnalyticsEvent: tables.some(
        (row) => row.table_name === "AnalyticsEvent"
      ),
      counts: {
        users: Number(counts[0]?.users ?? 0),
        cellarBottles: Number(counts[0]?.cellar_bottles ?? 0),
        shopProducts: Number(counts[0]?.shop_products ?? 0),
      },
    });
  } catch (error) {
    console.error("DB diagnostic error:", error);

    return NextResponse.json(
      { error: "Diagnostic failed" },
      { status: 500 }
    );
  }
}
