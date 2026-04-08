import { getAuth } from "@/lib/auth";

const adminIds = [
  "user_2dGb6YEarBAQHrNYoB5dMtISRWK",
  "test-user-001",
];

export const isAdmin = async () => {
  const { userId } = await getAuth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
