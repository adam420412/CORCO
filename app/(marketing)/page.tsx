import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Gamepad2,
  BarChart3,
  GraduationCap,
  Users,
  Heart,
  Check,
  X,
  ArrowRight,
  Star,
  Trophy,
  Zap,
  Calculator,
  Globe,
  Atom,
  FlaskConical,
  PenTool,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center px-4 py-16 gap-8">
        <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
          <Image src="/hero.svg" fill alt="Hero" />
        </div>
        <div className="flex flex-col items-center lg:items-start gap-y-6">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-neutral-700 max-w-[480px] text-center lg:text-left leading-tight">
            Ucz sie efektywnie z{" "}
            <span className="text-teal-600">CORCO</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-[400px] text-center lg:text-left">
            Korepetycje z grywalizacja. Zdobywaj punkty, rywalizuj z innymi i osiagaj lepsze wyniki w nauce.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[400px]">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8" asChild>
              <Link href="/learn">
                Zacznij za darmo
              </Link>
            </Button>
            <Button size="lg" variant="primaryOutline" className="w-full sm:w-auto px-8" asChild>
              <Link href="/learn">
                Mam juz konto
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Jak to dziala? */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Jak to dziala?
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Trzy proste kroki do lepszych wynikow w nauce
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-sm font-bold text-teal-600 mb-2">Krok 1</div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">Wybierz przedmiot</h3>
              <p className="text-neutral-500 text-sm">
                Wybierz przedmiot, ktory chcesz cwiczyce i dostosuj poziom do swoich potrzeb.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <Gamepad2 className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-sm font-bold text-teal-600 mb-2">Krok 2</div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">Cwicz z grywalizacja</h3>
              <p className="text-neutral-500 text-sm">
                Rozwiazuj zadania, zdobywaj punkty XP i rywalizuj w rankingach z innymi uczniami.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-sm font-bold text-teal-600 mb-2">Krok 3</div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">Sledz postepy</h3>
              <p className="text-neutral-500 text-sm">
                Monitoruj swoje wyniki, analizuj statystyki i obserwuj jak sie rozwijasz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dla kogo jest CORCO? */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Dla kogo jest CORCO?
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Platforma stworzona z mysla o kazdym uczestniku procesu edukacji
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border-2 border-slate-100 hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-3">Dla ucznia</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Ucz sie przez zabaw. Zdobywaj punkty, odblokowuj osiagniecia i rywalizuj ze znajomymi. Nauka jeszcze nigdy nie byla tak wciagajaca.
              </p>
            </div>
            <div className="p-8 rounded-xl border-2 border-slate-100 hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-3">Dla nauczyciela</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Monitoruj postepy uczniow, zadawaj zadania i komunikuj sie z nimi przez platforme. Wszystko w jednym miejscu.
              </p>
            </div>
            <div className="p-8 rounded-xl border-2 border-slate-100 hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-3">Dla rodzica</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Badz na biezaco z postepami swojego dziecka. Sprawdzaj statystyki i wspieraj je w nauce na kazdym kroku.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Przedmioty */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Przedmioty
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Wybierz przedmiot i zacznij nauke juz dzisiaj
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: "Matematyka", icon: Calculator, color: "bg-blue-100 text-blue-600" },
              { name: "Angielski", icon: Globe, color: "bg-green-100 text-green-600" },
              { name: "Fizyka", icon: Atom, color: "bg-purple-100 text-purple-600" },
              { name: "Chemia", icon: FlaskConical, color: "bg-orange-100 text-orange-600" },
              { name: "Polski", icon: PenTool, color: "bg-rose-100 text-rose-600" },
            ].map((subject) => (
              <div
                key={subject.name}
                className="flex flex-col items-center p-6 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full ${subject.color} flex items-center justify-center mb-3`}>
                  <subject.icon className="w-7 h-7" />
                </div>
                <span className="font-semibold text-neutral-700 text-sm">{subject.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cennik */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Cennik
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Zacznij za darmo lub odblokuj pelne mozliwosci z CORCO Pro
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {/* Free */}
            <div className="p-8 rounded-xl border-2 border-slate-200 flex flex-col">
              <h3 className="text-xl font-bold text-neutral-700 mb-1">Darmowy</h3>
              <div className="text-3xl font-extrabold text-neutral-700 mb-6">
                0 PLN
                <span className="text-sm font-normal text-neutral-500"> / na zawsze</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  5 serc dziennie
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Podstawowe cwiczenia
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Ranking
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-400">
                  <X className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                  Wszystkie tryby cwiczen
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-400">
                  <X className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                  Szczegolowe statystyki
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-400">
                  <X className="w-5 h-5 text-neutral-300 flex-shrink-0" />
                  Priorytetowe wsparcie
                </li>
              </ul>
              <Button size="lg" variant="primaryOutline" className="w-full" asChild>
                <Link href="/learn">
                  Zacznij za darmo
                </Link>
              </Button>
            </div>
            {/* Pro */}
            <div className="p-8 rounded-xl border-2 border-teal-500 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                POPULARNE
              </div>
              <h3 className="text-xl font-bold text-teal-600 mb-1">CORCO Pro</h3>
              <div className="text-3xl font-extrabold text-neutral-700 mb-6">
                29 PLN
                <span className="text-sm font-normal text-neutral-500"> / miesiecznie</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Nielimitowane serca
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Wszystkie tryby cwiczen
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Ranking
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Szczegolowe statystyki
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Priorytetowe wsparcie
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Brak reklam
                </li>
              </ul>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn">
                  Wyprobuj CORCO Pro
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-teal-600 py-16 px-4">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center text-center">
          <Zap className="w-12 h-12 text-teal-200 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Zacznij nauke za darmo
          </h2>
          <p className="text-teal-100 mb-8 max-w-[500px]">
            Dolacz do tysiecy uczniow, ktorzy juz ucza sie z CORCO. Bez karty kredytowej, bez zobowiazan.
          </p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/learn">
              Rozpocznij nauke
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
