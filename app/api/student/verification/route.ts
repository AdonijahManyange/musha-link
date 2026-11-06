import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  if (user.role !== "STUDENT") {
    return NextResponse.json({ error: "Only students can access student verification." }, { status: 403 });
  }

  const verification = await prisma.studentVerification.findUnique({
    where: { userId: user.id },
    select: {
      method: true,
      status: true,
      schoolEmail: true,
      cardFileName: true,
      rejectionReason: true,
      reviewedAt: true,
    },
  });

  return NextResponse.json({
    verification: verification ?? { method: null, status: "NOT_STARTED" },
  });
}
