import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.listingIds) ? body.listingIds.filter((id: unknown): id is string => typeof id === "string").slice(0, 100) : [];
  const visitorKey = body?.visitorKey;
  if (typeof visitorKey !== "string" || visitorKey.length > 80) return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  const viewer = await getCurrentUser();
  const listings = await prisma.listing.findMany({ where: { id: { in: ids }, status: "PUBLISHED", isActive: true }, select: { id: true, landlordId: true } });
  await prisma.listingAnalyticsEvent.createMany({
    data: listings.filter((listing) => listing.landlordId !== viewer?.id).map((listing) => ({ listingId: listing.id, type: "IMPRESSION" as const, visitorKey: viewer?.id ?? visitorKey })),
    skipDuplicates: true,
  });
  return NextResponse.json({ ok: true });
}
