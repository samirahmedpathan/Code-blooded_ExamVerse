import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ArrowRight,
  Target,
  Globe2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { EXAMS, LANGUAGES } from "@/lib/exams";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms and policies" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { signup } = useAuth();
  const { t } = useT();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [targetExam, setTargetExam] = useState<string>("JEE");
  const [language, setLanguage] = useState<string>("EN");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { agreeTerms: undefined },
  });

  const agreeTerms = watch("agreeTerms");

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);
    setIsLoading(true);
    try {
      await signup({
        name: data.fullName,
        email: data.email,
        password: data.password,
        targetExam,
        language,
      });
    } catch (e) {
      if (e instanceof ApiError) {
        setServerError(e.message);
      } else {
        setServerError("Could not create your account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-2 bg-background overflow-hidden">
      <aside className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-primary via-emerald-700 to-teal-800 text-white">
        <motion.div
          className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-amber-300/25 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-16 w-[460px] h-[460px] rounded-full bg-emerald-300/30 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Examverse</span>
        </div>

        <div className="relative z-10 max-w-md space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Free to start
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Your AI mentor.<br />Your exam.<br />Your language.
          </h1>
          <p className="text-white/80 leading-relaxed">
            Get a personalized roadmap in under a minute. Daily credits, smart
            quizzes, current affairs, and a mentor that actually listens.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 text-sm max-w-sm">
          <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-3">
            <p className="font-semibold">5+ languages</p>
            <p className="text-xs text-white/70">EN · HI · KN · TA · TE</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-3">
            <p className="font-semibold">12+ exams</p>
            <p className="text-xs text-white/70">JEE · NEET · UPSC · GATE · KCET · TNPSC · TSPSC</p>
          </div>
        </div>
      </aside>

      <main className="flex flex-col items-center justify-center p-6 md:p-10 relative">
        <div className="lg:hidden absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-primary to-emerald-700 -z-0" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden flex items-center justify-center gap-2 text-white mb-8">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-xl">Examverse</span>
          </div>

          <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
            <div className="px-7 pt-7 pb-4">
              <h2 className="text-2xl font-bold tracking-tight">{t("signup.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("signup.sub")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-7 pb-7 space-y-4">
              {serverError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Your name"
                  className={`rounded-xl h-10 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  className={`rounded-xl h-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      className={`rounded-xl h-10 pr-9 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      className={`rounded-xl h-10 pr-9 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="w-4 h-4 text-primary" /> Target exam
                </Label>
                <div className="grid grid-cols-3 gap-1.5 max-h-[170px] overflow-y-auto pr-1">
                  {EXAMS.map((exam) => {
                    const active = targetExam === exam.code;
                    return (
                      <button
                        key={exam.code}
                        type="button"
                        onClick={() => setTargetExam(exam.code)}
                        className={`text-left p-2 rounded-lg border text-xs transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="text-base block leading-none">{exam.emoji}</span>
                        <span className="font-semibold mt-1 block leading-tight">{exam.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold">
                  <Globe2 className="w-4 h-4 text-primary" /> Language
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((lang) => {
                    const active = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        {lang.native}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <Checkbox
                  id="agreeTerms"
                  checked={agreeTerms === true}
                  onCheckedChange={(checked) => {
                    if (checked === true) {
                      setValue("agreeTerms", true, { shouldValidate: true });
                    } else {
                      setValue("agreeTerms", undefined as unknown as true, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  className="mt-1"
                />
                <Label htmlFor="agreeTerms" className="text-sm font-normal text-muted-foreground leading-snug">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">Terms</a>
                  {" "}and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </Label>
              </div>
              {errors.agreeTerms && (
                <p className="text-xs text-destructive">{errors.agreeTerms.message}</p>
              )}

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full rounded-xl h-11 font-medium mt-2 gap-2"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                  {t("common.signUp")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl h-11 font-medium"
              >
                <FcGoogle className="mr-2 w-5 h-5" />
                Continue with Google
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                  Log In
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
