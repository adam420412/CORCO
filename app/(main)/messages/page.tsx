export const dynamic = "force-dynamic";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProgress } from "@/db/queries";
import { MessagesList } from "./messages-list";

const MessagesPage = async () => {
  const { userId } = await getAuth();
  if (!userId) redirect("/");

  const userProgress = await getUserProgress();
  if (!userProgress) redirect("/courses");

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700 mb-6">
        Wiadomości
      </h1>
      <MessagesList userId={userId} userRole={userProgress.role} />
    </div>
  );
};

export default MessagesPage;
