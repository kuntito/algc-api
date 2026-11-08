import z from "zod";
import { HymnVerseEntity, HymnVerseInsertEntity, hymnVersesTable, verseTypeEnum } from "../../../schemas/hymnVerse-schema";
import { logDbError } from "../../../helpers/dbHelpers";
import { algcDb } from "../../../neonDbClient";
import { HymnEntity, hymnsTable } from "../../../schemas/hymn-schema";
import { Hymn } from "../../models";
import { Transaction } from "../../../util/types";
import { toHymn, toHymnVerse } from "../getAllHymns/getAllHymnsHelpers";

// TODO add custom error messages
const hymnVerseSchemaValidator = z.object({
    verseType: z.enum(
        verseTypeEnum.enumValues
    ),
    verseOrder: z
    .number()
    .min(0),
    lines: z.array(
        z
        .string()
        .trim()
        .min(1)
        .max(100)
    )
});

// TODO add custom error messages
export const hymnSchemaValidator = z.object({
    title: z
        .string()
        .trim()
        .min(1)
        .max(100),
    hymnVerses: z
        .array(hymnVerseSchemaValidator)
        .min(1) // does this ensure verses array has at least one verse?
});


export const checkVerseOrderUniqueness = (
    versesOrder: number[]
): boolean => {
    const valueSet = new Set(versesOrder);

    return valueSet.size === versesOrder.length;
}


type AddHymnVerse = {
    verseType: "verse" | "chorus";
    verseOrder: number;
    lines: string[];
};


export const addHymn = async (
    hymnTitle: string,
    hymnVerses: AddHymnVerse[],
): Promise<Hymn | null> => {
    try {
        return await algcDb.transaction(async (tx) => {
            const hymnEntity = await insertHymnDb(tx, hymnTitle);
            const verseEntities = await insertHymnVersesDb(tx, hymnEntity.hymnId, hymnVerses);

            const hymn = toHymn(hymnEntity);
            const verses = verseEntities.map(toHymnVerse);

            return {
                ...hymn,
                verses,
            };
        });

    } catch (e) {
        logDbError(
            "couldn't add hymn",
            e
        );
    }
    return null;
}



/**
 * inserts hymn into db and returns the inserted hymn.
 * 
 * throws if the insert fails.
 */
const insertHymnDb = async (
    tx: Transaction,
    hymnTitle: string,
): Promise<HymnEntity> => {
    const [hymnRow] = await tx
        .insert(hymnsTable)
        .values({
            hymnTitle: hymnTitle
        })
        .returning();

        
    return hymnRow;
}

/**
 * inserts hymn verses into db and returns the inserted verses.
 * 
 * throws if the insert fails.
 */
const insertHymnVersesDb = async (
    tx: Transaction,
    hymnId: number,
    hymnVerses: AddHymnVerse[],
): Promise<HymnVerseEntity[]> => {
    const verseRows = await tx
        .insert(hymnVersesTable)
        .values(
            hymnVerses.map(
                v => ({
                    ...v,
                    hymnId
                })
            )
        )
        .returning();

    return verseRows;
}