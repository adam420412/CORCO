import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
      className,
    )}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-teal-600 tracking-wide">
            CORCO
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem
          label="Nauka"
          href="/learn"
          iconSrc="/learn.svg"
        />
        <SidebarItem
          label="Ranking"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem
          label="Wyzwania"
          href="/quests"
          iconSrc="/quests.svg"
        />
        <SidebarItem
          label="Sklep"
          href="/shop"
          iconSrc="/shop.svg"
        />
        <SidebarItem
          label="Wiadomości"
          href="/messages"
          iconSrc="/messages.svg"
        />
        <SidebarItem
          label="Kalendarz"
          href="/calendar"
          iconSrc="/calendar.svg"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
            J
          </div>
          <span>Jan Kowalski</span>
        </div>
      </div>
    </div>
  );
};
