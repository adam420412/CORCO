import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// === ENUMS ===

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST", "FILL_IN", "MATCH", "FLASHCARD"]);
export const userRoleEnum = pgEnum("user_role", ["student", "teacher", "parent"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled"]);

// === COURSES ===

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
  description: text("description"),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

// === UNITS ===

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

// === LESSONS ===

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

// === CHALLENGES ===

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
  // For FILL_IN type: the correct answer text
  correctAnswer: text("correct_answer"),
  // For MATCH type: JSON array of pairs [{"left":"dog","right":"pies"}]
  matchPairs: text("match_pairs"),
  // For FLASHCARD type: the back side text
  flashcardBack: text("flashcard_back"),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

// === CHALLENGE OPTIONS ===

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

// === CHALLENGE PROGRESS ===

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

// === USER PROGRESS ===

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
  role: userRoleEnum("role").notNull().default("student"),
});

export const userProgressRelations = relations(userProgress, ({ one, many }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  studentAssignments: many(studentAssignments),
}));

// === USER SUBSCRIPTION ===

export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

// === MESSAGES (nauczyciel <-> rodzic) ===

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(userProgress, {
    fields: [messages.senderId],
    references: [userProgress.userId],
    relationName: "sender",
  }),
  receiver: one(userProgress, {
    fields: [messages.receiverId],
    references: [userProgress.userId],
    relationName: "receiver",
  }),
}));

// === CALENDAR BOOKINGS ===

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull(),
  teacherId: text("teacher_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  student: one(userProgress, {
    fields: [bookings.studentId],
    references: [userProgress.userId],
  }),
}));

// === TEACHER-STUDENT RELATIONSHIPS ===

export const teacherStudents = pgTable("teacher_students", {
  id: serial("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  studentId: text("student_id").notNull(),
  parentId: text("parent_id"),
});

export const teacherStudentsRelations = relations(teacherStudents, ({ one }) => ({
  teacher: one(userProgress, {
    fields: [teacherStudents.teacherId],
    references: [userProgress.userId],
  }),
}));

// === STUDENT ASSIGNMENTS (personalizacja zadań per uczeń) ===

export const studentAssignments = pgTable("student_assignments", {
  id: serial("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  studentId: text("student_id").notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
  dueDate: timestamp("due_date"),
  note: text("note"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studentAssignmentsRelations = relations(studentAssignments, ({ one }) => ({
  student: one(userProgress, {
    fields: [studentAssignments.studentId],
    references: [userProgress.userId],
  }),
  lesson: one(lessons, {
    fields: [studentAssignments.lessonId],
    references: [lessons.id],
  }),
}));
