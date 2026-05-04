import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Log in the user by checking the password against the Convex environment variable
export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    // We expect the user to have set ADMIN_PASSWORD in the Convex dashboard
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error("Admin password is not configured on the server.");
    }

    if (args.password !== adminPassword) {
      throw new Error("Incorrect password.");
    }

    // Generate a simple session token
    // Using a random string since crypto.randomUUID might not be available in all V8 isolates in Convex, but it is supported in recent versions.
    // Alternatively, Math.random() + Date.now() for simplicity if it's just a basic admin check.
    const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Save the session
    await ctx.db.insert("sessions", {
      token,
      createdAt: Date.now(),
    });

    return token;
  },
});

// Verify if a token is valid
export const verifySession = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return false;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    return session !== null;
  },
});

// Log out the user by deleting their session
export const logout = mutation({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token!))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});
