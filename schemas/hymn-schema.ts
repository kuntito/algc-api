import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const hymnTableTN = "hymns";
export const hymnsTable = pgTable(hymnTableTN, {
    hymnId: serial("id").primaryKey(),
    hymnTitle: text("title").notNull(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type HymnVerseEntity = typeof hymnsTable.$inferSelect;
export type HymnVerseInsertEntity = typeof hymnsTable.$inferInsert;