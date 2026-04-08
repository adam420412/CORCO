"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { assignLesson } from "@/actions/assignments";
import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";

type Props = {
  teacherId: string;
};

export const TeacherDashboard = ({ teacherId }: Props) => {
  const [studentId, setStudentId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const handleAssign = () => {
    if (!studentId.trim() || !lessonId.trim()) return;

    startTransition(async () => {
      try {
        await assignLesson({
          studentId: studentId.trim(),
          lessonId: parseInt(lessonId),
          note: note.trim() || undefined,
        });
        toast.success("Zadanie przypisane uczniowi!");
        setStudentId("");
        setLessonId("");
        setNote("");
      } catch {
        toast.error("Nie udało się przypisać zadania");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Assign lesson section */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-700 mb-4">
          Przypisz zadanie uczniowi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              ID ucznia
            </label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="ID ucznia z Clerk..."
              className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              ID lekcji
            </label>
            <input
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              placeholder="Numer lekcji..."
              type="number"
              className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Notatka (opcjonalnie)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Np. Skupi się na Present Simple..."
              rows={3}
              className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
          </div>
        </div>
        <Button
          onClick={handleAssign}
          disabled={pending || !studentId.trim() || !lessonId.trim()}
          className="mt-4 bg-teal-500 hover:bg-teal-600"
        >
          {pending ? "Przypisywanie..." : "Przypisz zadanie"}
        </Button>
      </div>

      {/* Knowledge base link */}
      <Link href="/teacher/notebooks" className="block">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 border-2 border-teal-200 rounded-2xl p-6 hover:border-teal-400 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-teal-700">Baza wiedzy (NotebookLM)</h2>
                <p className="text-sm text-teal-600">Dodaj materiały, a AI stworzy zadania dla uczniów</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-500" />
          </div>
        </div>
      </Link>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-teal-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Uczniów</p>
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-teal-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Przypisanych zadań</p>
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
          <p className="text-3xl font-bold text-teal-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Zaplanowanych lekcji</p>
        </div>
      </div>
    </div>
  );
};
