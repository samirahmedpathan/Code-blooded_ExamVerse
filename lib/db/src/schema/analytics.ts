import {
  pgTable,
  text,
  integer,
  timestamp,
  date,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quizAttemptsTable = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    examCode: text("exam_code").notNull(),
    quizId: text("quiz_id").notNull(),
    subject: text("subject").notNull(),
    topic: text("topic"),
    correct: integer("correct").notNull().default(0),
    total: integer("total").notNull().default(0),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    attemptDate: date("attempt_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("quiz_attempts_user_idx").on(t.userId),
    index("quiz_attempts_user_date_idx").on(t.userId, t.attemptDate),
    index("quiz_attempts_user_exam_idx").on(t.userId, t.examCode),
  ],
);

export const studySessionsTable = pgTable(
  "study_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    examCode: text("exam_code").notNull(),
    subject: text("subject"),
    activity: text("activity").notNull(),
    minutes: integer("minutes").notNull().default(0),
    sessionDate: date("session_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("study_sessions_user_idx").on(t.userId),
    index("study_sessions_user_date_idx").on(t.userId, t.sessionDate),
  ],
);

export const dailyMetricsTable = pgTable(
  "daily_metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    examCode: text("exam_code").notNull(),
    metricDate: date("metric_date").notNull(),
    questionsAttempted: integer("questions_attempted").notNull().default(0),
    questionsCorrect: integer("questions_correct").notNull().default(0),
    studyMinutes: integer("study_minutes").notNull().default(0),
    creditsEarned: integer("credits_earned").notNull().default(0),
    streakDay: integer("streak_day").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("daily_metrics_user_date_idx").on(t.userId, t.metricDate),
  ],
);

export const insertQuizAttemptSchema = createInsertSchema(quizAttemptsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttemptsTable.$inferSelect;

export const insertStudySessionSchema = createInsertSchema(studySessionsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessionsTable.$inferSelect;

export const insertDailyMetricSchema = createInsertSchema(dailyMetricsTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertDailyMetric = z.infer<typeof insertDailyMetricSchema>;
export type DailyMetric = typeof dailyMetricsTable.$inferSelect;
