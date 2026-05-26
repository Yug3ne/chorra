import { query } from "./_generated/server";

/**
 * Get the current user's identity
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return {
      id: identity.tokenIdentifier,
      email: identity.email || "",
      name: identity.name || "",
      image: identity.picture || "",
    };
  },
});
