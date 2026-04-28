import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Landmark,
  Search,
  Calendar,
  RefreshCcw,
  Sparkles,
  Building2,
} from "lucide-react";
import { GOV_SCHEMES, currentSchemeYear, type GovScheme } from "@/lib/schemes";
import { useAuth } from "@/lib/auth";
import { findExam } from "@/lib/exams";

const CATEGORY_COLORS: Record<GovScheme["category"], string> = {
  Welfare: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Economy: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Health: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Education: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Agriculture: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
  Defence: "bg-stone-200 text-stone-800 dark:bg-stone-800/40 dark:text-stone-200",
  Infrastructure: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Digital: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
};

export default function Schemes() {
  const { user } = useAuth();
  const exam = findExam(user?.targetExam);
  const [search, setSearch] = useState("");
  const [showRelevantOnly, setShowRelevantOnly] = useState(true);
  const [category, setCategory] = useState<string>("All");
  const year = currentSchemeYear();

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    GOV_SCHEMES.forEach((s) => set.add(s.category));
    return Array.from(set);
  }, []);

  const items = useMemo(() => {
    return GOV_SCHEMES.filter((s) =>
      showRelevantOnly ? s.relevance.includes(exam.code) : true,
    )
      .filter((s) => (category === "All" ? true : s.category === category))
      .filter((s) => {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.ministry.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.lastUpdatedYear - a.lastUpdatedYear);
  }, [showRelevantOnly, exam.code, category, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Landmark className="w-7 h-7 text-primary" />
            Government Schemes
          </h1>
          <p className="text-muted-foreground mt-1">
            Year-wise updates of major Indian government schemes for {exam.short}.
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
              <RefreshCcw className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">All schemes refreshed for {year}</p>
              <p className="text-xs text-muted-foreground">
                Each card shows what changed this year — perfect for current-affairs revision.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm py-1.5 px-3 gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Edition {year}
          </Badge>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PM-KISAN, PLI, Ayushman Bharat..."
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

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((s) => (
          <Card key={s.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[s.category]}`}
                >
                  {s.category}
                </span>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  Updated {s.lastUpdatedYear}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Launched {s.launchedYear}
                </span>
              </div>

              <h3 className="text-lg font-semibold leading-snug">{s.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3 h-3" /> {s.ministry}
              </p>
              <p className="text-sm leading-relaxed">{s.summary}</p>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Yearly update
                </p>
                <p className="text-sm leading-relaxed">{s.yearlyUpdate}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Beneficiaries
                </span>
                <span className="text-xs">{s.beneficiaries}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-border">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">
                  Relevant for
                </span>
                {s.relevance.map((r) => (
                  <Badge key={r} variant="secondary" className="text-[10px]">
                    {r}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="md:col-span-2 py-12 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
            No schemes match your filters. Try toggling "All" or another category.
          </div>
        )}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <RefreshCcw className="w-4 h-4 shrink-0" />
          <span>
            Yearly notes are refreshed at the start of every calendar year. Last refresh: {year}.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
