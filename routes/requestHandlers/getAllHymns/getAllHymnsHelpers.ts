import { eq } from "drizzle-orm";
import { logDbError } from "../../../helpers/dbHelpers";
import { algcDb } from "../../../neonDbClient";
import { HymnEntity, hymnsTable } from "../../../schemas/hymn-schema";
import { HymnVerseEntity, hymnVersesTable } from "../../../schemas/hymnVerse-schema";
import { Hymn } from "../../models";


export const getAllHymns = async (

): Promise<Hymn[] | null> => {
    try {
        const rowsHymnAndVerses = await getRowsHymnAndVerses();

        const hymns = consolidateHymnVerses(rowsHymnAndVerses);

        return hymns;

    } catch (e) {
        logDbError(
            "couldn't fetch all hymns",
            e
        )
    }
    return null;
}

type HymnAndVerseRow = {
    hymns: HymnEntity;
    hymnVerses: HymnVerseEntity | null;
}

const getRowsHymnAndVerses = async (

): Promise<HymnAndVerseRow[]> => {
    try {
        const rows = await algcDb
            .select()
            .from(hymnsTable)
            .leftJoin(
                hymnVersesTable,
                eq(hymnsTable.hymnId, hymnVersesTable.hymnId)
            )
            .orderBy(
                hymnsTable.hymnId,
                hymnVersesTable.verseOrder
            );
        return rows;
    } catch(e) {
        logDbError(
            "couldn't fetch hymn and verses",
            e
        )
    }
    return [];
}

const toHymn = (hymnEntity: HymnEntity) => ({
    id: hymnEntity.hymnId,
    title: hymnEntity.hymnTitle,
    updatedAt: hymnEntity.updatedAt,
    verses: []
});


const toHymnVerse = (hymnVerseEntity: HymnVerseEntity) => ({
    id: hymnVerseEntity.verseId,
    verseType: hymnVerseEntity.verseType,
    verseOrder: hymnVerseEntity.verseOrder,
    verseLines: hymnVerseEntity.lines
})


/**
 * `hymnAndVerseRows` is a join of the hymn and hymn verses table.
 * 
 * this iterates the rows, grabs each unique hymn, populates it's verses
 * 
 * and returns all hymns.
 */
const consolidateHymnVerses = (
    hymnAndVerseRows: HymnAndVerseRow[]
): Hymn[] => {
    const hymnMap = new Map<number, Hymn>();

    for (const row of hymnAndVerseRows) {
        const hymnEntity = row.hymns;
        const hymnVerseEntity = row.hymnVerses;

        let hymn = hymnMap.get(hymnEntity.hymnId);
        if (!hymn) {
            hymn = toHymn(hymnEntity);

            hymnMap.set(
                hymnEntity.hymnId,
                hymn,
            );
        }

        if (hymnVerseEntity) {
            const hymnVerse = toHymnVerse(hymnVerseEntity);
            hymn.verses.push(hymnVerse);
        }
    }

    return Array.from(hymnMap.values());
}