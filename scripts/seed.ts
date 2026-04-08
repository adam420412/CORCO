import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool, { schema });

const main = async () => {
  try {
    console.log("Seeding CORCO database...");

    // Clear all tables
    await db.delete(schema.studentAssignments);
    await db.delete(schema.bookings);
    await db.delete(schema.messages);
    await db.delete(schema.teacherStudents);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userProgress);
    await db.delete(schema.courses);
    await db.delete(schema.userSubscription);

    // === COURSES (przedmioty) ===
    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Matematyka",
        imageSrc: "/math.svg",
        description: "Algebra, geometria, analiza matematyczna",
      },
      {
        id: 2,
        title: "Angielski",
        imageSrc: "/english.svg",
        description: "Gramatyka, słownictwo, konwersacje",
      },
      {
        id: 3,
        title: "Fizyka",
        imageSrc: "/physics.svg",
        description: "Mechanika, termodynamika, elektryczność",
      },
      {
        id: 4,
        title: "Chemia",
        imageSrc: "/chemistry.svg",
        description: "Chemia organiczna i nieorganiczna",
      },
    ]);

    // === UNITS - Matematyka ===
    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: "Rozdział 1",
        description: "Podstawy algebry",
        order: 1,
      },
      {
        id: 2,
        courseId: 1,
        title: "Rozdział 2",
        description: "Równania i nierówności",
        order: 2,
      },
    ]);

    // === UNITS - Angielski ===
    await db.insert(schema.units).values([
      {
        id: 3,
        courseId: 2,
        title: "Rozdział 1",
        description: "Present Simple",
        order: 1,
      },
      {
        id: 4,
        courseId: 2,
        title: "Rozdział 2",
        description: "Past Simple",
        order: 2,
      },
    ]);

    // === LESSONS - Matematyka / Podstawy algebry ===
    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, order: 1, title: "Wyrażenia algebraiczne" },
      { id: 2, unitId: 1, order: 2, title: "Potęgowanie" },
      { id: 3, unitId: 1, order: 3, title: "Pierwiastkowanie" },
      { id: 4, unitId: 1, order: 4, title: "Procenty" },
      { id: 5, unitId: 1, order: 5, title: "Proporcje" },
    ]);

    // === LESSONS - Matematyka / Równania ===
    await db.insert(schema.lessons).values([
      { id: 6, unitId: 2, order: 1, title: "Równania liniowe" },
      { id: 7, unitId: 2, order: 2, title: "Nierówności" },
      { id: 8, unitId: 2, order: 3, title: "Układy równań" },
    ]);

    // === LESSONS - Angielski / Present Simple ===
    await db.insert(schema.lessons).values([
      { id: 9, unitId: 3, order: 1, title: "Zdania twierdzące" },
      { id: 10, unitId: 3, order: 2, title: "Przeczenia" },
      { id: 11, unitId: 3, order: 3, title: "Pytania" },
    ]);

    // === LESSONS - Angielski / Past Simple ===
    await db.insert(schema.lessons).values([
      { id: 12, unitId: 4, order: 1, title: "Czasowniki regularne" },
      { id: 13, unitId: 4, order: 2, title: "Czasowniki nieregularne" },
    ]);

    // === CHALLENGES - Matematyka: Wyrażenia algebraiczne ===
    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: "SELECT",
        order: 1,
        question: "Uprość wyrażenie: 2x + 3x",
      },
      {
        id: 2,
        lessonId: 1,
        type: "FILL_IN",
        order: 2,
        question: "Ile wynosi 2x + 3x? (wpisz wynik w postaci np. 5x)",
        correctAnswer: "5x",
      },
      {
        id: 3,
        lessonId: 1,
        type: "SELECT",
        order: 3,
        question: "Które wyrażenie jest równoważne 3(a + 2)?",
      },
      {
        id: 4,
        lessonId: 1,
        type: "FLASHCARD",
        order: 4,
        question: "Wzór skróconego mnożenia: (a+b)²",
        flashcardBack: "a² + 2ab + b²",
      },
      {
        id: 5,
        lessonId: 1,
        type: "MATCH",
        order: 5,
        question: "Dopasuj wyrażenia do ich wartości",
        matchPairs: JSON.stringify([
          { left: "2 + 3", right: "5" },
          { left: "3 × 4", right: "12" },
          { left: "10 - 7", right: "3" },
          { left: "8 ÷ 2", right: "4" },
        ]),
      },
    ]);

    // === CHALLENGE OPTIONS - Matematyka ===
    // Challenge 1: Uprość 2x + 3x
    await db.insert(schema.challengeOptions).values([
      { challengeId: 1, text: "5x", correct: true },
      { challengeId: 1, text: "6x", correct: false },
      { challengeId: 1, text: "5x²", correct: false },
    ]);

    // Challenge 3: 3(a + 2)
    await db.insert(schema.challengeOptions).values([
      { challengeId: 3, text: "3a + 6", correct: true },
      { challengeId: 3, text: "3a + 2", correct: false },
      { challengeId: 3, text: "a + 6", correct: false },
    ]);

    // === CHALLENGES - Angielski: Present Simple ===
    await db.insert(schema.challenges).values([
      {
        id: 6,
        lessonId: 9,
        type: "SELECT",
        order: 1,
        question: 'Wybierz poprawne zdanie w Present Simple:',
      },
      {
        id: 7,
        lessonId: 9,
        type: "FILL_IN",
        order: 2,
        question: "She ___ (go) to school every day.",
        correctAnswer: "goes",
      },
      {
        id: 8,
        lessonId: 9,
        type: "ASSIST",
        order: 3,
        question: '"I play football every weekend"',
      },
      {
        id: 9,
        lessonId: 9,
        type: "MATCH",
        order: 4,
        question: "Dopasuj angielskie słowa do polskich",
        matchPairs: JSON.stringify([
          { left: "dog", right: "pies" },
          { left: "cat", right: "kot" },
          { left: "house", right: "dom" },
          { left: "book", right: "książka" },
        ]),
      },
      {
        id: 10,
        lessonId: 9,
        type: "FLASHCARD",
        order: 5,
        question: "What does 'beautiful' mean?",
        flashcardBack: "piękny / piękna",
      },
    ]);

    // Challenge options for challenge 6
    await db.insert(schema.challengeOptions).values([
      { challengeId: 6, text: "He plays tennis.", correct: true },
      { challengeId: 6, text: "He play tennis.", correct: false },
      { challengeId: 6, text: "He playing tennis.", correct: false },
    ]);

    // Challenge options for challenge 8 (ASSIST)
    await db.insert(schema.challengeOptions).values([
      { challengeId: 8, text: "Gram w piłkę nożną w każdy weekend", correct: true },
      { challengeId: 8, text: "Grałem w piłkę nożną w weekend", correct: false },
      { challengeId: 8, text: "Będę grał w piłkę nożną w weekend", correct: false },
    ]);

    // === MORE CHALLENGES - Potęgowanie ===
    await db.insert(schema.challenges).values([
      {
        id: 11,
        lessonId: 2,
        type: "SELECT",
        order: 1,
        question: "Ile wynosi 2³?",
      },
      {
        id: 12,
        lessonId: 2,
        type: "FILL_IN",
        order: 2,
        question: "Oblicz: 5² = ?",
        correctAnswer: "25",
      },
      {
        id: 13,
        lessonId: 2,
        type: "SELECT",
        order: 3,
        question: "Które z poniższych jest poprawne?",
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      { challengeId: 11, text: "8", correct: true },
      { challengeId: 11, text: "6", correct: false },
      { challengeId: 11, text: "9", correct: false },
    ]);

    await db.insert(schema.challengeOptions).values([
      { challengeId: 13, text: "a² × a³ = a⁵", correct: true },
      { challengeId: 13, text: "a² × a³ = a⁶", correct: false },
      { challengeId: 13, text: "a² × a³ = a²³", correct: false },
    ]);

    console.log("Seeding finished successfully!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
