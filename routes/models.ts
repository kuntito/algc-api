type VerseType = "verse" | "chorus";

export type HymnVerse = {
    id: number;
    verseType: VerseType;
    verseOrder: number;
    verseLines: string[];   
};


export type Hymn = {
    id: number;
    title: string;
    updatedAt: Date;
    verses: HymnVerse[];
};