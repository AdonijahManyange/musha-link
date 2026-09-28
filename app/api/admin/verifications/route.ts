import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const verifications =
      await prisma.landlordVerification.findMany({
        where: {
          status: {
            in: ["PENDING", "ACTION_REQUIRED"],
          },
        },
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              verified: true,
              landlordProfile: {
                select: {
                  phone: true,
                  city: true,
                  province: true,
                  country: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    return NextResponse.json(verifications);
  } catch (error) {
    console.error(
      "Admin verification queue error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to load verifications" },
      { status: 500 }
    );
  }
}