"use server";

import { getAuth } from "@/lib/auth";
import db from "@/db/drizzle";
import { messages } from "@/db/schema";
import { eq, or, and, desc } from "drizzle-orm";

export const sendMessage = async (receiverId: string, content: string) => {
  const { userId } = await getAuth();
  if (!userId) throw new Error("Unauthorized");

  await db.insert(messages).values({
    senderId: userId,
    receiverId,
    content,
  });
};

export const getConversations = async () => {
  const { userId } = await getAuth();
  if (!userId) return [];

  const data = await db.query.messages.findMany({
    where: or(
      eq(messages.senderId, userId),
      eq(messages.receiverId, userId),
    ),
    orderBy: [desc(messages.createdAt)],
  });

  return data;
};

export const getMessages = async (otherUserId: string) => {
  const { userId } = await getAuth();
  if (!userId) return [];

  const data = await db.query.messages.findMany({
    where: or(
      and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
      and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId)),
    ),
    orderBy: [desc(messages.createdAt)],
  });

  return data;
};
