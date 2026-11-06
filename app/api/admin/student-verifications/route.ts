import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const verifications = await prisma.studentVerification.findMany({
    where: { status: "PENDING", method: "STUDENT_CARD" },
    select: {
      id: true,
      createdAt: true,
      cardFileName: true,
      user: { select: { id: true, name: true, email: true, studentProfile: { select: { university: { select: { name: true } } } } } },
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(verifications);
}
