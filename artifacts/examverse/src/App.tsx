import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";

import { AuthProvider } from "@/lib/auth";
import { ProgressProvider } from "@/lib/progress";
import { I18nProvider } from "@/lib/i18n";
import { AppLayout } from "@/components/layout/app-layout";
import { StudyBackdrop } from "@/components/study-backdrop";

import Dashboard from "@/pages/app/dashboard";
import Roadmap from "@/pages/app/roadmap";
import Scheduler from "@/pages/app/scheduler";
import MoodPlanner from "@/pages/app/mood";
import Quizzes from "@/pages/app/quizzes";
import QuizPlayer from "@/pages/app/quiz-player";
import Analytics from "@/pages/app/analytics";
import Challenges from "@/pages/app/challenges";
import Resources from "@/pages/app/resources";
import Mentor from "@/pages/app/mentor";
import Settings from "@/pages/app/settings";
import CurrentAffairs from "@/pages/app/current-affairs";
import Schemes from "@/pages/app/schemes";
import Careers from "@/pages/app/careers";

const queryClient = new QueryClient();

function AppRoute({ component: Component }: { component: any }) {
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route path="/app">
          <AppRoute component={Dashboard} />
        </Route>
        <Route path="/app/roadmap">
          <AppRoute component={Roadmap} />
        </Route>
        <Route path="/app/scheduler">
          <AppRoute component={Scheduler} />
        </Route>
        <Route path="/app/mood">
          <AppRoute component={MoodPlanner} />
        </Route>
        <Route path="/app/quizzes">
          <AppRoute component={Quizzes} />
        </Route>
        <Route path="/app/quizzes/:id">
          <AppRoute component={QuizPlayer} />
        </Route>
        <Route path="/app/analytics">
          <AppRoute component={Analytics} />
        </Route>
        <Route path="/app/challenges">
          <AppRoute component={Challenges} />
        </Route>
        <Route path="/app/current-affairs">
          <AppRoute component={CurrentAffairs} />
        </Route>
        <Route path="/app/schemes">
          <AppRoute component={Schemes} />
        </Route>
        <Route path="/app/careers">
          <AppRoute component={Careers} />
        </Route>
        <Route path="/app/resources">
          <AppRoute component={Resources} />
        </Route>
        <Route path="/app/mentor">
          <AppRoute component={Mentor} />
        </Route>
        <Route path="/app/settings">
          <AppRoute component={Settings} />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <I18nProvider>
              <ProgressProvider>
                <StudyBackdrop />
                <Router />
                <Toaster />
              </ProgressProvider>
            </I18nProvider>
          </AuthProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
