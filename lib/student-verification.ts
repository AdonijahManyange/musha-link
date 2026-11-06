import { prisma } from "@/lib/prisma";

export async function isStudentVerified(userId: string) {
  const verification = await prisma.studentVerification.findUnique({
    where: { userId },
    select: { status: true },
  });

  return verification?.status === "APPROVED";
}
