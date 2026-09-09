import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      select: {
        id: true,
        name: true,
        city: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(universities);
  } catch (error) {
    console.error(
      "Failed to load universities:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading universities.",
      },
      {
        status: 500,
      }
    );
  }
}