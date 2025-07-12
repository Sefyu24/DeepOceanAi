import { get_encoding } from "tiktoken";

// text-embedding-3-small uses cl100k_base
const enc = get_encoding("cl100k_base");

interface Chunk {
  text: string;
  start: number;
  tokens: number;
  type: "header" | "paragraph" | "code" | "list" | "text";
}

export function splitMarkdown(
  md: string,
  maxTokens = 800,
  overlap = 80
): Chunk[] {
  const chunks: Chunk[] = [];

  // Split by markdown sections first
  const sections = splitByMarkdownStructure(md);

  for (const section of sections) {
    const sectionTokens = enc.encode(section.text);

    if (sectionTokens.length <= maxTokens) {
      // Section fits in one chunk
      chunks.push({
        text: section.text,
        start: section.start,
        tokens: sectionTokens.length,
        type: section.type,
      });
    } else {
      // Section is too large, split by tokens with overlap
      const tokenChunks = splitByTokens(section.text, maxTokens, overlap);
      chunks.push(
        ...tokenChunks.map((chunk) => ({
          text: chunk.text,
          start: section.start + chunk.start,
          tokens: chunk.tokens,
          type: section.type,
        }))
      );
    }
  }

  return chunks;
}

function splitByMarkdownStructure(
  md: string
): Array<{ text: string; start: number; type: Chunk["type"] }> {
  const sections: Array<{ text: string; start: number; type: Chunk["type"] }> =
    [];
  const lines = md.split("\n");
  let currentSection = "";
  let currentType: Chunk["type"] = "text";
  let sectionStart = 0;
  let currentStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineStart = currentStart;
    currentStart += line.length + 1;

    // Detect section boundaries
    const isHeader = /^#{1,6}\s/.test(line);
    const isCodeBlock = /^```/.test(line);
    const isList = /^[\s]*[-*+]\s|^\d+\.\s/.test(line);
    const isEmptyLine = line.trim() === "";

    let newType: Chunk["type"] = "text";
    if (isHeader) newType = "header";
    else if (isCodeBlock) newType = "code";
    else if (isList) newType = "list";
    else if (!isEmptyLine && line.trim()) newType = "paragraph";

    // Start new section on headers or significant type changes
    if (
      (isHeader ||
        (newType !== currentType &&
          newType !== "text" &&
          currentSection.trim())) &&
      currentSection.trim()
    ) {
      sections.push({
        text: currentSection.trim(),
        start: sectionStart,
        type: currentType,
      });
      currentSection = line + "\n";
      currentType = newType;
      sectionStart = lineStart;
    } else {
      currentSection += line + "\n";
      if (newType !== "text") currentType = newType;
    }
  }

  // Add final section
  if (currentSection.trim()) {
    sections.push({
      text: currentSection.trim(),
      start: sectionStart,
      type: currentType,
    });
  }

  return sections;
}

function splitByTokens(
  text: string,
  maxTokens: number,
  overlap: number
): Array<{ text: string; start: number; tokens: number }> {
  const tokens = enc.encode(text);
  const chunks: Array<{ text: string; start: number; tokens: number }> = [];

  for (let i = 0; i < tokens.length; i += maxTokens - overlap) {
    const slice = tokens.slice(i, i + maxTokens);
    chunks.push({
      text: new TextDecoder().decode(enc.decode(slice)),
      start: i,
      tokens: slice.length,
    });
  }

  return chunks;
}
