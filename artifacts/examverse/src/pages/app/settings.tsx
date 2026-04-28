import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { EXAMS, LANGUAGES } from "@/lib/exams";
import { useT } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LogOut, User, Globe, Save, Target, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { resetAll, state, todayCredits, streak } = useProgress();
  const { toast } = useToast();
  const { t } = useT();
  const [, setLocation] = useLocation();

  const [name, setName] = useState(user?.name ?? "");
  const [targetExam, setTargetExam] = useState(user?.targetExam ?? "JEE");
  const [language, setLanguage] = useState(user?.language ?? "EN");
  const [dailyHours, setDailyHours] = useState(6);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setTargetExam(user.targetExam);
      setLanguage(user.language);
    }
  }, [user]);

  const handleSave = () => {
    updateProfile({ name, targetExam, language });
    toast({
      title: t("settings.profileUpdated"),
      description: `${t("settings.nowStudyingFor")} ${EXAMS.find((e) => e.code === targetExam)?.short ?? targetExam} ${t("settings.inLang")} ${LANGUAGES.find((l) => l.code === language)?.native}.`,
    });
  };

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleResetProgress = () => {
    if (window.confirm(t("settings.resetConfirm"))) {
      resetAll();
      toast({ title: t("settings.resetDone"), description: t("settings.resetDoneDesc") });
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocation("/app")}
        className="-ml-2 text-muted-foreground hover:text-foreground"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> {t("common.back")}
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("nav.settings")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.profile")} · {t("common.language")}</p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{state.totalCredits}</p>
            <p className="text-xs text-muted-foreground">{t("common.credits")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{todayCredits}</p>
            <p className="text-xs text-muted-foreground">{t("common.today")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">{streak}</p>
            <p className="text-xs text-muted-foreground">{t("common.streak")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" /> {t("settings.profile")}
          </CardTitle>
          <CardDescription>{t("settings.targetExam")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("settings.fullName")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("settings.email")}</Label>
              <Input id="email" defaultValue={user?.email} disabled className="bg-muted/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> {t("settings.targetExam")}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXAMS.map((exam) => {
                const active = targetExam === exam.code;
                return (
                  <button
                    key={exam.code}
                    type="button"
                    onClick={() => setTargetExam(exam.code)}
                    className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-base block leading-none">{exam.emoji}</span>
                    <span className="font-semibold mt-1 block leading-tight">{exam.short}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {exam.subjects.slice(0, 3).join(" · ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">{t("settings.dailyHours")}</Label>
            <Input
              id="hours"
              type="number"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              min={1}
              max={16}
            />
          </div>

          <Button onClick={handleSave} className="mt-4">
            <Save className="w-4 h-4 mr-2" /> {t("common.save")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" /> {t("settings.appPrefs")}
          </CardTitle>
          <CardDescription>{t("settings.appPrefsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div>
              <Label className="text-base">{t("common.language")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("login.langHelp")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const active = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      updateProfile({ language: lang.code });
                    }}
                    className={`px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span className="font-semibold">{lang.native}</span>
                    {!active && <span className="text-[10px] ml-1 opacity-70">{lang.label}</span>}
                  </button>
                );
              })}
            </div>
            <Badge variant="outline" className="text-xs">
              {LANGUAGES.find((l) => l.code === language)?.greeting} — {t("settings.mentorGreets")}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">{t("settings.darkMode")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.darkModeDesc")}</p>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">{t("settings.liteMode")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.liteModeDesc")}
              </p>
            </div>
            <Switch checked={isLiteMode} onCheckedChange={setIsLiteMode} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> {t("settings.progress")}
          </CardTitle>
          <CardDescription>{t("settings.progressDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleResetProgress}>
            <RefreshCw className="w-4 h-4 mr-2" /> {t("settings.resetProgress")}
          </Button>
        </CardContent>
      </Card>

      <div className="pt-4">
        <Button
          variant="outline"
          onClick={logout}
          className="w-full sm:w-auto bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20"
        >
          <LogOut className="w-4 h-4 mr-2" /> {t("common.logout")}
        </Button>
      </div>
    </div>
  );
}
