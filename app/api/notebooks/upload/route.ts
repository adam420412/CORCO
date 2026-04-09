import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { notebooks, notebookSources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAMES = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const base64 = buffer.toString("base64");

  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64,
          },
        },
        "Wyodrębnij cały tekst z tego dokumentu PDF. Zwróć TYLKO czysty tekst z dokumentu, bez żadnych komentarzy ani formatowania. Zachowaj oryginalny język dokumentu.",
      ]);
      return result.response.text();
    } catch (e: any) {
      if (e.message?.includes("429") && modelName !== MODEL_NAMES[MODEL_NAMES.length - 1]) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw e;
    }
  }

  throw new Error("Wszystkie modele Gemini są chwilowo niedostępne. Spróbuj za minutę.");
}

export async function POST(req: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const notebookDbId = parseInt(formData.get("notebookDbId") as string);

  if (!file || !notebookDbId) {
    return NextResponse.json(
      { error: "Missing file or notebookDbId" },
      { status: 400 }
    );
  }

  const [notebook] = await db
    .select()
    .from(notebooks)
    .where(eq(notebooks.id, notebookDbId));

  if (!notebook || notebook.teacherId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let extractedText = "";
  try {
    if (file.type === "application/pdf") {
      extractedText = await extractTextFromPDF(buffer);
    } else {
      extractedText = buffer.toString("utf-8");
    }
  } catch (e: any) {
    console.error("Text extraction error:", e);
    return NextResponse.json(
      { error: `Nie udało się odczytać pliku: ${e.message}` },
      { status: 400 }
    );
  }

  const sourceId = `local-${Date.now()}`;
  const [source] = await db
    .insert(notebookSources)
    .values({
      notebookDbId,
      sourceId,
      sourceName: file.name,
      sourceType: "file",
      resourceName: null,
      status: "complete",
    })
    .returning();

  return NextResponse.json({
    source,
    extractedText,
    textLength: extractedText.length,
  });
}
