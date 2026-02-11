"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Sparkles,
    Camera,
    Loader2,
    Check,
    DollarSign,
    Users,
    BarChart3,
    Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";

type Step = 1 | 2 | 3;

export default function CreatorSignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const platforms = [
        { id: "YouTube", icon: "▶", color: "bg-red-50 border-red-200 text-red-600" },
        { id: "TikTok", icon: "♪", color: "bg-gray-900 border-gray-800 text-white" },
        { id: "Instagram", icon: "◉", color: "bg-pink-50 border-pink-200 text-pink-600" },
        { id: "Telegram", icon: "✈", color: "bg-blue-50 border-blue-200 text-blue-600" },
        { id: "Twitter", icon: "𝕏", color: "bg-gray-50 border-gray-200 text-black" },
    ];

    const categories = [
        "Gaming", "Lifestyle", "Tech", "Travel", "Finance",
        "Entertainment", "Education", "Food", "Fashion",
        "Health & Fitness", "Music", "Comedy",
    ];

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            bio: "",
            avatar: "",
            platform: "",
            category: "",
            followers: "",
            views: "",
            startingPrice: "",
            currency: "ETB",
            availableSlots: "3",
        },
        onSubmit: async ({ value }) => {
            setServerError("");
            try {
                // TODO: Replace with actual registration logic
                await new Promise((resolve) => setTimeout(resolve, 1500));
                router.push("/creator/dashboard");
            } catch (err) {
                setServerError("Something went wrong. Please try again.");
            }
        },
    });

    const getInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

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
            if (!values.name || !values.platform || !values.category) {
                setServerError("Please fill in profile details.");
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
                                <Sparkles className="h-5 w-5 text-lime-400" />
                            </div>
                            <h1 className="text-3xl font-moralana text-black">
                                Create Creator Account
                            </h1>
                        </div>
                        <p className="text-gray-500">
                            Step {step} of 3 —{" "}
                            {step === 1
                                ? "Account credentials"
                                : step === 2
                                    ? "Your profile"
                                    : "Professional details"}
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
                                                    placeholder="creator@email.com"
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
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="confirmPassword"
                                        validators={{
                                            onChange: ({ value, fieldApi }) => !value ? "Confirm your password" : value !== fieldApi.form.getFieldValue("password") ? "Passwords do not match" : undefined
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

                            {/* Step 2: Profile */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <form.Field
                                        name="avatar"
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Profile Photo
                                                </label>
                                                <div className="flex items-center gap-5">
                                                    <div className="relative group">
                                                        <div className="h-20 w-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xl border border-gray-100 overflow-hidden">
                                                            {field.state.value ? (
                                                                <img
                                                                    src={field.state.value}
                                                                    alt="Avatar preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                getInitials(form.state.values.name) || "?"
                                                            )}
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                            <Camera className="h-5 w-5 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            type="text"
                                                            placeholder="https://example.com/avatar.jpg"
                                                            className={cn(
                                                                "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm",
                                                                field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                            )}
                                                        />
                                                        {field.state.meta.errors.length ? (
                                                            <p className="text-red-500 text-xs mt-1 font-bold">{field.state.meta.errors[0]}</p>
                                                        ) : (
                                                            <p className="text-xs text-gray-400 mt-1">Paste a URL. File upload soon.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="name"
                                        validators={{
                                            onChange: ({ value }) => !value ? "Name is required" : value.length < 2 ? "Name too short" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Full Name / Brand Name
                                                </label>
                                                <input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="text"
                                                    placeholder="e.g., Abel Creative"
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
                                        name="bio"
                                        validators={{
                                            onChange: ({ value }) => {
                                                if (value.length > 250) return "Bio too long";
                                                if (value && value.length < 10) return "Bio too short";
                                                return undefined;
                                            }
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Bio
                                                </label>
                                                <textarea
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    rows={3}
                                                    placeholder="Tell brands what makes you unique..."
                                                    className={cn(
                                                        "w-full px-5 py-3.5 bg-gray-50 border rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm resize-none",
                                                        field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                    )}
                                                />
                                                <div className="flex justify-between mt-1">
                                                    {field.state.meta.errors.length ? (
                                                        <p className="text-red-500 text-xs font-bold">{field.state.meta.errors[0]}</p>
                                                    ) : <div />}
                                                    <p className="text-xs text-gray-400">{field.state.value.length}/250</p>
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="platform"
                                        validators={{
                                            onChange: ({ value }) => !value ? "Platform is required" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Primary Platform
                                                </label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {platforms.map((p) => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => field.handleChange(p.id)}
                                                            className={cn(
                                                                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-xs font-bold",
                                                                field.state.value === p.id
                                                                    ? "border-lime-400 bg-lime-50 text-black shadow-sm"
                                                                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                                                            )}
                                                        >
                                                            <span className="text-lg">{p.icon}</span>
                                                            <span className="truncate w-full text-center">{p.id}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="category"
                                        validators={{
                                            onChange: ({ value }) => !value ? "Category is required" : undefined
                                        }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Content Category
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {categories.map((cat) => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => field.handleChange(cat)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                                                                field.state.value === cat
                                                                    ? "border-lime-400 bg-lime-50 text-black"
                                                                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                                                            )}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Step 3: Stats */}
                            {step === 3 && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <form.Field
                                            name="followers"
                                            validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}
                                            children={(field) => (
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                                                        Followers (e.g., 50K)
                                                    </label>
                                                    <input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        className={cn(
                                                            "w-full px-4 py-3 bg-gray-50 border rounded-xl text-black font-medium text-sm",
                                                            field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        />
                                        <form.Field
                                            name="views"
                                            validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}
                                            children={(field) => (
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                                                        Avg Views (e.g., 10K)
                                                    </label>
                                                    <input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        className={cn(
                                                            "w-full px-4 py-3 bg-gray-50 border rounded-xl text-black font-medium text-sm",
                                                            field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <form.Field
                                        name="startingPrice"
                                        validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Starting Price
                                                </label>
                                                <div className="flex gap-3">
                                                    <input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder="e.g., 5,000"
                                                        className={cn(
                                                            "flex-1 px-5 py-3.5 bg-gray-50 border rounded-xl text-black font-medium text-sm",
                                                            field.state.meta.errors.length ? "border-red-500" : "border-gray-200/50"
                                                        )}
                                                    />
                                                    <form.Field
                                                        name="currency"
                                                        children={(curField) => (
                                                            <div className="flex bg-gray-50 rounded-xl border border-gray-200/50 overflow-hidden">
                                                                {["ETB", "USD"].map((cur) => (
                                                                    <button
                                                                        key={cur}
                                                                        type="button"
                                                                        onClick={() => curField.handleChange(cur)}
                                                                        className={cn(
                                                                            "px-4 py-3.5 text-sm font-bold transition-all",
                                                                            curField.state.value === cur ? "bg-black text-white" : "text-gray-400"
                                                                        )}
                                                                    >
                                                                        {cur}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="availableSlots"
                                        children={(field) => (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Available Collaboration Slots
                                                </label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {["1", "2", "3", "4", "5+"].map((slot) => (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            onClick={() => field.handleChange(slot)}
                                                            className={cn(
                                                                "py-3 rounded-xl font-bold text-sm border-2 transition-all",
                                                                field.state.value === slot ? "border-lime-400 bg-lime-50 text-black" : "border-gray-100 bg-gray-50 text-gray-500"
                                                            )}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Profile Preview</p>
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-xl bg-white border border-gray-100 overflow-hidden">
                                                {form.state.values.avatar ? (
                                                    <img src={form.state.values.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                                ) : <div className="h-full w-full flex items-center justify-center font-bold text-gray-400">{getInitials(form.state.values.name) || "?"}</div>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">{form.state.values.name || "Untitled Creator"}</p>
                                                <p className="text-xs text-gray-500">{form.state.values.platform || "No Platform"} • {form.state.values.category || "No Category"}</p>
                                            </div>
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

                        <div className="mt-6">
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
                                            className="w-full py-4 bg-black text-white font-bold rounded-full shadow-lg shadow-black/10 hover:bg-lime-400 hover:text-black transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Create Creator Account <ArrowRight className="h-4 w-4" /></>}
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
