import { GoogleGenerativeAI } from "@google/generative-ai";

export type GeneratedChallenge = {
  type: "SELECT" | "FILL_IN" | "MATCH" | "FLASHCARD";
  question: string;
  // For SELECT
  options?: { text: string; correct: boolean }[];
  // For FILL_IN
  correctAnswer?: string;
  // For MATCH
  matchPairs?: { left: string; right: string }[];
  // For FLASHCARD
  flashcardBack?: string;
};

const SYSTEM_PROMPT = `Jesteś asystentem edukacyjnym platformy CORCO. Na podstawie podanego materiału dydaktycznego generujesz ćwiczenia w formacie JSON.

Generuj DOKŁADNIE tyle ćwiczeń ile poprosi użytkownik. Każde ćwiczenie musi być jednego z typów:
1. SELECT - pytanie wielokrotnego wyboru (4 opcje, dokładnie 1 poprawna)
2. FILL_IN - uzupełnij brakujące słowo/frazę
3. MATCH - dopasuj pary (3-5 par)
4. FLASHCARD - fiszka z pytaniem i odpowiedzią

Odpowiedz TYLKO prawidłowym JSON array, bez żadnego innego tekstu. Format:
[
  {
    "type": "SELECT",
    "question": "Pytanie?",
    "options": [
      {"text": "Odpowiedź A", "correct": false},
      {"text": "Odpowiedź B", "correct": true},
      {"text": "Odpowiedź C", "correct": false},
      {"text": "Odpowiedź D", "correct": false}
    ]
  },
  {
    "type": "FILL_IN",
    "question": "Uzupełnij: Stolica Polski to ___",
    "correctAnswer": "Warszawa"
  },
  {
    "type": "MATCH",
    "question": "Dopasuj pary",
    "matchPairs": [
      {"left": "H2O", "right": "Woda"},
      {"left": "NaCl", "right": "Sól kuchenna"},
      {"left": "CO2", "right": "Dwutlenek węgla"}
    ]
  },
  {
    "type": "FLASHCARD",
    "question": "Co to jest fotosynteza?",
    "flashcardBack": "Proces, w którym rośliny przekształcają energię świetlną w energię chemiczną"
  }
]

Zasady:
- Pytania muszą być w języku polskim (chyba że materiał jest w innym języku - wtedy pytania mogą być dwujęzyczne)
- Pytania muszą bezpośrednio wynikać z podanego materiału
- Różnicuj typy ćwiczeń - nie generuj samych SELECT
- Pytania powinny testować zrozumienie, nie tylko zapamiętywanie
- Dla MATCH podawaj 3-5 par
- Dla SELECT dokładnie 4 opcje`;

export async function generateExercises(
  sourceText: string,
  count: number = 10,
): Promise<GeneratedChallenge[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Truncate very long texts to fit context
  const maxChars = 30000;
  const truncatedText = sourceText.length > maxChars
    ? sourceText.slice(0, maxChars) + "\n\n[...materiał skrócony...]"
    : sourceText;

  const prompt = `${SYSTEM_PROMPT}

MATERIAŁ ŹRÓDŁOWY:
---
${truncatedText}
---

Wygeneruj ${count} ćwiczeń na podstawie powyższego materiału. Użyj mieszanki typów (SELECT, FILL_IN, MATCH, FLASHCARD). Odpowiedz TYLKO JSON array.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = text;
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr) as GeneratedChallenge[];

  // Validate structure
  return parsed.filter((c) => {
    if (!c.type || !c.question) return false;
    if (c.type === "SELECT" && (!c.options || c.options.length < 2)) return false;
    if (c.type === "FILL_IN" && !c.correctAnswer) return false;
    if (c.type === "MATCH" && (!c.matchPairs || c.matchPairs.length < 2)) return false;
    if (c.type === "FLASHCARD" && !c.flashcardBack) return false;
    return true;
  });
}
