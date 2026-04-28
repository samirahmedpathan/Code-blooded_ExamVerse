import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { BookOpen, BookCheck, LineChart, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-primary" strokeWidth={2} />
          <span className="font-bold text-xl tracking-tight text-foreground">Examverse</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="text-sm">
            <Button size="sm" className="rounded-full px-5">Sign Up</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();

  // Redirect to app if already authenticated
  useEffect(() => {
    const token = localStorage.getItem("examverse:token");
    if (token) {
      setLocation("/app");
    }
  }, [setLocation]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                The calm way to pass your exams
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
                Master your materials with a focused study companion.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
                Examverse brings clarity to your preparation. Quiet the noise, focus on what matters, and build the confidence you need to succeed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto rounded-full text-base px-8 h-12 shadow-sm">
                    Start Learning Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full text-base px-8 h-12">
                    Log In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-3xl rounded-[100%]"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card px-4 md:px-6 border-y border-border">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to succeed</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A carefully crafted set of tools designed to maximize your retention and minimize study anxiety.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BookCheck className="w-8 h-8 text-primary" />,
                  title: "Smart Practice Tests",
                  desc: "Adaptive questions that focus on your weak areas, ensuring your study time is spent where it matters most."
                },
                {
                  icon: <LineChart className="w-8 h-8 text-primary" />,
                  title: "Progress Insights",
                  desc: "Clear, encouraging visuals showing how far you've come and exactly what you need to review before test day."
                },
                {
                  icon: <Target className="w-8 h-8 text-primary" />,
                  title: "Spaced Repetition",
                  desc: "Our algorithm schedules reviews at the perfect moment to lock concepts into your long-term memory."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Ready to ace your next exam?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of students who have traded study anxiety for calm confidence.
              </p>
              <Link href="/signup">
                <Button size="lg" className="rounded-full text-lg px-10 h-14 shadow-md hover:shadow-lg transition-all">
                  Create Your Free Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">Examverse</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Examverse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
