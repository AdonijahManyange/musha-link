import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,

      studentProfile: {
        select: {
          phone: true,
          profilePhotoUrl: true,
        },
      },

      landlordProfile: {
        select: {
          phone: true,
          profilePhotoUrl: true,
        },
      },
    },
  });

  return user;
}