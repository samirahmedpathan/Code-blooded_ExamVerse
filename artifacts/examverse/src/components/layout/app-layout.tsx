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
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

const NAV_ITEMS = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/roadmap", label: "Roadmap", icon: MapIcon },
  { href: "/app/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/app/mood", label: "Mood", icon: Smile },
  { href: "/app/quizzes", label: "Quizzes", icon: BookOpen },
  { href: "/app/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/app/challenges", label: "Challenges", icon: Trophy },
  { href: "/app/resources", label: "Resources", icon: Library },
  { href: "/app/mentor", label: "AI Mentor", icon: MessageSquare },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authed = localStorage.getItem("examverse:authed");
    if (authed !== "true") {
      setLocation("/login");
    }
  }, [location, setLocation]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/app" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
          <BookOpen className="w-6 h-6 text-primary" strokeWidth={2} />
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">Examverse</span>
        </Link>
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
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <Link href="/app/settings" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
            location === "/app/settings" 
              ? "bg-sidebar-accent text-sidebar-accent-foreground" 
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
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
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  if (!user) return null; // Or a loading spinner

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
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
            
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources, quizzes..."
                className="w-full bg-muted/50 border-none pl-9 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/app/challenges">
              <div className="flex items-center space-x-1.5 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-orange-500/20 transition-colors">
                <Trophy className="w-4 h-4" />
                <span>3 Day Streak!</span>
              </div>
            </Link>
            <Link href="/app/mood">
              <div className="hidden sm:flex items-center space-x-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                <Smile className="w-4 h-4" />
                <span>Good</span>
              </div>
            </Link>
            <Link href="/app/settings">
              <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity border border-border">
                <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page Content */}
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
