import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Map as MapIcon,
  Calendar,
  Smile,
  BookOpen,
  BarChart2,
  Trophy,
  Library,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Menu,
  Newspaper,
  Sparkles,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { findExam, findLanguage } from "@/lib/exams";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const NAV_ITEMS = [
  { href: "/app", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/app/roadmap", labelKey: "nav.roadmap", icon: MapIcon },
  { href: "/app/scheduler", labelKey: "nav.scheduler", icon: Calendar },
  { href: "/app/mood", labelKey: "nav.mood", icon: Smile },
  { href: "/app/quizzes", labelKey: "nav.quizzes", icon: BookOpen },
  { href: "/app/current-affairs", labelKey: "nav.currentAffairs", icon: Newspaper },
  { href: "/app/analytics", labelKey: "nav.analytics", icon: BarChart2 },
  { href: "/app/challenges", labelKey: "nav.challenges", icon: Trophy },
  { href: "/app/resources", labelKey: "nav.resources", icon: Library },
  { href: "/app/mentor", labelKey: "nav.mentor", icon: MessageSquare },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { todayCredits, state, streak } = useProgress();
  const { t } = useT();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authed = localStorage.getItem("examverse:authed");
    if (authed !== "true") {
      setLocation("/login");
    }
  }, [location, setLocation]);

  const exam = user ? findExam(user.targetExam) : null;
  const lang = user ? findLanguage(user.language) : null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/app" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">Examverse</span>
        </Link>
        {exam && (
          <div className="mt-4 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 font-semibold">{t("common.exam")}</p>
            <p className="text-sm font-semibold text-sidebar-foreground mt-0.5 flex items-center gap-1.5">
              <span>{exam.emoji}</span> {exam.short}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/app");
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}>
                <item.icon className="w-5 h-5" />
                <span>{t(item.labelKey)}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border space-y-1">
        <div className="px-3 py-2 mb-2 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-[10px] uppercase tracking-wider text-primary/80 font-semibold">{t("common.credits")}</p>
          <p className="text-lg font-bold text-primary leading-tight">{state.totalCredits}</p>
          <p className="text-[10px] text-muted-foreground">+{todayCredits} {t("common.today")}</p>
        </div>
        <Link href="/app/settings" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            location === "/app/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}>
            <Settings className="w-5 h-5" />
            <span>{t("nav.settings")}</span>
          </div>
        </Link>
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            logout();
          }}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>{t("common.logout")}</span>
        </button>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 gap-3">
          <div className="flex items-center min-w-0">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="relative hidden sm:block w-56 md:w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources, quizzes..."
                className="w-full bg-muted/50 border-none pl-9 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/app/challenges">
              <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-2.5 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-orange-500/20 transition-colors">
                <Flame className="w-4 h-4" />
                <span>{streak} day{streak === 1 ? "" : "s"}</span>
              </div>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>{state.totalCredits}</span>
              <span className="text-[10px] opacity-70">+{todayCredits}</span>
            </div>
            {lang && (
              <span className="hidden md:inline text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {lang.native}
              </span>
            )}
            <Link href="/app/settings">
              <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity border border-border">
                <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-6xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
