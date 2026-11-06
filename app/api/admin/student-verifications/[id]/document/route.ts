import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const verification = await prisma.studentVerification.findUnique({ where: { id }, select: { cardFilePath: true, status: true, method: true } });
  if (!verification || verification.method !== "STUDENT_CARD" || !verification.cardFilePath || verification.status !== "PENDING") {
    return NextResponse.json({ error: "Pending student card not found." }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin.storage.from("verification-documents").createSignedUrl(verification.cardFilePath, 60);
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Could not open the student card." }, { status: 500 });
  return NextResponse.json({ url: data.signedUrl }, { headers: { "Cache-Control": "no-store, private" } });
}
