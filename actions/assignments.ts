"use server";

import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { studentAssignments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type AssignLessonInput = {
  studentId: string;
  lessonId: number;
  note?: string;
  dueDate?: string;
};

export const assignLesson = async (input: AssignLessonInput) => {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(studentAssignments).values({
    teacherId: userId,
    studentId: input.studentId,
    lessonId: input.lessonId,
    note: input.note,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  });

  revalidatePath("/teacher");
};

export const getStudentAssignments = async () => {
  const { userId } = await getAuth();
  if (!userId) return [];

  const data = await db.query.studentAssignments.findMany({
    where: eq(studentAssignments.studentId, userId),
    with: {
      lesson: true,
    },
  });

  return data;
};

export const getTeacherAssignments = async () => {
  const { userId } = await getAuth();
  if (!userId) return [];

  const data = await db.query.studentAssignments.findMany({
    where: eq(studentAssignments.teacherId, userId),
    with: {
      lesson: true,
      student: true,
    },
  });

  return data;
};
