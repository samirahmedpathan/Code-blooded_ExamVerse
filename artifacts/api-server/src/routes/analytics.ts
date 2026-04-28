import { Router, type IRouter } from "express";
import { z } from "zod";
import { sql, and, eq, gte, desc } from "drizzle-orm";
import {
  db,
  quizAttemptsTable,
  studySessionsTable,
  dailyMetricsTable,
} from "@workspace/db";

const router: IRouter = Router();

const RecordAttemptBody = z.object({
  userId: z.string().min(1),
  examCode: z.string().min(1),
  quizId: z.string().min(1),
  subject: z.string().min(1),
  topic: z.string().optional(),
  correct: z.number().int().min(0),
  total: z.number().int().min(0),
  durationSeconds: z.number().int().min(0).default(0),
});

const RecordSessionBody = z.object({
  userId: z.string().min(1),
  examCode: z.string().min(1),
  subject: z.string().optional(),
  activity: z.string().min(1),
  minutes: z.number().int().min(0),
});

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

router.post("/analytics/attempts", async (req, res) => {
  const parsed = RecordAttemptBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const data = parsed.data;
  const date = todayIso();
  try {
    const [row] = await db
      .insert(quizAttemptsTable)
      .values({ ...data, attemptDate: date })
      .returning();

    await upsertDailyMetric(data.userId, data.examCode, date, {
      questionsAttempted: data.total,
      questionsCorrect: data.correct,
      creditsEarned: data.correct * 5,
    });

    return res.json({ id: row.id });
  } catch (err) {
    req.log?.error({ err }, "record attempt failed");
    return res.status(500).json({ error: "Failed to record attempt" });
  }
});

router.post("/analytics/sessions", async (req, res) => {
  const parsed = RecordSessionBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const data = parsed.data;
  const date = todayIso();
  try {
    const [row] = await db
      .insert(studySessionsTable)
      .values({ ...data, sessionDate: date })
      .returning();

    await upsertDailyMetric(data.userId, data.examCode, date, {
      studyMinutes: data.minutes,
    });

    return res.json({ id: row.id });
  } catch (err) {
    req.log?.error({ err }, "record session failed");
    return res.status(500).json({ error: "Failed to record session" });
  }
});

router.get("/analytics/summary/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .slice(0, 10);

    const totals = await db
      .select({
        attempted: sql<number>`coalesce(sum(${quizAttemptsTable.total}), 0)`,
        correct: sql<number>`coalesce(sum(${quizAttemptsTable.correct}), 0)`,
        sessions: sql<number>`count(*)`,
      })
      .from(quizAttemptsTable)
      .where(eq(quizAttemptsTable.userId, userId));

    const weekTrend = await db
      .select({
        day: quizAttemptsTable.attemptDate,
        attempted: sql<number>`coalesce(sum(${quizAttemptsTable.total}), 0)`,
        correct: sql<number>`coalesce(sum(${quizAttemptsTable.correct}), 0)`,
      })
      .from(quizAttemptsTable)
      .where(
        and(
          eq(quizAttemptsTable.userId, userId),
          gte(quizAttemptsTable.attemptDate, sevenDaysAgo),
        ),
      )
      .groupBy(quizAttemptsTable.attemptDate)
      .orderBy(quizAttemptsTable.attemptDate);

    const subjects = await db
      .select({
        subject: quizAttemptsTable.subject,
        attempted: sql<number>`coalesce(sum(${quizAttemptsTable.total}), 0)`,
        correct: sql<number>`coalesce(sum(${quizAttemptsTable.correct}), 0)`,
      })
      .from(quizAttemptsTable)
      .where(eq(quizAttemptsTable.userId, userId))
      .groupBy(quizAttemptsTable.subject);

    const studyTotal = await db
      .select({
        minutes: sql<number>`coalesce(sum(${studySessionsTable.minutes}), 0)`,
      })
      .from(studySessionsTable)
      .where(eq(studySessionsTable.userId, userId));

    const recentMetrics = await db
      .select()
      .from(dailyMetricsTable)
      .where(eq(dailyMetricsTable.userId, userId))
      .orderBy(desc(dailyMetricsTable.metricDate))
      .limit(30);

    return res.json({
      totals: totals[0] ?? { attempted: 0, correct: 0, sessions: 0 },
      weekTrend,
      subjects,
      studyMinutes: Number(studyTotal[0]?.minutes ?? 0),
      recentMetrics,
    });
  } catch (err) {
    req.log?.error({ err }, "summary failed");
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
});

async function upsertDailyMetric(
  userId: string,
  examCode: string,
  date: string,
  delta: {
    questionsAttempted?: number;
    questionsCorrect?: number;
    studyMinutes?: number;
    creditsEarned?: number;
  },
) {
  const existing = await db
    .select()
    .from(dailyMetricsTable)
    .where(
      and(
        eq(dailyMetricsTable.userId, userId),
        eq(dailyMetricsTable.metricDate, date),
      ),
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(dailyMetricsTable).values({
      userId,
      examCode,
      metricDate: date,
      questionsAttempted: delta.questionsAttempted ?? 0,
      questionsCorrect: delta.questionsCorrect ?? 0,
      studyMinutes: delta.studyMinutes ?? 0,
      creditsEarned: delta.creditsEarned ?? 0,
      streakDay: 0,
    });
  } else {
    const cur = existing[0];
    await db
      .update(dailyMetricsTable)
      .set({
        questionsAttempted:
          cur.questionsAttempted + (delta.questionsAttempted ?? 0),
        questionsCorrect:
          cur.questionsCorrect + (delta.questionsCorrect ?? 0),
        studyMinutes: cur.studyMinutes + (delta.studyMinutes ?? 0),
        creditsEarned: cur.creditsEarned + (delta.creditsEarned ?? 0),
        updatedAt: new Date(),
      })
      .where(eq(dailyMetricsTable.id, cur.id));
  }
}

export default router;
