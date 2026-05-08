import z from "zod";
import { HymnVerseInsertEntity, hymnVersesTable, verseTypeEnum } from "../../../schemas/hymnVerse-schema";
import { logDbError } from "../../../helpers/dbHelpers";
import { algcDb } from "../../../neonDbClient";
import { hymnsTable } from "../../../schemas/hymn-schema";

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
): Promise<boolean> => {
    try {
        await algcDb.transaction(async (tx) => {
            const hymnId = await insertHymnDb(tx, hymnTitle);
            await insertHymnVersesDb(tx, hymnId, hymnVerses);
        });

        return true;

    } catch (e) {
        logDbError(
            "couldn't add hymn",
            e
        );
    }
    return false;
}


type dbTransaction = Parameters<Parameters<typeof algcDb.transaction>[0]>[0];


/**
 * inserts hymn into db and returns the hymn's id.
 * 
 * throws if the insert fails.
 */
const insertHymnDb = async (
    tx: dbTransaction,
    hymnTitle: string,
): Promise<number> => {
    const [firstRow] = await tx
        .insert(hymnsTable)
        .values({
            hymnTitle: hymnTitle
        })
        .returning({
            hymnId: hymnsTable.hymnId
        });

        
    return firstRow.hymnId;
}

/**
 * inserts hymn verses into db.
 * 
 * throws if the insert fails.
 */
const insertHymnVersesDb = async (
    tx: dbTransaction,
    hymnId: number,
    hymnVerses: AddHymnVerse[],
) => {
    await tx
        .insert(hymnVersesTable)
        .values(
            hymnVerses.map(
                v => ({
                    ...v,
                    hymnId
                })
            )
        )
}