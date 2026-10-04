import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// POST — Create or get conversation
// ============================================================

export async function POST(request: Request) {
  try {
    // ----------------------------------------------------------
    // Authentication
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    // ----------------------------------------------------------
    // Only students can start conversations
    // ----------------------------------------------------------

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          error:
            "Only students can start conversations.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Request body
    // ----------------------------------------------------------

    const body = await request.json();

    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        {
          error: "Listing ID is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Find listing
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.findUnique({
        where: {
          id: listingId,
        },

        select: {
          id: true,
          status: true,
          isActive: true,
          landlordId: true,
          title: true,
        },
      });

    if (!listing) {
      return NextResponse.json(
        {
          error: "Listing not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Only published listings can receive messages
    // ----------------------------------------------------------

    if (
      listing.status !== "PUBLISHED" ||
      !listing.isActive
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot contact the landlord of this listing.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Prevent student from messaging themselves
    // ----------------------------------------------------------

    if (listing.landlordId === user.id) {
      return NextResponse.json(
        {
          error:
            "You cannot start a conversation with yourself.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Check for existing conversation
    // ----------------------------------------------------------

    const existingConversation =
      await prisma.conversation.findUnique({
        where: {
          studentId_landlordId_listingId: {
            studentId: user.id,
            landlordId: listing.landlordId,
            listingId: listing.id,
          },
        },

        include: {
          listing: {
            select: {
              id: true,
              title: true,
            },
          },

          landlord: {
            select: {
              id: true,
              name: true,
            },
          },

          messages: {
            orderBy: {
              createdAt: "desc",
            },

            take: 1,
          },
        },
      });

    if (existingConversation) {
      return NextResponse.json({
        conversation: existingConversation,
        existing: true,
      });
    }

    // ----------------------------------------------------------
    // Create conversation
    // ----------------------------------------------------------

    const conversation =
      await prisma.conversation.create({
        data: {
          studentId: user.id,
          landlordId: listing.landlordId,
          listingId: listing.id,
        },

        include: {
          listing: {
            select: {
              id: true,
              title: true,
            },
          },

          landlord: {
            select: {
              id: true,
              name: true,
            },
          },

          messages: true,
        },
      });

    // ----------------------------------------------------------
    // Success
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        message:
          "Conversation created successfully.",

        conversation,

        existing: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to create conversation:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating the conversation.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// GET — Get conversations for current user
// ============================================================

export async function GET() {
  try {
    // ----------------------------------------------------------
    // Authentication
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    // ----------------------------------------------------------
    // Student conversations
    // ----------------------------------------------------------

    if (user.role === "STUDENT") {
      const conversations =
        await prisma.conversation.findMany({
          where: {
            studentId: user.id,
          },

          orderBy: {
            updatedAt: "desc",
          },

          include: {
            listing: {
              select: {
                id: true,
                title: true,
                city: true,
                suburb: true,
              },
            },

            landlord: {
              select: {
                id: true,
                name: true,
              },
            },

            messages: {
              orderBy: {
                createdAt: "desc",
              },

              take: 1,
            },
          },
        });

      return NextResponse.json({
        conversations,
      });
    }

    // ----------------------------------------------------------
    // Landlord conversations
    // ----------------------------------------------------------

    if (user.role === "LANDLORD") {
      const conversations =
        await prisma.conversation.findMany({
          where: {
            landlordId: user.id,
          },

          orderBy: {
            updatedAt: "desc",
          },

          include: {
            listing: {
              select: {
                id: true,
                title: true,
                city: true,
                suburb: true,
              },
            },

            student: {
              select: {
                id: true,
                name: true,
              },
            },

            messages: {
              orderBy: {
                createdAt: "desc",
              },

              take: 1,
            },
          },
        });

      return NextResponse.json({
        conversations,
      });
    }

    return NextResponse.json(
      {
        error:
          "Your account cannot access conversations.",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error(
      "Failed to load conversations:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading conversations.",
      },
      { status: 500 }
    );
  }
}