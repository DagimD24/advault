import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth"; 
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    secret: process.env.BETTER_AUTH_SECRET!,
    
    // 1. The Adapter (This connects Better-Auth to your Convex DB)
    database: authComponent.adapter(ctx),
    
    // 2. Email & Password Logic
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Set to true if you want email verification
    },
    
    // 3. Social Providers
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    
    // 4. The Plugin (Required for the Component to work)
    plugins: [
      convex({ authConfig }),
    ],
  });
};

// Helper to get the current user in your queries
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});