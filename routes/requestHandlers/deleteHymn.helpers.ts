import { eq } from "drizzle-orm";
import { logDbError } from "../../helpers/dbHelpers";
import { algcDb } from "../../neonDbClient";
import { hymnsTable } from "../../schemas/hymn-schema";
import { hymnVersesTable } from "../../schemas/hymnVerse-schema";
import { isValidId } from "../../util/helpers";
import { Transaction, ValidationResult } from "../../util/types";


export const validateInputHymnId = (
    hymnIdParam: any
): ValidationResult<number> => {
    const hymnId = Number(hymnIdParam);

    if (!isValidId(hymnId)) {
        return {
            isValid: false,
            reason: "invalid hymn id",
        };
    }

    return {
        isValid: true,
        data: hymnId,
    };
}

const deleteHymnVerses = async (
    tx: Transaction,
    hymnId: number,
) => {
    await tx
        .delete(hymnVersesTable)
        .where(
            eq(
                hymnVersesTable.hymnId,
                hymnId
            )
        );
}

const deleteHymnRow = async (
    tx: Transaction,
    hymnId: number,
) => {
    await tx
        .delete(hymnsTable)
        .where(
            eq(
                hymnsTable.hymnId,
                hymnId
            )
        );
}

/**
 * deletes a hymn and its verses.
 *
 * a hymn that doesn't exist counts as deleted, on purpose,
 * so retrying a delete is always safe.
 */
export const deleteHymn = async (
    hymnId: number,
): Promise<boolean> => {
    try {
        await algcDb.transaction(async (tx) => {
            await deleteHymnVerses(tx, hymnId);
            await deleteHymnRow(tx, hymnId);
        });

        return true;

    } catch (e) {
        logDbError(
            "couldn't delete hymn",
            e
        );
    }

    return false;
}