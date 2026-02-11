"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Building2,
    Briefcase,
    Camera,
    Loader2,
    Check,
    Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

type Step = 1 | 2 | 3;

export default function BrandSignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const industries = [
        "Technology",
        "Fashion & Apparel",
        "Food & Beverage",
        "Health & Fitness",
        "Entertainment",
        "Education",
        "Finance",
        "Travel & Tourism",
        "Automotive",
        "Real Estate",
        "E-Commerce",
        "Other",
    ];

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            brandName: "",
            industry: "",
            logo: "",
            walletCurrency: "ETB",
            website: "",
            description: "",
        },
        onSubmit: async ({ value }) => {
            setServerError("");
            try {
                // TODO: Replace with actual registration logic
                await new Promise((resolve) => setTimeout(resolve, 1500));
                router.push("/dashboard");
            } catch (err) {
                setServerError("Something went wrong. Please try again.");
            }
        },
    });

    const handleNext = async () => {
        const values = form.state.values;
        if (step === 1) {
            if (!values.email || !values.password || !values.confirmPassword) {
                setServerError("Please fill in account details.");
                return;
            }
            if (!/\S+@\S+\.\S+/.test(values.email)) {
                setServerError("Invalid email address.");
                return;
            }
            if (values.password.length < 8) {
                setServerError("Password must be at least 8 characters.");
                return;
            }
            if (values.password !== values.confirmPassword) {
                setServerError("Passwords do not match.");
                return;
            }
        }
        if (step === 2) {
            if (!values.brandName || !values.industry) {
                setServerError("Please fill in brand profile.");
                return;
            }
        }
        setServerError("");
        setStep((step + 1) as Step);
    };

    const handleBack = () => {
        if (step === 1) {
            router.push("/signup");
        } else {
            setStep((step - 1) as Step);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-400 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <header className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto relative z-10">
                <Link href="/landingPage" className="flex items-center">
                    <span className="font-austrisa text-5xl bg-gradient-to-br from-black from-[15%] via-black/80 to-lime-400 to-[85%] bg-clip-text text-transparent inline-block px-4 py-3 leading-normal translate-y-1.5">
                        AV
                    </span>
                </Link>
                <Link
                    href="/login"
                    className="text-sm font-bold text-gray-500 hover:text-black transition-colors"
                >
                    Already have an account?{" "}
                    <span className="text-black underline underline-offset-4">
                        Log in
                    </span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 pb-16 relative z-10">
                <div className="w-full max-w-lg">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {step === 1 ? "Choose role" : "Back"}
                    </button>

                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-lime-400" />
                            </div>
                            <h1 className="text-3xl font-moralana text-black">
                                Create Brand Account
                            </h1>
                        </div>
                        <p className="text-gray-500">
                            Step {step} of 3 —{" "}
                            {step === 1
                                ? "Account credentials"
                                : step === 2
                                    ? "Brand profile"
                                    : "Additional details"}
                        </p>
                    </div>

                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition-all duration-500",
                                    s <= step ? "bg-lime-400" : "bg-gray-200"
                                )}
                            />
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                            {/* Step 1: Account */}
                            {step === 1 && (
                                <div className="space-y-5">
                                    <form.Field
                                        name="email"
                                        validators={{
                                            onChange: ({ value }) => !value ? "Email is required" : !/\S+@\S+\.\S+/.test(value) ? "Invalid email address" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="email"
                                                    placeholder="brand@company.com"
                                                    className={cn(
                                                        "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm",
                                                        field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                    )}
                                                    autoComplete="email"
                                                />
                                                {field.state.meta.errors.length ? (
                                                    <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                ) : null}
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="password"
                                        validators={{
                                            onChange: ({ value }) => !value ? "Password is required" : value.length < 8 ? "Password must be at least 8 characters" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Minimum 8 characters"
                                                        className={cn(
                                                            "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm pr-12",
                                                            field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                        )}
                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                                {field.state.meta.errors.length ? (
                                                    <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                ) : null}
                                                <div className="flex gap-1.5 mt-2">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={cn(
                                                                "h-1 flex-1 rounded-full transition-colors",
                                                                field.state.value.length >= i * 3
                                                                    ? field.state.value.length >= 10
                                                                        ? "bg-lime-400"
                                                                        : "bg-yellow-400"
                                                                    : "bg-gray-200"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="confirmPassword"
                                        validators={{
                                            onChange: ({ value, fieldApi }) => {
                                                if (!value) return "Confirm your password";
                                                if (value !== fieldApi.form.getFieldValue("password")) return "Passwords do not match";
                                                return undefined;
                                            }
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Confirm Password
                                                </label>
                                                <input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="password"
                                                    placeholder="Re-enter your password"
                                                    className={cn(
                                                        "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm",
                                                        field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                    )}
                                                    autoComplete="new-password"
                                                />
                                                {field.state.meta.errors.length ? (
                                                    <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                ) : null}
                                            </div>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Step 2: Brand Profile */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <form.Field
                                        name="logo"
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Brand Logo
                                                </label>
                                                <div className="flex items-center gap-5">
                                                    <div className="relative group">
                                                        <div className="h-20 w-20 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xl border border-gray-100 overflow-hidden">
                                                            {field.state.value ? (
                                                                <img
                                                                    src={field.state.value}
                                                                    alt="Logo preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                form.state.values.brandName.substring(0, 2).toUpperCase() || "?"
                                                            )}
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/50 rounded-[1.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                            <Camera className="h-5 w-5 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            type="text"
                                                            placeholder="https://example.com/logo.png"
                                                            className={cn(
                                                                "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm",
                                                                field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                            )}
                                                        />
                                                        {field.state.meta.errors.length ? (
                                                            <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                        ) : (
                                                            <p className="text-xs text-gray-400 mt-1">Paste a URL for now. File upload coming soon.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="brandName"
                                        validators={{
                                            onChange: ({ value }) => !value ? "Brand name is required" : value.length < 2 ? "Brand name is too short" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    <Building2 className="inline h-4 w-4 mr-1.5 text-gray-400" />
                                                    Brand Name
                                                </label>
                                                <input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="text"
                                                    placeholder="Your brand or company name"
                                                    className={cn(
                                                        "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm",
                                                        field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                    )}
                                                />
                                                {field.state.meta.errors.length ? (
                                                    <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                ) : null}
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="industry"
                                        validators={{
                                            onChange: ({ value }) => !value ? "Industry is required" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    <Briefcase className="inline h-4 w-4 mr-1.5 text-gray-400" />
                                                    Industry
                                                </label>
                                                <select
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    className={cn(
                                                        "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm appearance-none",
                                                        field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                    )}
                                                >
                                                    <option value="">Select industry</option>
                                                    {industries.map((ind) => (
                                                        <option key={ind} value={ind}>
                                                            {ind}
                                                        </option>
                                                    ))}
                                                </select>
                                                {field.state.meta.errors.length ? (
                                                    <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                ) : null}
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="walletCurrency"
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    <Wallet className="inline h-4 w-4 mr-1.5 text-gray-400" />
                                                    Preferred Currency
                                                </label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {["ETB", "USD", "EUR"].map((cur) => (
                                                        <button
                                                            key={cur}
                                                            type="button"
                                                            onClick={() => field.handleChange(cur)}
                                                            className={cn(
                                                                "py-3 rounded-xl font-bold text-sm border-2 transition-all",
                                                                field.state.value === cur
                                                                    ? "border-lime-400 bg-lime-50 text-black"
                                                                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                                                            )}
                                                        >
                                                            {cur}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Step 3: Additional Details */}
                            {step === 3 && (
                                <div className="space-y-5">
                                    <form.Field
                                        name="website"
                                        validators={{
                                            onChange: ({ value }) => value && !/^https?:\/\/.+/.test(value) ? "Invalid website URL" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Website (Optional)
                                                </label>
                                                <input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="url"
                                                    placeholder="https://yourbrand.com"
                                                    className={cn(
                                                        "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm",
                                                        field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                    )}
                                                />
                                                {field.state.meta.errors.length ? (
                                                    <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                ) : null}
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="description"
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    About Your Brand (Optional)
                                                </label>
                                                <textarea
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    rows={4}
                                                    placeholder="Tell creators what your brand is about..."
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm resize-none"
                                                />
                                            </div>
                                        )}
                                    />

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                            Account Summary
                                        </p>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center border border-gray-100 font-bold text-lg text-gray-400 overflow-hidden flex-shrink-0">
                                                {form.state.values.logo ? (
                                                    <img
                                                        src={form.state.values.logo}
                                                        alt="Logo"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    form.state.values.brandName.substring(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black text-lg">
                                                    {form.state.values.brandName || "Untitled Brand"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {form.state.values.industry || "No Industry"} • {form.state.values.walletCurrency}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Check className="h-3.5 w-3.5 text-lime-500" />
                                            <span>{form.state.values.email}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {serverError && (
                                <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                    {serverError}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full py-4 bg-black text-white font-bold rounded-full shadow-lg shadow-black/10 hover:bg-lime-400 hover:text-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <button
                                            type="submit"
                                            disabled={!canSubmit || isSubmitting}
                                            className="w-full py-4 bg-black text-white font-bold rounded-full shadow-lg shadow-black/10 hover:bg-lime-400 hover:text-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Create Brand Account
                                                    <ArrowRight className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                />
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
