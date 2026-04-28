import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "examverse:progress";

const TASK_CREDIT = 10;
const QUIZ_CREDIT = 25;
const CHALLENGE_CREDIT = 50;
const CURRENT_AFFAIRS_CREDIT = 5;

type ActivityKind = "task" | "quiz" | "challenge" | "current-affairs";

interface ActivityRecord {
  id: string;
  kind: ActivityKind;
  date: string;
  credits: number;
  meta?: Record<string, unknown>;
}

interface QuizAttempt {
  quizId: string;
  date: string;
  total: number;
  correct: number;
}

interface ProgressState {
  totalCredits: number;
  completedTaskIdsByDate: Record<string, string[]>;
  completedQuizIds: string[];
  completedChallengeIdsByDate: Record<string, string[]>;
  readCurrentAffairsIds: string[];
  activeDates: string[];
  activity: ActivityRecord[];
  quizAttempts: QuizAttempt[];
}

const DEFAULT_STATE: ProgressState = {
  totalCredits: 120,
  completedTaskIdsByDate: {},
  completedQuizIds: [],
  completedChallengeIdsByDate: {},
  readCurrentAffairsIds: [],
  activeDates: [],
  activity: [],
  quizAttempts: [],
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function computeStreak(activeDates: string[]): number {
  if (activeDates.length === 0) return 0;
  const set = new Set(activeDates);
  let streak = 0;
  const cursor = new Date();
  // If today is not active, start from yesterday
  if (!set.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

interface ProgressContextValue {
  state: ProgressState;
  todayCredits: number;
  todayCompletedTaskIds: string[];
  todayCompletedChallengeIds: string[];
  streak: number;
  weeklyAccuracy: number;
  weeklyMinutes: number;
  totalQuestionsSolved: number;
  toggleTask: (taskId: string) => void;
  recordQuiz: (quizId: string, total: number, correct: number) => void;
  acceptChallenge: (challengeId: string) => void;
  markCurrentAffairsRead: (id: string) => void;
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const today = todayKey();

  const recordActiveDay = useCallback(
    (s: ProgressState): ProgressState => {
      if (s.activeDates.includes(today)) return s;
      return { ...s, activeDates: [...s.activeDates, today] };
    },
    [today],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      setState((prev) => {
        const todays = prev.completedTaskIdsByDate[today] ?? [];
        const isCompleted = todays.includes(taskId);
        const nextTodays = isCompleted
          ? todays.filter((id) => id !== taskId)
          : [...todays, taskId];
        const creditDelta = isCompleted ? -TASK_CREDIT : TASK_CREDIT;
        const next: ProgressState = {
          ...prev,
          totalCredits: Math.max(0, prev.totalCredits + creditDelta),
          completedTaskIdsByDate: {
            ...prev.completedTaskIdsByDate,
            [today]: nextTodays,
          },
          activity: isCompleted
            ? prev.activity.filter(
                (a) => !(a.kind === "task" && a.id === taskId && a.date === today),
              )
            : [
                ...prev.activity,
                {
                  id: taskId,
                  kind: "task",
                  date: today,
                  credits: TASK_CREDIT,
                },
              ],
        };
        return isCompleted ? next : recordActiveDay(next);
      });
    },
    [today, recordActiveDay],
  );

  const recordQuiz = useCallback(
    (quizId: string, total: number, correct: number) => {
      setState((prev) => {
        const alreadyDone = prev.completedQuizIds.includes(quizId);
        const next: ProgressState = {
          ...prev,
          totalCredits: prev.totalCredits + QUIZ_CREDIT,
          completedQuizIds: alreadyDone
            ? prev.completedQuizIds
            : [...prev.completedQuizIds, quizId],
          quizAttempts: [
            ...prev.quizAttempts,
            { quizId, date: today, total, correct },
          ],
          activity: [
            ...prev.activity,
            {
              id: quizId,
              kind: "quiz",
              date: today,
              credits: QUIZ_CREDIT,
              meta: { total, correct },
            },
          ],
        };
        return recordActiveDay(next);
      });
    },
    [today, recordActiveDay],
  );

  const acceptChallenge = useCallback(
    (challengeId: string) => {
      setState((prev) => {
        const todays = prev.completedChallengeIdsByDate[today] ?? [];
        if (todays.includes(challengeId)) return prev;
        const next: ProgressState = {
          ...prev,
          totalCredits: prev.totalCredits + CHALLENGE_CREDIT,
          completedChallengeIdsByDate: {
            ...prev.completedChallengeIdsByDate,
            [today]: [...todays, challengeId],
          },
          activity: [
            ...prev.activity,
            {
              id: challengeId,
              kind: "challenge",
              date: today,
              credits: CHALLENGE_CREDIT,
            },
          ],
        };
        return recordActiveDay(next);
      });
    },
    [today, recordActiveDay],
  );

  const markCurrentAffairsRead = useCallback(
    (id: string) => {
      setState((prev) => {
        if (prev.readCurrentAffairsIds.includes(id)) return prev;
        const next: ProgressState = {
          ...prev,
          totalCredits: prev.totalCredits + CURRENT_AFFAIRS_CREDIT,
          readCurrentAffairsIds: [...prev.readCurrentAffairsIds, id],
          activity: [
            ...prev.activity,
            {
              id,
              kind: "current-affairs",
              date: today,
              credits: CURRENT_AFFAIRS_CREDIT,
            },
          ],
        };
        return recordActiveDay(next);
      });
    },
    [today, recordActiveDay],
  );

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const todayCompletedTaskIds = state.completedTaskIdsByDate[today] ?? [];
  const todayCompletedChallengeIds =
    state.completedChallengeIdsByDate[today] ?? [];

  const todayCredits = useMemo(
    () =>
      state.activity
        .filter((a) => a.date === today)
        .reduce((sum, a) => sum + a.credits, 0),
    [state.activity, today],
  );

  const streak = useMemo(() => computeStreak(state.activeDates), [state.activeDates]);

  const totalQuestionsSolved = useMemo(
    () => state.quizAttempts.reduce((sum, q) => sum + q.total, 0),
    [state.quizAttempts],
  );

  const weeklyAccuracy = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const recent = state.quizAttempts.filter(
      (q) => new Date(q.date) >= cutoff,
    );
    if (recent.length === 0) return 0;
    const total = recent.reduce((s, q) => s + q.total, 0);
    const correct = recent.reduce((s, q) => s + q.correct, 0);
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [state.quizAttempts]);

  const weeklyMinutes = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const taskMinutes = Object.entries(state.completedTaskIdsByDate)
      .filter(([d]) => new Date(d) >= cutoff)
      .reduce((sum, [, ids]) => sum + ids.length * 25, 0);
    const quizMinutes = state.quizAttempts
      .filter((q) => new Date(q.date) >= cutoff)
      .reduce((sum, q) => sum + q.total * 1.5, 0);
    return Math.round(taskMinutes + quizMinutes);
  }, [state.completedTaskIdsByDate, state.quizAttempts]);

  const value: ProgressContextValue = {
    state,
    todayCredits,
    todayCompletedTaskIds,
    todayCompletedChallengeIds,
    streak,
    weeklyAccuracy,
    weeklyMinutes,
    totalQuestionsSolved,
    toggleTask,
    recordQuiz,
    acceptChallenge,
    markCurrentAffairsRead,
    resetAll,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return ctx;
}
