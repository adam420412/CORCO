import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Brain,
  Upload,
  Cpu,
  UserCheck,
  Sparkles,
  BarChart3,
  RefreshCw,
  Target,
  ArrowRight,
  FileText,
  Layers,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const aiSteps = [
  {
    number: 1,
    title: "Korepetytor dostarcza materiały",
    description:
      "Notatki z lekcji, podręczniki, własne zadania, prezentacje. Wszystko trafia do NotebookLM.",
    icon: Upload,
    items: [
      "Notatki z lekcji",
      "Podręczniki i skrypty",
      "Własne zadania",
      "Prezentacje",
    ],
  },
  {
    number: 2,
    title: "AI analizuje i tworzy",
    description:
      "System przetwarza materiały i automatycznie generuje zestawy ćwiczeń dopasowane do treści.",
    icon: Cpu,
    items: [
      "Ćwiczenia FILL_IN",
      "Zadania MATCH",
      "Fiszki FLASHCARD",
      "Quizy SELECT",
    ],
  },
  {
    number: 3,
    title: "Uczeń otrzymuje spersonalizowaną ścieżkę",
    description:
      "Zadania dopasowane do poziomu, automatyczne powtórki słabych obszarów, progres dostosowany do tempa ucznia.",
    icon: UserCheck,
    items: [
      "Dopasowany poziom trudności",
      "Automatyczne powtórki",
      "Indywidualne tempo",
    ],
  },
];

const features = [
  {
    title: "Automatyczna generacja zadań",
    description:
      "System tworzy ćwiczenia bezpośrednio z materiałów dostarczonych przez nauczyciela. Żadne ręczne wpisywanie nie jest potrzebne.",
    icon: Sparkles,
  },
  {
    title: "Adaptacyjny poziom trudności",
    description:
      "AI dostosowuje trudność zadań w czasie rzeczywistym na podstawie odpowiedzi ucznia. Nauka zawsze na optymalnym poziomie.",
    icon: Target,
  },
  {
    title: "Analiza słabych punktów",
    description:
      "System automatycznie identyfikuje tematy wymagające powtórki i generuje dodatkowe ćwiczenia w tych obszarach.",
    icon: RefreshCw,
  },
  {
    title: "Raporty postępów",
    description:
      "Szczegółowe statystyki i raporty dla nauczyciela i rodzica. Pełna przejrzystość procesu nauki.",
    icon: BarChart3,
  },
];

export default function AIPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-700 mb-4">
            Inteligentny system{" "}
            <span className="text-teal-600">nauki</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-[650px]">
            Łączymy wiedzę korepetytora z mocą AI, aby stworzyć idealną ścieżkę
            nauki dla każdego ucznia.
          </p>
        </div>
      </section>

      {/* Jak dziala nasz AI? */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Jak działa nasz AI?
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Trzy etapy od materiałów nauczyciela do spersonalizowanej nauki
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {aiSteps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col p-8 rounded-xl bg-white shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="text-sm font-bold text-teal-600">
                    Etap {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-700 mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-sm mb-5 leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-2 mt-auto">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-neutral-600"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Co wyroznia nasz system? */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-700 mb-4">
            Co wyróżnia nasz system?
          </h2>
          <p className="text-neutral-500 text-center mb-12 max-w-[600px] mx-auto">
            Funkcje, które czynią naszą platformę wyjątkową
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-5 p-6 rounded-xl border-2 border-slate-100 hover:border-teal-200 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-700 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dla nauczycieli */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-[900px] mx-auto">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-700 mb-4">
                Dla nauczycieli
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-6">
                Oszczędzaj czas na przygotowywaniu materiałów. Wgraj swoje
                notatki, a AI przygotuje gotowe zestawy ćwiczeń dla Twoich
                uczniów.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-neutral-600">
                  <FileText className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Wgraj materiały w dowolnym formacie
                </li>
                <li className="flex items-center gap-3 text-sm text-neutral-600">
                  <Layers className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  AI wygeneruje ćwiczenia automatycznie
                </li>
                <li className="flex items-center gap-3 text-sm text-neutral-600">
                  <TrendingUp className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  Śledź postępy każdego ucznia
                </li>
              </ul>
              <Button size="lg" variant="secondary" className="px-8" asChild>
                <Link href="/role-select">
                  Dołącz jako nauczyciel
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="flex-shrink-0">
              <div className="w-[280px] h-[280px] rounded-2xl bg-gradient-to-br from-teal-100 to-purple-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Brain className="w-16 h-16 text-teal-600" />
                  <Zap className="w-8 h-8 text-purple-500" />
                  <span className="text-sm font-bold text-neutral-500">
                    AI + Nauczyciel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologia */}
      <section className="w-full py-20 px-4">
        <div className="max-w-screen-lg mx-auto">
          <div className="p-8 lg:p-12 rounded-xl border-2 border-slate-100 max-w-[800px] mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-5">
              <Cpu className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-sm font-bold text-purple-600 mb-2">
              Technologia
            </div>
            <h2 className="text-2xl font-bold text-neutral-700 mb-4">
              Powered by NotebookLM
            </h2>
            <p className="text-neutral-500 leading-relaxed max-w-[600px] mx-auto">
              Nasz system oparty jest na NotebookLM - technologii AI od Google
              stworzonej do analizowania dokumentów i generowania treści
              edukacyjnych. Dzięki temu materiały nauczyciela są przetwarzane z
              najwyższą jakością, a generowane ćwiczenia dokładnie odpowiadają
              omawianym tematom.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-teal-600 py-16 px-4">
        <div className="max-w-screen-lg mx-auto flex flex-col items-center text-center">
          <Brain className="w-12 h-12 text-teal-200 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Rozpocznij naukę z AI
          </h2>
          <p className="text-teal-100 mb-8 max-w-[500px]">
            Dołącz do platformy CORCO i przekonaj się, jak sztuczna
            inteligencja może zmienić sposób, w jaki się uczysz.
          </p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/learn">
              Wypróbuj za darmo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
