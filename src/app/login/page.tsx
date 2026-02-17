"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<"Brand" | "Creator">("Brand");
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            setServerError("");
            try {
                // Validate manually if needed, but form should have already validated
                const result = loginSchema.safeParse(value);
                if (!result.success) return;

                // TODO: Replace with actual authentication logic (e.g., Convex/Clerk)
                await new Promise((resolve) => setTimeout(resolve, 1500));

                if (role === "Brand") {
                    router.push("/dashboard");
                } else {
                    router.push("/creator/dashboard");
                }
            } catch (err) {
                setServerError("Invalid email or password. Please try again.");
            }
        },
    });

    return (
        <div className="min-h-screen font-jost bg-background flex flex-col">
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-400 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lime-400 rounded-full blur-[150px] opacity-10 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <header className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto relative z-10">
                <Link href="/landingPage" className="flex items-center">
                    <span className="font-austrisa text-5xl bg-gradient-to-br from-black from-[15%] via-black/80 to-lime-400 to-[85%] bg-clip-text text-transparent inline-block px-4 py-3 leading-normal translate-y-1.5">
                        AV
                    </span>
                </Link>
                <Link
                    href="/signup"
                    className="text-sm font-bold text-gray-500 hover:text-black transition-colors"
                >
                    Don't have an account?{" "}
                    <span className="text-black underline underline-offset-4">
                        Sign up
                    </span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 pb-16 relative z-10">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-lime-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-lime-400/20 shadow-lg shadow-black/10">
                            <ShieldCheck className="h-3 w-3" />
                            Secure Portal
                        </div>
                        <h1 className="text-5xl font-moralana text-black mb-3">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Log in to your AdVault account
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden group">
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 relative z-10 border border-gray-100">
                            {(["Brand", "Creator"] as const).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={cn(
                                        "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                                        role === r
                                            ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                                            : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-6 relative z-10"
                        >
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) return "Email is required";
                                        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address";
                                        return undefined;
                                    }
                                }}
                                children={(field) => (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2.5 ml-1">
                                            Email Address
                                        </label>
                                        <div className="relative group/field">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-lime-500 transition-colors">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <input
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                type="email"
                                                className={cn(
                                                    "w-full pl-14 pr-6 py-4 bg-gray-50 border rounded-[1.25rem] text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium",
                                                    field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                )}
                                                placeholder="name@company.com"
                                                autoComplete="email"
                                            />
                                        </div>
                                        {field.state.meta.errors.length ? (
                                            <p className="text-red-500 text-xs mt-2 ml-1 font-bold flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {field.state.meta.errors[0]}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            />

                            <form.Field
                                name="password"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) return "Password is required";
                                        if (value.length < 8) return "Password must be at least 8 characters";
                                        return undefined;
                                    }
                                }}
                                children={(field) => (
                                    <div>
                                        <div className="flex items-center justify-between mb-2.5 ml-1">
                                            <label className="text-sm font-bold text-gray-700">
                                                Password
                                            </label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs font-bold text-gray-400 hover:text-black transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative group/field">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-lime-500 transition-colors">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <input
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                type={showPassword ? "text" : "password"}
                                                className={cn(
                                                    "w-full pl-14 pr-14 py-4 bg-gray-50 border rounded-[1.25rem] text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium",
                                                    field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                )}
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {field.state.meta.errors.length ? (
                                            <p className="text-red-500 text-xs mt-2 ml-1 font-bold flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {field.state.meta.errors[0]}
                                            </p>
                                        ) : null}
                                    </div>
                                )}
                            />

                            {serverError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {serverError}
                                </div>
                            )}

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                                children={([canSubmit, isSubmitting]) => (
                                    <button
                                        type="submit"
                                        disabled={!canSubmit || isSubmitting}
                                        className="w-full py-5 bg-black text-white font-bold rounded-[1.5rem] shadow-xl shadow-black/10 hover:bg-lime-400 hover:text-black transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Log in as {role}
                                                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                )}
                            />
                        </form>

                        {/* Divider */}
                        <div className="relative z-10 my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-bold">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Sign-On Button */}
                        <div className="relative z-10">
                            <button
                                type="button"
                                onClick={() => {
                                    // TODO: Implement Google OAuth
                                    window.location.href = '/api/auth/signin/google';
                                }}
                                className="w-full py-4 px-6 bg-gray-50 border-2 border-gray-200/50 text-gray-700 font-bold rounded-[1.5rem] hover:bg-lime-50 hover:border-lime-400 transition-all duration-300 flex items-center justify-center gap-3 group shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="group-hover:text-black transition-colors">Continue with Google</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center mt-10 text-gray-400 text-sm font-medium">
                        By logging in, you agree to our{" "}
                        <Link href="/terms" className="text-black hover:underline underline-offset-4">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-black hover:underline underline-offset-4"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
