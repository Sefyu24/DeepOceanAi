import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { docChunks, researchDocs } from "@/utils/schema";
import { auth } from "@/utils/auth";
import { splitMarkdown } from "@/lib/splitMD";
import { createEmbeddings } from "@/lib/embeddings";

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

    // now separate document in multiple chunks and add them to doc_chunks table

    const docId = insertedDoc.id;
    const chunks = splitMarkdown(insertedDoc.content);
    //prepare the embedding using OpenAi
    const textToEmbed = chunks.map((chunk) => chunk.text);
    const embeddings = await createEmbeddings(textToEmbed);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const resultChunks = await db
        .insert(docChunks)
        .values({
          docId: docId,
          content: chunk.text,
          tokens: chunk.tokens,
          idx: i,
          embedding: embeddings[i],
          chunkType: chunk.type,
        })
        .returning();

      console.log("Results of chunk insert", resultChunks);
    }

    return NextResponse.json({
      success: true,
      message: "Document was uploaded!, and chunks were created",
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
