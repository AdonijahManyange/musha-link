import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// GET — Get one conversation + messages
// ============================================================

export async function GET(
  request: Request,
  context: RouteContext
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
    // Conversation ID
    // ----------------------------------------------------------

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Find conversation
    // ----------------------------------------------------------

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id,

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
          // ----------------------------------------------------
          // Listing
          // ----------------------------------------------------

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

          // ----------------------------------------------------
          // Student
          // ----------------------------------------------------

          student: {
            select: {
              id: true,
              name: true,
              email: true,

              studentProfile: {
                select: {
                  profilePhotoUrl: true,
                },
              },
            },
          },

          // ----------------------------------------------------
          // Landlord
          // ----------------------------------------------------

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

          // ----------------------------------------------------
          // Messages
          // ----------------------------------------------------

          messages: {
            orderBy: {
              createdAt: "asc",
            },

            select: {
              id: true,
              conversationId: true,
              senderId: true,
              recipientId: true,
              content: true,
              read: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

    if (!conversation) {
      return NextResponse.json(
        {
          error:
            "Conversation not found or you do not have access to it.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Mark received messages as read
    // ----------------------------------------------------------

    await prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        recipientId: user.id,
        read: false,
      },

      data: {
        read: true,
      },
    });

    // ----------------------------------------------------------
    // Return conversation
    // ----------------------------------------------------------

    return NextResponse.json({
      conversation,
    });
  } catch (error) {
    console.error(
      "Failed to load conversation:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading the conversation.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST — Send message
// ============================================================

export async function POST(
  request: Request,
  context: RouteContext
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
    // Conversation ID
    // ----------------------------------------------------------

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Verify conversation access
    // ----------------------------------------------------------

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id,

          OR: [
            {
              studentId: user.id,
            },
            {
              landlordId: user.id,
            },
          ],
        },

        select: {
          id: true,
          studentId: true,
          landlordId: true,
          listingId: true,
        },
      });

    if (!conversation) {
      return NextResponse.json(
        {
          error:
            "Conversation not found or you do not have access to it.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Read request body
    // ----------------------------------------------------------

    const body = await request.json();

    const { message } = body;

    // ----------------------------------------------------------
    // Validate message
    // ----------------------------------------------------------

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          error: "Message cannot be empty.",
        },
        { status: 400 }
      );
    }

    const content = message.trim();

    // ----------------------------------------------------------
    // Determine recipient
    // ----------------------------------------------------------

    const recipientId =
      user.id === conversation.studentId
        ? conversation.landlordId
        : conversation.studentId;

    // ----------------------------------------------------------
    // Create message
    // ----------------------------------------------------------

    const createdMessage =
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          recipientId,
          content,
        },

        select: {
          id: true,
          conversationId: true,
          senderId: true,
          recipientId: true,
          content: true,
          read: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    // ----------------------------------------------------------
    // Update conversation timestamp
    // ----------------------------------------------------------

    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },

      data: {
        updatedAt: new Date(),
      },
    });

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        message: createdMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to send message:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while sending the message.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH — Mark conversation messages as read
// ============================================================

export async function PATCH(
  request: Request,
  context: RouteContext
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
    // Conversation ID
    // ----------------------------------------------------------

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Verify conversation access
    // ----------------------------------------------------------

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id,

          OR: [
            {
              studentId: user.id,
            },
            {
              landlordId: user.id,
            },
          ],
        },

        select: {
          id: true,
        },
      });

    if (!conversation) {
      return NextResponse.json(
        {
          error:
            "Conversation not found or you do not have access to it.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Mark unread messages received by current user as read
    // ----------------------------------------------------------

    const result =
      await prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          recipientId: user.id,
          read: false,
        },

        data: {
          read: true,
        },
      });

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json({
      message: "Messages marked as read.",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error(
      "Failed to mark messages as read:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while marking messages as read.",
      },
      { status: 500 }
    );
  }
}