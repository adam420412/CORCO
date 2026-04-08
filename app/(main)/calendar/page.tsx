import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProgress } from "@/db/queries";
import { CalendarView } from "./calendar-view";

const CalendarPage = async () => {
  const { userId } = await getAuth();
  if (!userId) redirect("/");

  const userProgress = await getUserProgress();
  if (!userProgress) redirect("/courses");

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700 mb-6">
        Kalendarz zajęć
      </h1>
      <CalendarView
        userId={userId}
        userRole={userProgress.role}
      />
    </div>
  );
};

export default CalendarPage;
