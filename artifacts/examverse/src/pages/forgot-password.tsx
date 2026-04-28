import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Mail, Sparkles, Send, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, ApiError } from "@/lib/api";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await authApi.forgotPassword(data.email);
      setSubmitted(true);
      if (res.resetToken) setDevToken(res.resetToken);
    } catch (e) {
      if (e instanceof ApiError) {
        setServerError(e.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
          <div className="px-7 pt-7 pb-2">
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
            <div className="flex items-center gap-2 mt-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Account recovery</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the email you signed up with. We'll send a secure link to set a new password.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="px-7 pb-7 space-y-4 pt-4">
              {serverError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {serverError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  className={`rounded-xl h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full rounded-xl h-11 font-medium gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                Send reset link
              </Button>
              <p className="text-center text-xs text-muted-foreground pt-1">
                Remembered it?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          ) : (
            <div className="px-7 pb-7 pt-4 space-y-4">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
                <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                  <Sparkles className="w-4 h-4 text-primary" /> Check your inbox
                </div>
                <p className="text-muted-foreground">
                  If that email is registered, we've just sent a reset link. The link expires in 30 minutes.
                </p>
              </div>
              {devToken && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs">
                  <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                    Dev preview · skip the email
                  </p>
                  <p className="text-amber-900/80 dark:text-amber-200/80 mb-2">
                    Email isn't wired up yet, so use this one-time link:
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-lg h-9 text-xs"
                    onClick={() => setLocation(`/reset-password?token=${devToken}`)}
                  >
                    Open reset link →
                  </Button>
                </div>
              )}
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-xl h-11">
                  Back to sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
