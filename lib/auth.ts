import { cache } from "react";

const MOCK_USER_ID = "test-user-001";
const MOCK_USER = {
  id: MOCK_USER_ID,
  firstName: "Jan",
  lastName: "Kowalski",
  imageUrl: "/mascot.svg",
  emailAddresses: [{ emailAddress: "jan@corco.pl" }],
};

function isClerkConfigured() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return key.startsWith("pk_");
}

export async function getAuth(): Promise<{ userId: string | null }> {
  if (!isClerkConfigured()) {
    return { userId: MOCK_USER_ID };
  }
  const { auth } = await import("@clerk/nextjs");
  return auth();
}

export async function getCurrentUser() {
  if (!isClerkConfigured()) {
    return MOCK_USER;
  }
  const { currentUser } = await import("@clerk/nextjs");
  return currentUser();
}
