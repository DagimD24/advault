"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "brand" | "creator" | null;

export default function SignupPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role>(null);

    const handleContinue = () => {
        if (selectedRole === "brand") {
            router.push("/signup/brand");
        } else if (selectedRole === "creator") {
            router.push("/signup/creator");
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
            {/* Decorative blobs */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-lime-400 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-lime-300 rounded-full blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* Minimal Header */}
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

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 pb-16 relative z-10">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-moralana text-black mb-4">
                            Join AdVault
                        </h1>
                        <p className="text-gray-500 text-lg max-w-md mx-auto">
                            Choose how you want to use the platform. You can always switch
                            later.
                        </p>
                    </div>

                    {/* Role Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Brand Card */}
                        <button
                            type="button"
                            onClick={() => setSelectedRole("brand")}
                            className={cn(
                                "relative text-left bg-white rounded-[2rem] border-2 p-8 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1",
                                selectedRole === "brand"
                                    ? "border-lime-400 shadow-xl shadow-lime-400/10"
                                    : "border-gray-100 shadow-sm hover:border-gray-200"
                            )}
                        >
                            {/* Selection indicator */}
                            <div
                                className={cn(
                                    "absolute top-6 right-6 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedRole === "brand"
                                        ? "border-lime-500 bg-lime-500"
                                        : "border-gray-300 bg-white"
                                )}
                            >
                                {selectedRole === "brand" && (
                                    <Check className="h-4 w-4 text-white stroke-[3]" />
                                )}
                            </div>

                            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-lime-50 group-hover:border-lime-100 transition-colors">
                                <Building2 className="h-7 w-7 text-gray-600 group-hover:text-lime-600 transition-colors" />
                            </div>

                            <h3 className="text-2xl font-bold text-black mb-2">
                                I'm a Brand
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Find creators, launch campaigns, and grow your brand presence
                                across Ethiopia's top platforms.
                            </p>

                            <div className="space-y-2.5">
                                {[
                                    "Browse verified creators",
                                    "Launch & manage campaigns",
                                    "Secure escrow payments",
                                ].map((feat) => (
                                    <div key={feat} className="flex items-center gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="h-3 w-3 text-lime-600 stroke-[3]" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">
                                            {feat}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </button>

                        {/* Creator Card */}
                        <button
                            type="button"
                            onClick={() => setSelectedRole("creator")}
                            className={cn(
                                "relative text-left bg-white rounded-[2rem] border-2 p-8 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1",
                                selectedRole === "creator"
                                    ? "border-lime-400 shadow-xl shadow-lime-400/10"
                                    : "border-gray-100 shadow-sm hover:border-gray-200"
                            )}
                        >
                            {/* Selection indicator */}
                            <div
                                className={cn(
                                    "absolute top-6 right-6 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedRole === "creator"
                                        ? "border-lime-500 bg-lime-500"
                                        : "border-gray-300 bg-white"
                                )}
                            >
                                {selectedRole === "creator" && (
                                    <Check className="h-4 w-4 text-white stroke-[3]" />
                                )}
                            </div>

                            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-lime-50 group-hover:border-lime-100 transition-colors">
                                <Sparkles className="h-7 w-7 text-gray-600 group-hover:text-lime-600 transition-colors" />
                            </div>

                            <h3 className="text-2xl font-bold text-black mb-2">
                                I'm a Creator
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Monetize your audience, receive brand offers, and build your
                                professional portfolio.
                            </p>

                            <div className="space-y-2.5">
                                {[
                                    "Receive brand offers",
                                    "Apply to campaigns",
                                    "Track earnings & deals",
                                ].map((feat) => (
                                    <div key={feat} className="flex items-center gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="h-3 w-3 text-lime-600 stroke-[3]" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">
                                            {feat}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </button>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!selectedRole}
                        className={cn(
                            "w-full py-4 font-bold rounded-full shadow-lg transition-all duration-300 transform flex items-center justify-center gap-2 text-lg",
                            selectedRole
                                ? "bg-black text-white hover:bg-lime-400 hover:text-black hover:scale-[1.02] active:scale-[0.98] shadow-black/10"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        )}
                    >
                        Continue as {selectedRole === "brand" ? "Brand" : selectedRole === "creator" ? "Creator" : "…"}
                        <ArrowRight className="h-5 w-5" />
                    </button>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-8">
                        By creating an account, you agree to our{" "}
                        <span className="underline cursor-pointer">Terms of Service</span>{" "}
                        and{" "}
                        <span className="underline cursor-pointer">Privacy Policy</span>.
                    </p>
                </div>
            </main>
        </div>
    );
}
