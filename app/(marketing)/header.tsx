import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-teal-600 tracking-wide">
            CORCO
          </h1>
        </div>
        <nav className="hidden lg:flex items-center gap-x-6">
          <Link
            href="/oferta"
            className="text-sm font-medium text-neutral-600 hover:text-teal-600 transition"
          >
            Oferta
          </Link>
          <Link
            href="/oferta/korepetycje"
            className="text-sm font-medium text-neutral-600 hover:text-teal-600 transition"
          >
            Korepetycje
          </Link>
          <Link
            href="/oferta/ai"
            className="text-sm font-medium text-neutral-600 hover:text-teal-600 transition"
          >
            AI
          </Link>
        </nav>
        <Button size="lg" variant="ghost" asChild>
          <Link href="/learn">
            Zaloguj się
          </Link>
        </Button>
      </div>
    </header>
  );
};
