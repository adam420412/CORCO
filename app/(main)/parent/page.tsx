export const dynamic = "force-dynamic";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProgress } from "@/db/queries";
import { ParentDashboard } from "./parent-dashboard";

const ParentPage = async () => {
  const { userId } = await getAuth();
  if (!userId) redirect("/");

  const userProgress = await getUserProgress();
  if (!userProgress || userProgress.role !== "parent") {
    redirect("/learn");
  }

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700 mb-6">
        Panel rodzica
      </h1>
      <ParentDashboard parentId={userId} />
    </div>
  );
};

export default ParentPage;
