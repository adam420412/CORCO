"use server";

import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { notebooks, notebookSources } from "@/db/schema";
import { eq } from "drizzle-orm";

function isNotebookLMConfigured() {
  return !!(
    process.env.NOTEBOOKLM_PROJECT_NUMBER && process.env.GOOGLE_ACCESS_TOKEN
  );
}

/** Create a new notebook for teacher's course */
export async function createTeacherNotebook(title: string, courseId: number) {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  let notebookId = `local-${Date.now()}`;
  let resourceName: string | null = null;

  // If NotebookLM is configured, also create in cloud
  if (isNotebookLMConfigured()) {
    try {
      const notebooklm = await import("@/lib/notebooklm");
      const result = await notebooklm.createNotebook(title);
      notebookId = result.notebookId;
      resourceName = result.name;
    } catch (e) {
      console.error("NotebookLM create failed, using local mode:", e);
    }
  }

  const [notebook] = await db
    .insert(notebooks)
    .values({
      notebookId,
      title,
      teacherId: userId,
      courseId,
      resourceName,
    })
    .returning();

  return notebook;
}

/** Add text source to notebook */
export async function addTextToNotebook(
  notebookDbId: number,
  name: string,
  content: string
) {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  const [notebook] = await db
    .select()
    .from(notebooks)
    .where(eq(notebooks.id, notebookDbId));
  if (!notebook || notebook.teacherId !== userId) throw new Error("Unauthorized");

  let sourceId = `local-text-${Date.now()}`;

  if (isNotebookLMConfigured()) {
    try {
      const notebooklm = await import("@/lib/notebooklm");
      const result = await notebooklm.addTextSource(
        notebook.notebookId,
        name,
        content
      );
      sourceId = result.sourceId;
    } catch (e) {
      console.error("NotebookLM addTextSource failed:", e);
    }
  }

  const [source] = await db
    .insert(notebookSources)
    .values({
      notebookDbId,
      sourceId,
      sourceName: name,
      sourceType: "text",
      status: "complete",
    })
    .returning();

  return { source, extractedText: content };
}

/** Add web URL source */
export async function addWebToNotebook(
  notebookDbId: number,
  url: string,
  name: string
) {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  const [notebook] = await db
    .select()
    .from(notebooks)
    .where(eq(notebooks.id, notebookDbId));
  if (!notebook || notebook.teacherId !== userId) throw new Error("Unauthorized");

  let sourceId = `local-web-${Date.now()}`;

  if (isNotebookLMConfigured()) {
    try {
      const notebooklm = await import("@/lib/notebooklm");
      const result = await notebooklm.addWebSource(
        notebook.notebookId,
        url,
        name
      );
      sourceId = result.sourceId;
    } catch (e) {
      console.error("NotebookLM addWebSource failed:", e);
    }
  }

  const [source] = await db
    .insert(notebookSources)
    .values({
      notebookDbId,
      sourceId,
      sourceName: name,
      sourceType: "web",
      status: "complete",
    })
    .returning();

  return { source };
}

/** Get teacher's notebooks */
export async function getTeacherNotebooks() {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.notebooks.findMany({
    where: eq(notebooks.teacherId, userId),
    with: { sources: true },
    orderBy: (notebooks, { desc }) => [desc(notebooks.createdAt)],
  });
}

/** Delete a source from notebook */
export async function deleteSourceFromNotebook(
  notebookDbId: number,
  sourceDbId: number
) {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  const [notebook] = await db
    .select()
    .from(notebooks)
    .where(eq(notebooks.id, notebookDbId));
  if (!notebook || notebook.teacherId !== userId) throw new Error("Unauthorized");

  const [source] = await db
    .select()
    .from(notebookSources)
    .where(eq(notebookSources.id, sourceDbId));
  if (!source) throw new Error("Source not found");

  if (source.resourceName && isNotebookLMConfigured()) {
    try {
      const notebooklm = await import("@/lib/notebooklm");
      await notebooklm.deleteSources(notebook.notebookId, [source.resourceName]);
    } catch (e) {
      console.error("NotebookLM delete failed:", e);
    }
  }

  await db.delete(notebookSources).where(eq(notebookSources.id, sourceDbId));
}
