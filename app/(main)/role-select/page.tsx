import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProgress } from "@/db/queries";
import { RoleSelector } from "./role-selector";

const RoleSelectPage = async () => {
  const { userId } = await getAuth();
  if (!userId) redirect("/");

  const userProgress = await getUserProgress();

  // If user already has progress, go to learn
  if (userProgress?.activeCourseId) {
    redirect("/learn");
  }

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-neutral-700 mb-2">
        Witaj w CORCO!
      </h1>
      <p className="text-muted-foreground mb-8">
        Wybierz swoją rolę aby kontynuować
      </p>
      <RoleSelector />
    </div>
  );
};

export default RoleSelectPage;
