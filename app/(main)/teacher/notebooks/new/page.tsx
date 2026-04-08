"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createTeacherNotebook,
  addTextToNotebook,
  addWebToNotebook,
} from "@/actions/notebooks";
import { FileText, Globe, Trash2, Loader2 } from "lucide-react";

type Source = {
  id: number;
  sourceName: string;
  sourceType: string;
};

const NewNotebookPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Step 1: Create notebook
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [notebookDbId, setNotebookDbId] = useState<number | null>(null);

  // Step 2: Add sources
  const [activeTab, setActiveTab] = useState<"text" | "link">("text");
  const [sourceName, setSourceName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [sources, setSources] = useState<Source[]>([]);

  const handleCreateNotebook = () => {
    if (!title.trim()) {
      toast.error("Podaj nazwe notebooka");
      return;
    }
    const cid = parseInt(courseId);
    if (!cid || isNaN(cid)) {
      toast.error("Podaj prawidlowe ID kursu");
      return;
    }

    startTransition(async () => {
      try {
        const notebook = await createTeacherNotebook(title.trim(), cid);
        setNotebookDbId(notebook.id);
        toast.success("Notebook utworzony!");
      } catch (err) {
        toast.error("Nie udalo sie utworzyc notebooka");
      }
    });
  };

  const handleAddSource = () => {
    if (!notebookDbId) return;

    if (!sourceName.trim()) {
      toast.error("Podaj nazwe zrodla");
      return;
    }

    if (activeTab === "text" && !textContent.trim()) {
      toast.error("Podaj tresc zrodla");
      return;
    }

    if (activeTab === "link" && !webUrl.trim()) {
      toast.error("Podaj adres URL");
      return;
    }

    startTransition(async () => {
      try {
        let source;
        if (activeTab === "text") {
          source = await addTextToNotebook(
            notebookDbId,
            sourceName.trim(),
            textContent.trim()
          );
          setTextContent("");
        } else {
          source = await addWebToNotebook(
            notebookDbId,
            webUrl.trim(),
            sourceName.trim()
          );
          setWebUrl("");
        }

        setSources((prev) => [
          ...prev,
          {
            id: source.id,
            sourceName: source.sourceName,
            sourceType: source.sourceType,
          },
        ]);
        setSourceName("");
        toast.success("Zrodlo dodane!");
      } catch (err) {
        toast.error("Nie udalo sie dodac zrodla");
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !notebookDbId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("notebookDbId", String(notebookDbId));

    try {
      const res = await fetch("/api/notebooks/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const source = await res.json();
      setSources((prev) => [
        ...prev,
        {
          id: source.id,
          sourceName: source.sourceName,
          sourceType: source.sourceType,
        },
      ]);
      toast.success("Plik przeslany!");
    } catch {
      toast.error("Nie udalo sie przeslac pliku");
    }

    e.target.value = "";
  };

  return (
    <div className="h-full max-w-[680px] px-3 mx-auto py-6">
      <button
        onClick={() => router.push("/teacher/notebooks")}
        className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 transition-colors"
      >
        &larr; Powrot do listy
      </button>

      <h1 className="text-2xl font-bold text-neutral-700 mb-6">
        Utworz nowy notebook
      </h1>

      {/* Step 1: Create notebook */}
      <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-700 mb-4">
          1. Dane notebooka
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              Nazwa notebooka
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!!notebookDbId}
              placeholder="np. Gramatyka angielska - poziom B1"
              className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1">
              ID kursu
            </label>
            <input
              type="number"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={!!notebookDbId}
              placeholder="np. 1"
              className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-400"
            />
          </div>

          {!notebookDbId && (
            <button
              onClick={handleCreateNotebook}
              disabled={isPending}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Utworz
            </button>
          )}

          {notebookDbId && (
            <p className="text-sm text-teal-600 font-medium">
              Notebook utworzony (ID: {notebookDbId})
            </p>
          )}
        </div>
      </div>

      {/* Step 2: Add sources */}
      {notebookDbId && (
        <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-700 mb-4">
            2. Dodaj zrodla
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
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
            <button
              onClick={() => setActiveTab("link")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "link"
                  ? "bg-teal-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Globe className="w-4 h-4 inline mr-1.5" />
              Link
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Nazwa zrodla
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="np. Rozdzial 1 - Present Simple"
                className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none"
              />
            </div>

            {activeTab === "text" && (
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">
                  Tresc
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                  placeholder="Wklej tutaj tresc materialu..."
                  className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none resize-y"
                />
              </div>
            )}

            {activeTab === "link" && (
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">
                  Adres URL
                </label>
                <input
                  type="url"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2 text-sm focus:border-teal-400 focus:outline-none"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddSource}
                disabled={isPending}
                className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Dodaj zrodlo
              </button>

              <label className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-5 py-2 rounded-xl font-semibold transition-colors cursor-pointer text-sm flex items-center gap-2">
                Przeslij plik
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.pptx"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Sources list */}
          {sources.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Dodane zrodla ({sources.length})
              </h3>
              {sources.map((source) => {
                const Icon =
                  source.sourceType === "web" ? Globe : source.sourceType === "file" ? Trash2 : FileText;
                return (
                  <div
                    key={source.id}
                    className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                  >
                    <Icon className="w-4 h-4 text-teal-500 shrink-0" />
                    <span className="text-sm text-neutral-700 truncate">
                      {source.sourceName}
                    </span>
                    <span className="ml-auto text-xs text-neutral-400 uppercase">
                      {source.sourceType}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {notebookDbId && sources.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => router.push("/teacher/notebooks")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Gotowe
          </button>
        </div>
      )}
    </div>
  );
};

export default NewNotebookPage;
