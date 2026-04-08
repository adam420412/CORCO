import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  UserSearch,
  CalendarCheck,
  Video,
  Calculator,
  Globe,
  Atom,
  FlaskConical,
  PenTool,
  Leaf,
  Landmark,
  Monitor,
  ArrowRight,
  Check,
  Clock,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Wybierz przedmiot i temat",
    description:
      'Określ czego potrzebujesz - np. "Funkcje kwadratowe", "Present Perfect" czy "Optyka geometryczna".',
    icon: BookOpen,
  },
  {
    number: 2,
    title: "Wybierz nauczyciela",
    description:
      "Przeglądaj profile nauczycieli, sprawdzaj opinie i wybierz tego, który najlepiej do Ciebie pasuje.",
    icon: UserSearch,
  },
  {
    number: 3,
    title: "Zarezerwuj termin",
    description:
      "Wybierz datę i godzinę, która Ci odpowiada. Potwierdzenie otrzymasz natychmiast.",
    icon: CalendarCheck,
  },
  {
    number: 4,
    title: "Ucz się online",
    description:
      "Sesja 1-na-1 przez wideo z interaktywną tablicą i udostępnianiem ekranu.",
    icon: Video,
  },
];

const subjects = [
  { name: "Matematyka", icon: Calculator, color: "bg-blue-100 text-blue-600" },
  { name: "Angielski", icon: Globe, color: "bg-green-100 text-green-600" },
  { name: "Fizyka", icon: Atom, color: "bg-purple-100 text-purple-600" },
  {
    name: "Chemia",
    icon: FlaskConical,
    color: "bg-orange-100 text-orange-600",
  },
  { name: "Polski", icon: PenTool, color: "bg-rose-100 text-rose-600" },
  { name: "Biologia", icon: Leaf, color: "bg-emerald-100 text-emerald-600" },
  { name: "Historia", icon: Landmark, color: "bg-amber-100 text-amber-600" },
  { name: "Informatyka", icon: Monitor, color: "bg-cyan-100 text-cyan-600" },
];

const pricing = [
  {
    name: "Sesja 45 min",
    price: "60 PLN",
    note: null,
    highlighted: false,
  },
  {
    name: "Sesja 60 min",
    price: "80 PLN",
    note: null,
    highlighted: false,
  },
  {
    name: "Pakiet 5 sesji",
    price: "350 PLN",
    note: "oszczędzasz 50 PLN",
    highlighted: true,
  },
  {
    name: "Pakiet 10 sesji",
    price: "650 PLN",
    note: "oszczędzasz 150 PLN",
    highlighted: true,
  },
];

export default function KorepetycjePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-700 mb-4">
            Korepetycje <span className="text-teal-600">jednorazowe</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-[600px]">
            Potrzebujesz pomocy z konkretnym tematem? Umów się na pojedynczą
            sesję z doświadczonym nauczycielem - szybko, wygodnie i online.
          </p>
        </div>
      </section>

      {/* Jak to wyglada? */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Jak to wygląda?
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Cztery proste kroki do Twojej pierwszej lekcji
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-slate-100"
              >
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-teal-600" />
                </div>
                <div className="text-sm font-bold text-teal-600 mb-2">
                  Krok {step.number}
                </div>
                <h3 className="text-lg font-bold text-neutral-700 mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dostepne przedmioty */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Dostępne przedmioty
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Oferujemy korepetycje z najważniejszych przedmiotów szkolnych
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="flex flex-col items-center p-6 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-full ${subject.color} flex items-center justify-center mb-3`}
                >
                  <subject.icon className="w-7 h-7" />
                </div>
                <span className="font-semibold text-neutral-700 text-sm">
                  {subject.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cennik */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Cennik
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Przejrzyste ceny bez ukrytych kosztów
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[900px] mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-xl flex flex-col items-center text-center border-2 ${
                  plan.highlighted
                    ? "border-teal-500 bg-white shadow-md"
                    : "border-slate-200 bg-white"
                }`}
              >
                <Clock className="w-6 h-6 text-teal-600 mb-3" />
                <h3 className="text-sm font-semibold text-neutral-500 mb-2">
                  {plan.name}
                </h3>
                <div className="text-2xl font-extrabold text-neutral-700 mb-2">
                  {plan.price}
                </div>
                {plan.note && (
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                    {plan.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-teal-600 py-16 px-4">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center text-center">
          <GraduationCap className="w-12 h-12 text-teal-200 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Umów pierwszą lekcję
          </h2>
          <p className="text-teal-100 mb-8 max-w-[500px]">
            Wybierz przedmiot, nauczyciela i termin. Twoja pierwsza lekcja może
            odbyć się już dzisiaj.
          </p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/calendar">
              Zarezerwuj termin
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
