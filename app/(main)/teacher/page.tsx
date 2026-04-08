export const dynamic = "force-dynamic";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProgress } from "@/db/queries";
import { TeacherDashboard } from "./teacher-dashboard";

const TeacherPage = async () => {
  const { userId } = await getAuth();
  if (!userId) redirect("/");

  const userProgress = await getUserProgress();
  if (!userProgress || userProgress.role !== "teacher") {
    redirect("/learn");
  }

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700 mb-6">
        Panel nauczyciela
      </h1>
      <TeacherDashboard teacherId={userId} />
    </div>
  );
};

export default TeacherPage;
