import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const listingId = body?.listingId;
  const suppliedVisitorKey = body?.visitorKey;
  if (typeof listingId !== "string" || (typeof suppliedVisitorKey !== "string" || suppliedVisitorKey.length > 80)) {
    return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  }
  const viewer = await getCurrentUser();
  const type = body?.type === "IMPRESSION" ? "IMPRESSION" : "VIEW";
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, status: "PUBLISHED", isActive: true },
    select: { id: true, landlordId: true },
  });
  if (!listing || viewer?.id === listing.landlordId) return NextResponse.json({ ok: true });
  // Count one event per account (or browser for guests), not once per reload.
  const visitorKey = viewer?.id ?? suppliedVisitorKey;
  await prisma.listingAnalyticsEvent.upsert({
    where: { listingId_type_visitorKey: { listingId, type, visitorKey } },
    create: { listingId, type, visitorKey },
    update: {},
  });
  return NextResponse.json({ ok: true });
}
