import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  GraduationCap,
  Gamepad2,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const services = [
  {
    title: "Korepetycje jednorazowe",
    description:
      "Potrzebujesz pomocy z konkretnym tematem? Umów się na jednorazowe korepetycje z doświadczonym nauczycielem.",
    icon: GraduationCap,
    href: "/oferta/korepetycje",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Platforma do nauki",
    description:
      "Ucz się przez grywalizację. Ćwicz zadania, zdobywaj punkty XP i śledź swoje postępy.",
    icon: Gamepad2,
    href: "/learn",
    color: "bg-teal-100 text-teal-600",
  },
  {
    title: "AI - Inteligentny system nauki",
    description:
      "Nauczyciel dostarcza materiały, a nasz system AI przekształca je w spersonalizowane zadania i wyzwania dla ucznia.",
    icon: Brain,
    href: "/oferta/ai",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function OfertaPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-700 mb-4">
            Nasza <span className="text-teal-600">oferta</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-[600px]">
            Odkryj wszystkie możliwości platformy CORCO
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group flex flex-col p-8 rounded-xl bg-white shadow-sm border-2 border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-full ${service.color} flex items-center justify-center mb-5`}
                >
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-neutral-700 mb-3">
                  {service.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed flex-1">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-teal-600 font-semibold text-sm group-hover:gap-2 transition-all gap-1">
                  Dowiedz się więcej
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-teal-600 py-16 px-4">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Nie wiesz, co wybrać?
          </h2>
          <p className="text-teal-100 mb-8 max-w-[500px]">
            Skontaktuj się z nami, a pomożemy dobrać najlepszą opcję nauki dla
            Ciebie lub Twojego dziecka.
          </p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/learn">
              Zacznij za darmo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
