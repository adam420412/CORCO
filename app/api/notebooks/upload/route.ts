import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { notebooks, notebookSources } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  // Extract text from PDF
  let extractedText = "";
  if (file.type === "application/pdf") {
    try {
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = (pdfParseModule as any).default || pdfParseModule;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } catch (e) {
      return NextResponse.json(
        { error: "Nie udało się odczytać PDF" },
        { status: 400 }
      );
    }
  } else {
    // For text/plain, markdown, etc.
    extractedText = buffer.toString("utf-8");
  }

  // Save source to DB
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
