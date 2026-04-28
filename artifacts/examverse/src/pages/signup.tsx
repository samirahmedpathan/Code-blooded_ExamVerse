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
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout, TornEdgeDivider } from "@/components/layout/auth-layout";
import { Logo } from "@/components/logo";

import { useAuth } from "@/lib/auth";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and policies" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      agreeTerms: undefined,
    }
  });

  const agreeTerms = watch("agreeTerms");

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    // Fake backend delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    signup(data.fullName, data.email);
  };

  return (
    <AuthLayout>
      <div className="bg-primary/5 pt-8 pb-6 px-8">
        <Logo />
      </div>
      
      <TornEdgeDivider />

      <div className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Jane Doe"
              className={`rounded-lg h-10 ${errors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
              className={`rounded-lg h-10 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`rounded-lg h-10 pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`rounded-lg h-10 pr-10 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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

          <div className="flex items-start space-x-2 pt-1">
            <Checkbox 
              id="agreeTerms" 
              checked={agreeTerms === true}
              onCheckedChange={(checked) => setValue("agreeTerms", checked === true, { shouldValidate: true })}
              className="mt-1"
            />
            <Label htmlFor="agreeTerms" className="text-sm font-normal text-muted-foreground leading-snug">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline underline-offset-2">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline underline-offset-2">Privacy Policy</a>
            </Label>
          </div>

          <motion.div whileTap={isValid && agreeTerms ? { scale: 0.98 } : {}}>
            <Button
              type="submit"
              className="w-full rounded-lg h-11 font-medium mt-4"
              disabled={!isValid || !agreeTerms || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
              Sign Up
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
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
            Log In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
