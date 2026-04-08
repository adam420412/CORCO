import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { notebooks, notebookSources } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as notebooklm from "@/lib/notebooklm";

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
  const result = await notebooklm.uploadFileSource(
    notebook.notebookId,
    file.name,
    buffer,
    file.type
  );

  const [source] = await db
    .insert(notebookSources)
    .values({
      notebookDbId,
      sourceId: result.sourceId,
      sourceName: file.name,
      sourceType: "file",
      status: "processing",
    })
    .returning();

  return NextResponse.json(source);
}
