import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const hymnTableTN = "hymns";
export const hymnsTable = pgTable(hymnTableTN, {
    hymnId: serial("id").primaryKey(),
    hymnTitle: text("title")
        .notNull()
        .unique(),
    updatedAt: timestamp("updatedAt")
        .notNull()
        .defaultNow(),
});

export type HymnEntity = typeof hymnsTable.$inferSelect;
export type HymnInsertEntity = typeof hymnsTable.$inferInsert;