import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GET — Get current user's conversations
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
    // Find conversations
    // ----------------------------------------------------------

    const conversations =
      await prisma.conversation.findMany({
        where: {
          OR: [
            {
              studentId: user.id,
            },
            {
              landlordId: user.id,
            },
          ],
        },

        include: {
          listing: {
            select: {
              id: true,
              title: true,
              city: true,
              province: true,
              suburb: true,

              photos: {
                orderBy: {
                  sortOrder: "asc",
                },

                take: 1,
              },
            },
          },

          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          landlord: {
            select: {
              id: true,
              name: true,
              email: true,

              landlordProfile: {
                select: {
                  phone: true,
                  profilePhotoUrl: true,
                },
              },
            },
          },

          messages: {
            orderBy: {
              createdAt: "desc",
            },

            take: 1,

            select: {
              id: true,
              content: true,
              senderId: true,
              recipientId: true,
              read: true,
              createdAt: true,
            },
          },
        },

        orderBy: {
          updatedAt: "desc",
        },
      });

    // ----------------------------------------------------------
    // Add unread count
    // ----------------------------------------------------------

    const conversationsWithUnread =
      await Promise.all(
        conversations.map(
          async (conversation) => {
            const unreadCount =
              await prisma.message.count({
                where: {
                  conversationId:
                    conversation.id,

                  recipientId: user.id,

                  read: false,
                },
              });

            return {
              ...conversation,

              latestMessage:
                conversation.messages[0] ??
                null,

              unreadCount,
            };
          }
        )
      );

    return NextResponse.json(
      conversationsWithUnread
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

// ============================================================
// POST — Create or retrieve conversation
// ============================================================

export async function POST(
  request: Request
) {
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
            "Only students can start a conversation with a landlord.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Request body
    // ----------------------------------------------------------

    const body = await request.json();

    const {
      listingId,
      message,
    } = body;

    // ----------------------------------------------------------
    // Validate listing
    // ----------------------------------------------------------

    if (
      typeof listingId !== "string" ||
      !listingId.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "A listing is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Find listing
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.findFirst({
        where: {
          id: listingId,

          status: "PUBLISHED",

          isActive: true,
        },

        select: {
          id: true,
          title: true,
          landlordId: true,
        },
      });

    if (!listing) {
      return NextResponse.json(
        {
          error:
            "Listing not found or is no longer available.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Prevent landlord from messaging themselves
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
    // Find or create conversation
    // ----------------------------------------------------------

    const conversation =
      await prisma.conversation.upsert({
        where: {
          studentId_landlordId_listingId: {
            studentId: user.id,

            landlordId:
              listing.landlordId,

            listingId: listing.id,
          },
        },

        create: {
          studentId: user.id,

          landlordId:
            listing.landlordId,

          listingId: listing.id,
        },

        update: {},
      });

    // ----------------------------------------------------------
    // Optional initial message
    // ----------------------------------------------------------

    let createdMessage = null;

    if (
      typeof message === "string" &&
      message.trim()
    ) {
      createdMessage =
        await prisma.message.create({
          data: {
            conversationId:
              conversation.id,

            senderId: user.id,

            recipientId:
              listing.landlordId,

            content: message.trim(),
          },
        });

      // Touch conversation so it moves
      // to the top of the inbox.
      await prisma.conversation.update({
        where: {
          id: conversation.id,
        },

        data: {
          updatedAt: new Date(),
        },
      });
    }

    // ----------------------------------------------------------
    // Return conversation
    // ----------------------------------------------------------

    const result =
      await prisma.conversation.findUnique({
        where: {
          id: conversation.id,
        },

        include: {
          listing: {
            select: {
              id: true,
              title: true,
              city: true,
              province: true,
              suburb: true,

              photos: {
                orderBy: {
                  sortOrder: "asc",
                },

                take: 1,
              },
            },
          },

          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          landlord: {
            select: {
              id: true,
              name: true,
              email: true,

              landlordProfile: {
                select: {
                  phone: true,
                  profilePhotoUrl: true,
                },
              },
            },
          },
        },
      });

    return NextResponse.json(
      {
        conversation: result,

        message: createdMessage,
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
          "Something went wrong while starting the conversation.",
      },
      { status: 500 }
    );
  }
}