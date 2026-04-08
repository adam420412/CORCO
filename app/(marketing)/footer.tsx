import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-slate-200 px-4 py-10">
      <div className="max-w-screen-lg mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo + description */}
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <Image src="/mascot.svg" height={32} width={32} alt="Mascot" />
              <span className="text-xl font-extrabold text-teal-600 tracking-wide">
                CORCO
              </span>
            </div>
            <p className="text-sm text-neutral-500">
              Platforma do nauki z grywalizacją
            </p>
          </div>

          {/* Column 2: Oferta */}
          <div className="flex flex-col gap-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Oferta</h3>
            <Link
              href="/oferta/korepetycje"
              className="text-sm text-neutral-500 hover:text-teal-600 transition"
            >
              Korepetycje jednorazowe
            </Link>
            <Link
              href="/oferta"
              className="text-sm text-neutral-500 hover:text-teal-600 transition"
            >
              Platforma
            </Link>
            <Link
              href="/oferta/ai"
              className="text-sm text-neutral-500 hover:text-teal-600 transition"
            >
              AI System
            </Link>
          </div>

          {/* Column 3: Informacje */}
          <div className="flex flex-col gap-y-3">
            <h3 className="text-sm font-semibold text-slate-800">Informacje</h3>
            <Link
              href="#"
              className="text-sm text-neutral-500 hover:text-teal-600 transition"
            >
              Kontakt
            </Link>
            <Link
              href="#"
              className="text-sm text-neutral-500 hover:text-teal-600 transition"
            >
              Regulamin
            </Link>
            <Link
              href="#"
              className="text-sm text-neutral-500 hover:text-teal-600 transition"
            >
              Polityka prywatności
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-neutral-400">
            &copy; 2024 CORCO. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};
