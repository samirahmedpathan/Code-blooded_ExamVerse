import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

import { AuthProvider } from "@/lib/auth";
import { AppLayout } from "@/components/layout/app-layout";

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

const queryClient = new QueryClient();

// A wrapper for app routes to enforce layout
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
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {/* Authenticated App Routes */}
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
            <Router />
            <Toaster />
          </AuthProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
