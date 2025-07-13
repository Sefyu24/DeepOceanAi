import { NextResponse, NextRequest } from "next/server";
import { db } from "@/utils/db";
import { createEmbeddings } from "@/lib/embeddings";
import { auth } from "@/utils/auth";
import { docChunks, researchDocs } from "@/utils/schema";
import { sql, eq } from "drizzle-orm";
import { OpenAI } from "openai";

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json(
        {
          error: "User not authenticated",
        },
        { status: 401 }
      );
    }

    const { message } = await request.json();

    // we pass the message to create an embedding
    const embeddedMessage = await createEmbeddings([message]);
    const queryEmbedding = embeddedMessage[0]; // Get first embedding from array

    // we now need to fetch the top 4 chunks closest related to the message embedding

    const similarChunks = await db
      .select({
        id: docChunks.id,
        content: docChunks.content,
        chunkType: docChunks.chunkType,
        tokens: docChunks.tokens,
        docTitle: researchDocs.title,
        distance: sql<number>`${docChunks.embedding} <=> ${JSON.stringify(
          queryEmbedding
        )}`,
      })
      .from(docChunks)
      .innerJoin(researchDocs, eq(docChunks.docId, researchDocs.id))
      .where(eq(researchDocs.userId, session.user.id))
      .orderBy(
        sql`${docChunks.embedding} <=> ${JSON.stringify(queryEmbedding)}`
      )
      .limit(20);

    // Log the selected chunks for debugging
    console.log("=== TOP 20 SELECTED CHUNKS ===");
    console.log(`Found ${similarChunks.length} chunks for query: "${message}"`);
    similarChunks.forEach((chunk, index) => {
      console.log(`\n--- Chunk ${index + 1} ---`);
      console.log(`Document: ${chunk.docTitle}`);
      console.log(`Type: ${chunk.chunkType}`);
      console.log(`Distance: ${chunk.distance}`);
      console.log(`Tokens: ${chunk.tokens}`);
      console.log(`Content preview: ${chunk.content.slice(0, 150)}...`);
    });
    console.log("=== END CHUNKS ===\n");

    const context = similarChunks
      .map((chunk) => `Document: ${chunk.docTitle}\nContent: ${chunk.content}`)
      .join("\n\n---\n\n");

    // 4. Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a research assistant. Answer based on this context:

            ${context}

            If the context doesn't contain relevant information, say so clearly.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response at this time.";

    return NextResponse.json({
      message: aiResponse,
      sources: similarChunks.map((chunk) => ({
        document: chunk.docTitle,
        type: chunk.chunkType,
        distance: chunk.distance,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
