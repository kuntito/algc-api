import z from "zod";
import { isUniqueList, isValidId } from "../../util/helpers";
import { Transaction, ValidationResult } from "../../util/types";
import { hymnSchemaValidator, insertHymnVersesDb } from "./addHymn/addHymnHelpers";
import { Hymn } from "../models";
import { logDbError } from "../../helpers/dbHelpers";
import { algcDb } from "../../neonDbClient";
import { toHymn, toHymnVerse } from "./getAllHymns/getAllHymnsHelpers";
import { deleteHymnVerses } from "./deleteHymn.helpers";
import { HymnEntity, hymnsTable } from "../../schemas/hymn-schema";
import { eq } from "drizzle-orm";

export type HymnInput = z.infer<typeof hymnSchemaValidator>;

/**
 * checks the hymn sent by the client, a title and its verses.
 *
 * the shape is checked by the schema, then the verse orders are
 * checked for duplicates, since the schema can't compare items
 * against each other.
 */
export const validateHymnBody = (
    body: any,
): ValidationResult<HymnInput> => {
    const hymnParseResult = hymnSchemaValidator.safeParse(body);
    if (!hymnParseResult.success) {
        return {
            isValid: false,
            reason: hymnParseResult.error.issues[0].message,
        };
    }

    const hymnInput = hymnParseResult.data;

    const verseOrders = hymnInput.hymnVerses.map(v => v.verseOrder);
    const isVerseOrderUnique = isUniqueList(verseOrders);
    if (!isVerseOrderUnique) {
        return {
            isValid: false,
            reason: "duplicate verse orders exist",
        };
    }

    return {
        isValid: true,
        data: hymnInput,
    };
}


/**
 * ensures the data sent by the client is valid.
 */
export const validateUpdateHymn = (
    hymnId: unknown,
    body: any,
): ValidationResult<{
    hymnId: number;
    hymnInput: HymnInput;
}> => {
    const parsedHymnId = Number(hymnId);
    if (!isValidId(parsedHymnId)) {
        return {
            isValid: false,
            reason: `hymn id must be a whole number above zero, it is ${hymnId}`,
        };
    }

    const hymnBodyResult = validateHymnBody(body);
    if (!hymnBodyResult.isValid) return hymnBodyResult;

    return {
        isValid: true,
        data: {
            hymnId: parsedHymnId,
            hymnInput: hymnBodyResult.data,
        },
    };
}


const updateHymnTitle = async (
    tx: Transaction,
    hymnId: number,
    hymnTitle: string,
): Promise<HymnEntity> => {
    const [hymnRow] = await tx
        .update(hymnsTable)
        .set({
            hymnTitle: hymnTitle,
            updatedAt: new Date(),
        })
        .where(
            eq(
                hymnsTable.hymnId,
                hymnId
            )
        )
        .returning();

    if (!hymnRow) {
        throw new Error(`hymn ${hymnId} not found`);
    }

    return hymnRow;
}


export const updateHymn = async (
    hymnId: number,
    hymnInput: HymnInput,
): Promise<Hymn | null> => {
    try {
        return await algcDb.transaction(async (tx) => {
            await deleteHymnVerses(
                tx,
                hymnId
            );

            const hymnEntity = await updateHymnTitle(
                tx,
                hymnId,
                hymnInput.title
            );

            const verseEntities = await insertHymnVersesDb(
                tx,
                hymnId,
                hymnInput.hymnVerses
            );

            const hymn = toHymn(hymnEntity);
            const verses = verseEntities.map(toHymnVerse);

            return {
                ...hymn,
                verses,
            };
        });

    } catch (e) {
        logDbError(
            "couldn't update hymn",
            e
        );
    }
    return null;
}