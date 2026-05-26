import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sheets: defineTable({
    title: v.string(),
    elements: v.any(), // Excalidraw elements array
    appState: v.any(),
    userId: v.string(), // Owner of the sheet
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_updatedAt", ["userId", "updatedAt"])
    .searchIndex("search_title", { searchField: "title" }),
});
