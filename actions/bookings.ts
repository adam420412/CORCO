"use server";

import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { bookings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type CreateBookingInput = {
  title: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  description?: string;
};

export const createBooking = async (input: CreateBookingInput) => {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(bookings).values({
    studentId: userId,
    teacherId: input.teacherId || userId,
    title: input.title,
    description: input.description,
    startTime: new Date(input.startTime),
    endTime: new Date(input.endTime),
    status: "pending",
  });

  revalidatePath("/calendar");
};

export const confirmBooking = async (bookingId: number) => {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  await db.update(bookings)
    .set({ status: "confirmed" })
    .where(and(
      eq(bookings.id, bookingId),
      eq(bookings.teacherId, userId),
    ));

  revalidatePath("/calendar");
};

export const cancelBooking = async (bookingId: number) => {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  await db.update(bookings)
    .set({ status: "cancelled" })
    .where(eq(bookings.id, bookingId));

  revalidatePath("/calendar");
};

export const getBookings = async () => {
  const { userId } = await getAuth();
  if (!userId) return [];

  const data = await db.query.bookings.findMany({
    where: eq(bookings.studentId, userId),
  });

  return data;
};
