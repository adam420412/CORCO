export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { getTeacherNotebooks } from "@/actions/notebooks";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { BookOpen, Plus, FileText, Globe, File } from "lucide-react";

const sourceTypeIcon: Record<string, typeof FileText> = {
  text: FileText,
  web: Globe,
  file: File,
};

const NotebooksPage = async () => {
  const { userId } = await getAuth();
  if (!userId) redirect("/");

  const userProgress = await getUserProgress();
  if (!userProgress || userProgress.role !== "teacher") {
    redirect("/learn");
  }

  const userSubscription = await getUserSubscription();
  const isPro = !!userSubscription?.isActive;

  const notebooks = await getTeacherNotebooks();

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-700">
              Baza wiedzy (NotebookLM)
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Dodawaj materialy, a AI przeksztalci je w zadania dla uczniow
            </p>
          </div>
          <Link
            href="/teacher/notebooks/new"
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nowy notebook
          </Link>
        </div>

        {notebooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-16 h-16 text-neutral-300 mb-4" />
            <h2 className="text-lg font-semibold text-neutral-500">
              Brak notebookow
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              Stworz pierwszy notebook, aby dodac materialy dydaktyczne
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notebooks.map((notebook) => (
              <div
                key={notebook.id}
                className="bg-white border-2 border-neutral-200 rounded-xl p-5 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-700">
                      {notebook.title}
                    </h3>
                    {notebook.courseId && (
                      <p className="text-sm text-neutral-400 mt-0.5">
                        Kurs ID: {notebook.courseId}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400">
                    {notebook.createdAt
                      ? new Date(notebook.createdAt).toLocaleDateString("pl-PL")
                      : ""}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-neutral-500">
                    {notebook.sources.length}{" "}
                    {notebook.sources.length === 1 ? "zrodlo" : "zrodel"}
                  </span>
                  <div className="flex gap-1">
                    {notebook.sources.slice(0, 5).map((source) => {
                      const Icon = sourceTypeIcon[source.sourceType] || File;
                      return (
                        <span key={source.id} title={source.sourceName}>
                          <Icon className="w-4 h-4 text-neutral-400" />
                        </span>
                      );
                    })}
                    {notebook.sources.length > 5 && (
                      <span className="text-xs text-neutral-400 ml-1">
                        +{notebook.sources.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </FeedWrapper>
    </div>
  );
};

export default NotebooksPage;
