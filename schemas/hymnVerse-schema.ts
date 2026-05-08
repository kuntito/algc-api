import { pgTable, integer, serial, text, bigint, pgEnum } from "drizzle-orm/pg-core";
import { hymnsTable } from "./hymn-schema";

export const verseTypeEnum = pgEnum("verse_type", ["verse", "chorus"]);

export const hymnVerseTN = "hymnVerses"
export const hymnVersesTable = pgTable(hymnVerseTN, {
    verseId: serial("id")
        .primaryKey(),
    hymnId: integer("hymnId")
        .notNull()
        .references(
            () => hymnsTable.hymnId
        ),
    verseType: verseTypeEnum("type")
        .notNull(),
    verseOrder: integer("verseOrder")
        .notNull(),
    lines: text("lines")
        .array()
        .notNull(),
});

export type HymnVerseEntity = typeof hymnVersesTable.$inferSelect;
export type HymnVerseInsertEntity = typeof hymnVersesTable.$inferInsert;