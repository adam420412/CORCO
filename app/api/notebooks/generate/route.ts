import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { challenges, challengeOptions, notebooks, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateExercises } from "@/lib/generate-exercises";

export async function POST(req: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { notebookDbId, sourceText, count = 10, lessonId } = body;

  if (!sourceText) {
    return NextResponse.json(
      { error: "Missing sourceText" },
      { status: 400 }
    );
  }

  // Verify teacher owns this notebook (if notebookDbId provided)
  if (notebookDbId) {
    const [notebook] = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.id, notebookDbId));

    if (!notebook || notebook.teacherId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  try {
    const generated = await generateExercises(sourceText, count);

    // If lessonId provided, save challenges to DB
    if (lessonId) {
      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, lessonId));

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      // Get max order in this lesson
      const existingChallenges = await db
        .select()
        .from(challenges)
        .where(eq(challenges.lessonId, lessonId));
      let order = existingChallenges.length + 1;

      const savedChallenges: any[] = [];

      for (const ex of generated) {
        const [challenge] = await db
          .insert(challenges)
          .values({
            lessonId,
            type: ex.type,
            question: ex.question,
            order: order++,
            correctAnswer: ex.correctAnswer || null,
            matchPairs: ex.matchPairs ? JSON.stringify(ex.matchPairs) : null,
            flashcardBack: ex.flashcardBack || null,
          })
          .returning();

        // For SELECT type, insert options
        if (ex.type === "SELECT" && ex.options) {
          for (const opt of ex.options) {
            await db.insert(challengeOptions).values({
              challengeId: challenge.id,
              text: opt.text,
              correct: opt.correct,
            });
          }
        }

        savedChallenges.push(challenge);
      }

      return NextResponse.json({
        generated,
        saved: true,
        savedCount: savedChallenges.length,
        lessonId,
      });
    }

    // Just return generated exercises (preview mode)
    return NextResponse.json({
      generated,
      saved: false,
      count: generated.length,
    });
  } catch (e: any) {
    console.error("Generate exercises error:", e);
    return NextResponse.json(
      { error: e.message || "Błąd generowania ćwiczeń" },
      { status: 500 }
    );
  }
}
