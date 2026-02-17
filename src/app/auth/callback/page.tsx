"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createBrand = useMutation(api.brands.createBrand);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current session
        const session = await authClient.getSession();
        
        if (session?.data?.user) {
          const user = session.data.user;
          // Check if this is a new Google OAuth user
          const isGoogleUser = searchParams.get("provider") === "google";
          
          if (isGoogleUser) {
            // Create brand profile for Google OAuth users
            await createBrand({
              userId: user.id,
              email: user.email,
              name: user.name || user.email.split("@")[0],
              logo: user.image || "",
              industry: "",
              website: "",
              description: "",
              walletCurrency: "ETB",
            });
          }
          
          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          // No session, redirect to signup
          router.push("/signup");
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/signup?error=callback_failed");
      }
    };

    handleCallback();
  }, [router, searchParams, createBrand]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
        <p className="mt-4 text-gray-600 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
