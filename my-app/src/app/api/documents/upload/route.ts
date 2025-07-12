import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { researchDocs } from "@/utils/schema";
import { auth } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    // verify if user authenticated
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Body or title not found!" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(researchDocs)
      .values({
        userId: session.user.id,
        title: title,
        content: content,
      })
      .returning();

    const insertedDoc = result[0];

    return NextResponse.json({
      success: true,
      message: "Document was uploaded!",
      document: {
        id: insertedDoc.id,
        title: insertedDoc.title,
        createdAt: insertedDoc.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload Error!!!", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
