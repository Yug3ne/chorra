import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// Helper: Get authenticated user identity
async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: user not authenticated");
  }
  return identity.tokenIdentifier;
}

// Helper: Generate next untitled name for user
async function getNextUntitledName(ctx: QueryCtx | MutationCtx, userId: string): Promise<string> {
  const sheets = await ctx.db
    .query("sheets")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();
  let counter = 0;
  let name = "Untitled";

  while (sheets.some((s) => s.title === name)) {
    counter++;
    name = `Untitled ${counter}`;
  }

  return name;
}

// Helper: Default tips element
const DEFAULT_TIPS_ELEMENT = {
  type: "text",
  text: "💡 Tip: Cmd+N for new sheet, Cmd+K to switch",
  x: 50,
  y: 50,
  width: 300,
  height: 100,
  fontSize: 14,
  opacity: 0.5,
  angle: 0,
  strokeColor: "#1e1e1e",
  backgroundColor: "transparent",
  fillStyle: "hachure",
  strokeWidth: 1,
  strokeStyle: "solid",
  roughness: 1,
  roundness: null,
  seed: Math.random(),
  versionNonce: Math.random(),
  isDeleted: false,
  boundElements: null,
  updated: Date.now(),
  link: null,
  locked: false,
};

/**
 * List user's sheets sorted by updatedAt (most recent first)
 */
export const listSheets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    const sheets = await ctx.db
      .query("sheets")
      .withIndex("by_userId_and_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return sheets.map((sheet) => ({
      id: sheet._id,
      title: sheet.title,
      updatedAt: sheet.updatedAt,
      createdAt: sheet.createdAt,
    }));
  },
});

/**
 * Get a single sheet with all its data
 */
export const getSheet = query({
  args: { sheetId: v.id("sheets") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const sheet = await ctx.db.get("sheets", args.sheetId);
    if (!sheet) {
      throw new Error("Sheet not found");
    }

    // Verify ownership
    if (sheet.userId !== userId) {
      throw new Error("Unauthorized: you do not own this sheet");
    }

    return {
      id: sheet._id,
      title: sheet.title,
      elements: sheet.elements,
      appState: sheet.appState,
      updatedAt: sheet.updatedAt,
      createdAt: sheet.createdAt,
    };
  },
});

/**
 * Create a new sheet with default tips
 */
export const createSheet = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    const title = await getNextUntitledName(ctx, userId);
    const now = Date.now();

    // Default elements with tips
    const defaultElements = [DEFAULT_TIPS_ELEMENT];

    // Create sheet record in database
    const sheetId = await ctx.db.insert("sheets", {
      title,
      userId,
      elements: defaultElements,
      appState: {
        zoom: { value: 1 },
        scrollX: 0,
        scrollY: 0,
      },
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: sheetId,
      title,
    };
  },
});

/**
 * Update sheet with new elements and appState
 */
export const updateSheet = mutation({
  args: {
    sheetId: v.id("sheets"),
    elements: v.any(),
    appState: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const sheet = await ctx.db.get("sheets", args.sheetId);
    if (!sheet) {
      throw new Error("Sheet not found");
    }

    // Verify ownership
    if (sheet.userId !== userId) {
      throw new Error("Unauthorized: you do not own this sheet");
    }

    // Update sheet with new elements and appState
    await ctx.db.patch("sheets", args.sheetId, {
      elements: args.elements,
      appState: args.appState,
      updatedAt: Date.now(),
    });

    return {
      updatedAt: Date.now(),
    };
  },
});

/**
 * Rename a sheet
 */
export const renameSheet = mutation({
  args: {
    sheetId: v.id("sheets"),
    newTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const sheet = await ctx.db.get("sheets", args.sheetId);
    if (!sheet) {
      throw new Error("Sheet not found");
    }

    // Verify ownership
    if (sheet.userId !== userId) {
      throw new Error("Unauthorized: you do not own this sheet");
    }

    await ctx.db.patch("sheets", args.sheetId, {
      title: args.newTitle,
      updatedAt: Date.now(),
    });

    return {
      title: args.newTitle,
      updatedAt: Date.now(),
    };
  },
});

/**
 * Delete a sheet
 */
export const deleteSheet = mutation({
  args: { sheetId: v.id("sheets") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const sheet = await ctx.db.get("sheets", args.sheetId);
    if (!sheet) {
      throw new Error("Sheet not found");
    }

    // Verify ownership
    if (sheet.userId !== userId) {
      throw new Error("Unauthorized: you do not own this sheet");
    }

    // Delete from database
    await ctx.db.delete("sheets", args.sheetId);

    return { success: true };
  },
});
