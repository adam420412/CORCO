"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createTeacherNotebook,
  addTextToNotebook,
} from "@/actions/notebooks";
import {
  FileText,
  Globe,
  Loader2,
  Upload,
  Sparkles,
  Check,
  X,
  Save,
  Eye,
} from "lucide-react";

type GeneratedChallenge = {
  type: "SELECT" | "FILL_IN" | "MATCH" | "FLASHCARD";
  question: string;
  options?: { text: string; correct: boolean }[];
  correctAnswer?: string;
  matchPairs?: { left: string; right: string }[];
  flashcardBack?: string;
};

type Source = {
  id: number;
  sourceName: string;
  sourceType: string;
  extractedText?: string;
};

const TYPE_LABELS: Record<string, string> = {
  SELECT: "Wybór",
  FILL_IN: "Uzupełnij",
  MATCH: "Dopasuj",
  FLASHCARD: "Fiszka",
};

const TYPE_COLORS: Record<string, string> = {
  SELECT: "bg-blue-100 text-blue-700",
  FILL_IN: "bg-green-100 text-green-700",
  MATCH: "bg-purple-100 text-purple-700",
  FLASHCARD: "bg-amber-100 text-amber-700",
};

const NewNotebookPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Step 1: Create notebook
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [notebookDbId, setNotebookDbId] = useState<number | null>(null);

  // Step 2: Sources & extracted text
  const [sources, setSources] = useState<Source[]>([]);
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [sourceName, setSourceName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // Step 3: Generate exercises
  const [exerciseCount, setExerciseCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedChallenge[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Step 4: Save to lesson
  const [lessonId, setLessonId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const handleCreateNotebook = () => {
    if (!title.trim()) {
      toast.error("Podaj nazwę notebooka");
      return;
    }
    const cid = parseInt(courseId);
    if (!cid || isNaN(cid)) {
      toast.error("Podaj prawidłowe ID kursu");
      return;
    }

    startTransition(async () => {
      try {
        const notebook = await createTeacherNotebook(title.trim(), cid);
        setNotebookDbId(notebook.id);
        toast.success("Notebook utworzony!");
      } catch {
        toast.error("Nie udało się utworzyć notebooka");
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !notebookDbId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("notebookDbId", String(notebookDbId));

    try {
      const res = await fetch("/api/notebooks/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      setSources((prev) => [
        ...prev,
        {
          id: data.source.id,
          sourceName: data.source.sourceName,
          sourceType: data.source.sourceType,
          extractedText: data.extractedText,
        },
      ]);

      if (data.extractedText) {
        setExtractedText((prev) =>
          prev ? prev + "\n\n---\n\n" + data.extractedText : data.extractedText
        );
      }

      toast.success(
        `Plik przesłany! Wyodrębniono ${data.textLength} znaków tekstu.`
      );
    } catch (err: any) {
      toast.error(err.message || "Nie udało się przesłać pliku");
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const handleAddText = () => {
    if (!notebookDbId || !textContent.trim()) return;

    startTransition(async () => {
      try {
        const result = await addTextToNotebook(
          notebookDbId,
          sourceName.trim() || "Tekst",
          textContent.trim()
        );
        setSources((prev) => [
          ...prev,
          {
            id: result.source.id,
            sourceName: result.source.sourceName,
            sourceType: "text",
            extractedText: textContent.trim(),
          },
        ]);
        setExtractedText((prev) =>
          prev ? prev + "\n\n---\n\n" + textContent.trim() : textContent.trim()
        );
        setTextContent("");
        setSourceName("");
        toast.success("Tekst dodany!");
      } catch {
        toast.error("Nie udało się dodać tekstu");
      }
    });
  };

  const handleGenerate = async () => {
    if (!extractedText.trim()) {
      toast.error("Brak materiału do generowania ćwiczeń");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/notebooks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notebookDbId,
          sourceText: extractedText,
          count: exerciseCount,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setGenerated(data.generated);
      setPreviewIndex(0);
      toast.success(`Wygenerowano ${data.generated.length} ćwiczeń!`);
    } catch (err: any) {
      toast.error(err.message || "Błąd generowania ćwiczeń");
    }
    setIsGenerating(false);
  };

  const handleSaveToLesson = async () => {
    const lid = parseInt(lessonId);
    if (!lid || isNaN(lid)) {
      toast.error("Podaj prawidłowe ID lekcji");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/notebooks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notebookDbId,
          sourceText: extractedText,
          count: exerciseCount,
          lessonId: lid,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      const data = await res.json();
      setSavedCount(data.savedCount);
      toast.success(
        `Zapisano ${data.savedCount} ćwiczeń do lekcji #${lid}!`
      );
    } catch (err: any) {
      toast.error(err.message || "Nie udało się zapisać");
    }
    setIsSaving(false);
  };

  const removeExercise = (index: number) => {
    setGenerated((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full max-w-[760px] px-3 mx-auto py-6">
      <button
        onClick={() => router.push("/teacher/notebooks")}
        className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 transition-colors"
      >
        &larr; Powrót do listy
      </button>

      <h1 className="text-2xl font-bold text-neutral-700 mb-2">
        Utwórz notebook i generuj ćwiczenia
      </h1>
      <p className="text-neutral-500 text-sm mb-6">
        Wgraj PDF lub wklej tekst → AI wygeneruje gotowe ćwiczenia → zapisz je do lekcji
      </p>

      {/* Step 1: Create notebook */}
      <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 mb-4">
        <h2 className="text-base font-semibold text-neutral-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">
            1
          </span>
          Utwórz notebook
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!!notebookDbId}
            placeholder="Nazwa notebooka..."
            className="border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-400"
          />
          <input
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            disabled={!!notebookDbId}
            placeholder="ID kursu (np. 1)"
            className="border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>

        {!notebookDbId && (
          <button
            onClick={handleCreateNotebook}
            disabled={isPending}
            className="mt-3 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Utwórz
          </button>
        )}

        {notebookDbId && (
          <p className="mt-3 text-sm text-teal-600 font-medium flex items-center gap-1">
            <Check className="w-4 h-4" /> Notebook utworzony
          </p>
        )}
      </div>

      {/* Step 2: Add sources */}
      {notebookDbId && (
        <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 mb-4">
          <h2 className="text-base font-semibold text-neutral-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            Dodaj materiał
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("file")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "file"
                  ? "bg-teal-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Upload className="w-4 h-4 inline mr-1.5" />
              Plik PDF
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "text"
                  ? "bg-teal-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1.5" />
              Tekst
            </button>
          </div>

          {activeTab === "file" && (
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-teal-400 transition-colors">
              <Upload className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <label className="cursor-pointer">
                <span className="text-teal-600 font-semibold hover:text-teal-700">
                  {isUploading ? "Przesyłanie..." : "Kliknij, aby wybrać plik"}
                </span>
                <p className="text-xs text-neutral-400 mt-1">
                  PDF, DOCX, TXT (max 10MB)
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <Loader2 className="w-6 h-6 text-teal-500 animate-spin mx-auto mt-3" />
              )}
            </div>
          )}

          {activeTab === "text" && (
            <div className="space-y-3">
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="Nazwa źródła (opcjonalnie)"
                className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none"
              />
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                placeholder="Wklej tutaj treść materiału dydaktycznego..."
                className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none resize-y"
              />
              <button
                onClick={handleAddText}
                disabled={isPending || !textContent.trim()}
                className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Dodaj tekst
              </button>
            </div>
          )}

          {/* Sources list */}
          {sources.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Dodane źródła ({sources.length})
              </p>
              {sources.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2"
                >
                  {s.sourceType === "file" ? (
                    <Upload className="w-4 h-4 text-teal-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-teal-600" />
                  )}
                  <span className="text-sm text-neutral-700 truncate flex-1">
                    {s.sourceName}
                  </span>
                  <span className="text-xs text-teal-600">
                    {s.extractedText
                      ? `${s.extractedText.length} znaków`
                      : s.sourceType}
                  </span>
                </div>
              ))}
            </div>
          )}

          {extractedText && (
            <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                Podgląd wyodrębnionego tekstu ({extractedText.length} znaków)
              </p>
              <p className="text-xs text-neutral-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {extractedText.slice(0, 1000)}
                {extractedText.length > 1000 && "..."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Generate */}
      {extractedText && (
        <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 mb-4">
          <h2 className="text-base font-semibold text-neutral-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
            Generuj ćwiczenia (AI)
          </h2>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-neutral-600">Liczba ćwiczeń:</label>
            <input
              type="number"
              min={1}
              max={30}
              value={exerciseCount}
              onChange={(e) => setExerciseCount(parseInt(e.target.value) || 10)}
              className="w-20 border-2 border-neutral-200 rounded-xl px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2 text-sm shadow-sm"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGenerating ? "Generowanie..." : "Generuj ćwiczenia"}
            </button>
          </div>

          {/* Generated exercises preview */}
          {generated.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-600">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Podgląd wygenerowanych ćwiczeń ({generated.length})
                </p>
                <div className="flex gap-1">
                  {Object.entries(TYPE_LABELS).map(([type, label]) => {
                    const count = generated.filter((g) => g.type === type).length;
                    if (!count) return null;
                    return (
                      <span
                        key={type}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[type]}`}
                      >
                        {label}: {count}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {generated.map((ex, i) => (
                  <div
                    key={i}
                    className="border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-neutral-400">
                            #{i + 1}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[ex.type]}`}
                          >
                            {TYPE_LABELS[ex.type]}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-neutral-700">
                          {ex.question}
                        </p>

                        {ex.type === "SELECT" && ex.options && (
                          <div className="mt-2 grid grid-cols-2 gap-1">
                            {ex.options.map((opt, j) => (
                              <span
                                key={j}
                                className={`text-xs px-2 py-1 rounded ${
                                  opt.correct
                                    ? "bg-green-50 text-green-700 font-medium"
                                    : "bg-neutral-50 text-neutral-500"
                                }`}
                              >
                                {opt.correct && (
                                  <Check className="w-3 h-3 inline mr-1" />
                                )}
                                {opt.text}
                              </span>
                            ))}
                          </div>
                        )}

                        {ex.type === "FILL_IN" && (
                          <p className="mt-1 text-xs text-green-600">
                            <Check className="w-3 h-3 inline mr-1" />
                            {ex.correctAnswer}
                          </p>
                        )}

                        {ex.type === "MATCH" && ex.matchPairs && (
                          <div className="mt-2 space-y-1">
                            {ex.matchPairs.map((pair, j) => (
                              <div
                                key={j}
                                className="text-xs flex items-center gap-2"
                              >
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                  {pair.left}
                                </span>
                                <span className="text-neutral-400">→</span>
                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                                  {pair.right}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {ex.type === "FLASHCARD" && (
                          <p className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                            {ex.flashcardBack}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeExercise(i)}
                        className="text-neutral-300 hover:text-red-400 transition-colors p-1"
                        title="Usuń"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Save to lesson */}
      {generated.length > 0 && (
        <div className="bg-white border-2 border-teal-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-neutral-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">
              4
            </span>
            Zapisz do lekcji
          </h2>

          {savedCount > 0 ? (
            <div className="text-center py-4">
              <Check className="w-12 h-12 text-teal-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-teal-600">
                Zapisano {savedCount} ćwiczeń!
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Ćwiczenia są dostępne w lekcji #{lessonId}
              </p>
              <button
                onClick={() => router.push("/teacher/notebooks")}
                className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-8 py-2 rounded-xl font-semibold transition-colors text-sm"
              >
                Gotowe
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm text-neutral-600 mb-1">
                  ID lekcji docelowej
                </label>
                <input
                  type="number"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  placeholder="np. 1"
                  className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSaveToLesson}
                disabled={isSaving || !lessonId.trim()}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving
                  ? "Zapisywanie..."
                  : `Zapisz ${generated.length} ćwiczeń`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewNotebookPage;
