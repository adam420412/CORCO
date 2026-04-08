export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Image from "next/image";
import {
  Trophy,
  Flame,
  Heart,
  Star,
  BookOpen,
  Crown,
  Calendar,
  InfinityIcon,
  Shield,
} from "lucide-react";

import { getUserProgress, getUserSubscription } from "@/db/queries";
import { getCurrentUser } from "@/lib/auth";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";

function getLevel(points: number) {
  if (points >= 5000) return { level: 10, title: "Mistrz" };
  if (points >= 4000) return { level: 9, title: "Ekspert" };
  if (points >= 3000) return { level: 8, title: "Zaawansowany" };
  if (points >= 2500) return { level: 7, title: "Doswiadczony" };
  if (points >= 2000) return { level: 6, title: "Wprawny" };
  if (points >= 1500) return { level: 5, title: "Kompetentny" };
  if (points >= 1000) return { level: 4, title: "Sredniozaawansowany" };
  if (points >= 500) return { level: 3, title: "Poczatkujacy+" };
  if (points >= 100) return { level: 2, title: "Poczatkujacy" };
  return { level: 1, title: "Nowicjusz" };
}

const ROLE_LABELS: Record<string, string> = {
  student: "Uczen",
  teacher: "Nauczyciel",
  parent: "Rodzic",
};

const ProfilePage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const currentUserData = getCurrentUser();

  const [userProgress, userSubscription, currentUser] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    currentUserData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;
  const { level, title } = getLevel(userProgress.points);
  const role = (userProgress as any).role || "student";

  const firstName = (currentUser as any)?.firstName || userProgress.userName || "Uzytkownik";
  const lastName = (currentUser as any)?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const imageUrl = userProgress.userImageSrc || "/mascot.svg";

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
        <div className="w-full flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-700 mb-6">Moj profil</h1>

          {/* Avatar & Basic Info */}
          <div className="w-full bg-white rounded-xl border-2 border-slate-100 p-8 flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={imageUrl}
                fill
                alt="Avatar"
                className="rounded-full border-4 border-teal-200 object-cover"
              />
              {isPro && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-neutral-700">{fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-neutral-500">{ROLE_LABELS[role] || role}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 bg-teal-50 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-teal-700">Poziom {level}</span>
              <span className="text-teal-600 text-sm">- {title}</span>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-neutral-400">
              <Calendar className="w-3 h-3" />
              <span>Czlonek CORCO</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border-2 border-slate-100 p-5 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-2xl font-bold text-neutral-700">{userProgress.points}</span>
              <span className="text-xs text-neutral-500 mt-1">Punkty XP</span>
            </div>
            <div className="bg-white rounded-xl border-2 border-slate-100 p-5 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-neutral-700">
                {Math.floor(userProgress.points / 10)}
              </span>
              <span className="text-xs text-neutral-500 mt-1">Ukonczonych lekcji</span>
            </div>
            <div className="bg-white rounded-xl border-2 border-slate-100 p-5 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-neutral-700">0</span>
              <span className="text-xs text-neutral-500 mt-1">Seria dni</span>
            </div>
            <div className="bg-white rounded-xl border-2 border-slate-100 p-5 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-2xl font-bold text-neutral-700">
                {isPro ? (
                  <InfinityIcon className="w-7 h-7 text-rose-500" />
                ) : (
                  userProgress.hearts
                )}
              </span>
              <span className="text-xs text-neutral-500 mt-1">Serca</span>
            </div>
          </div>

          {/* Active Course */}
          <div className="w-full bg-white rounded-xl border-2 border-slate-100 p-6 mb-6">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wide mb-4">
              Aktywny kurs
            </h3>
            <div className="flex items-center gap-4">
              <Image
                src={userProgress.activeCourse.imageSrc}
                width={48}
                height={48}
                alt={userProgress.activeCourse.title}
                className="rounded-lg border"
              />
              <div>
                <p className="font-bold text-neutral-700">{userProgress.activeCourse.title}</p>
                <p className="text-sm text-neutral-500">Aktualnie uczysz sie tego przedmiotu</p>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="w-full bg-white rounded-xl border-2 border-slate-100 p-6">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wide mb-4">
              Subskrypcja
            </h3>
            {isPro ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-teal-600">CORCO Pro</p>
                  <p className="text-sm text-neutral-500">
                    Masz dostep do wszystkich funkcji platformy
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-700">Plan darmowy</p>
                    <p className="text-sm text-neutral-500">
                      Ulepsz do CORCO Pro, aby odblokowac wszystkie funkcje
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ProfilePage;
