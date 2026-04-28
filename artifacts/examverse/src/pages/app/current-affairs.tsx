import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  Search,
  Sparkles,
  CheckCircle2,
  Calendar,
  Globe,
} from "lucide-react";
import { MOCK_DATA } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { findExam } from "@/lib/exams";
import { useT } from "@/lib/i18n";

const CATEGORY_COLORS: Record<string, string> = {
  National: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  International: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Economy: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "Science & Tech": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  Sports: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Polity: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Environment: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export default function CurrentAffairs() {
  const { user } = useAuth();
  const { state, markCurrentAffairsRead } = useProgress();
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [showRelevantOnly, setShowRelevantOnly] = useState(true);
  const [category, setCategory] = useState<string>("All");

  const exam = findExam(user?.targetExam);

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    MOCK_DATA.currentAffairs.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, []);

  const items = useMemo(() => {
    return MOCK_DATA.currentAffairs
      .filter((c) => (showRelevantOnly ? c.relevance.includes(exam.code) : true))
      .filter((c) => (category === "All" ? true : c.category === category))
      .filter((c) => {
        const s = search.toLowerCase();
        return (
          c.headline.toLowerCase().includes(s) ||
          c.summary.toLowerCase().includes(s)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [showRelevantOnly, exam.code, category, search]);

  const readCount = state.readCurrentAffairsIds.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-primary" />
            {t("currentAffairs.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("currentAffairs.sub")} · {exam.short}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-full text-sm">
          <button
            onClick={() => setShowRelevantOnly(true)}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              showRelevantOnly ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            For {exam.short}
          </button>
          <button
            onClick={() => setShowRelevantOnly(false)}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              !showRelevantOnly ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            All
          </button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">You've read {readCount} articles so far</p>
              <p className="text-xs text-muted-foreground">
                Earned +{readCount * 5} credits from current affairs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search headlines..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((c) => (
          <Badge
            key={c}
            variant={c === category ? "default" : "outline"}
            className="cursor-pointer text-sm py-1.5 px-4"
            onClick={() => setCategory(c)}
          >
            {c}
          </Badge>
        ))}
      </div>

      <div className="space-y-4">
        {items.map((c) => {
          const read = state.readCurrentAffairsIds.includes(c.id);
          return (
            <Card
              key={c.id}
              className={`transition-all ${read ? "border-primary/30 bg-primary/5" : "hover:shadow-md"}`}
            >
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      CATEGORY_COLORS[c.category] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(c.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Relevant: {c.relevance.join(", ")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug mb-2">{c.headline}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {read ? "Marked as read · +5 credits earned" : "Tap to mark read · +5 credits"}
                  </span>
                  <Button
                    size="sm"
                    variant={read ? "outline" : "default"}
                    onClick={() => markCurrentAffairsRead(c.id)}
                    disabled={read}
                    className="gap-1"
                  >
                    {read ? <CheckCircle2 className="w-4 h-4" /> : null}
                    {read ? t("common.read") : t("common.markRead")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {items.length === 0 && (
          <div className="py-12 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
            No articles match your filters yet. Try toggling "All" above.
          </div>
        )}
      </div>
    </div>
  );
}
