import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout, TornEdgeDivider } from "@/components/layout/auth-layout";
import { Logo } from "@/components/logo";

import { useAuth } from "@/lib/auth";

const loginSchema = z.object({
  emailOrName: z.string().min(1, "Name or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Fake backend delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    login(data.emailOrName);
  };

  return (
    <AuthLayout>
      <div className="bg-primary/5 pt-10 pb-8 px-8">
        <Logo />
      </div>
      
      <TornEdgeDivider />

      <div className="px-8 pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="emailOrName">Name or Email</Label>
            <Input
              id="emailOrName"
              placeholder="student@example.com"
              className={`rounded-lg h-11 ${errors.emailOrName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register("emailOrName")}
            />
            {errors.emailOrName && (
              <p className="text-sm text-destructive">{errors.emailOrName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary font-medium hover:underline underline-offset-4">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`rounded-lg h-11 pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full rounded-lg h-11 font-medium mt-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
              Log In
            </Button>
          </motion.div>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <motion.div whileTap={{ scale: 0.98 }} className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-lg h-11 bg-card hover:bg-muted/50 font-medium"
          >
            <FcGoogle className="mr-2 w-5 h-5" />
            Continue with Google
          </Button>
        </motion.div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline underline-offset-4">
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
