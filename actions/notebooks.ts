"use server";

import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { notebooks, notebookSources } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as notebooklm from "@/lib/notebooklm";

/** Create a new notebook for teacher's course */
export async function createTeacherNotebook(title: string, courseId: number) {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  const result = await notebooklm.createNotebook(title);

  const [notebook] = await db
    .insert(notebooks)
    .values({
      notebookId: result.notebookId,
      title,
      teacherId: userId,
      courseId,
      resourceName: result.name,
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

  const result = await notebooklm.addTextSource(notebook.notebookId, name, content);

  const [source] = await db
    .insert(notebookSources)
    .values({
      notebookDbId,
      sourceId: result.sourceId,
      sourceName: name,
      sourceType: "text",
      status: "complete",
    })
    .returning();

  return source;
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

  const result = await notebooklm.addWebSource(notebook.notebookId, url, name);

  const [source] = await db
    .insert(notebookSources)
    .values({
      notebookDbId,
      sourceId: result.sourceId,
      sourceName: name,
      sourceType: "web",
      status: "complete",
    })
    .returning();

  return source;
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

  if (source.resourceName) {
    await notebooklm.deleteSources(notebook.notebookId, [source.resourceName]);
  }

  await db.delete(notebookSources).where(eq(notebookSources.id, sourceDbId));
}
