import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sheets: defineTable({
    title: v.string(),
    elements: v.any(), // Excalidraw elements array
    appState: v.any(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_updatedAt", ["updatedAt"])
    .searchIndex("search_title", { searchField: "title" }),
});
