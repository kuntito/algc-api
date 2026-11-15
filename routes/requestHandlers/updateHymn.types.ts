import { Hymn } from "../models";

/// response
export type UpdateHymnResponse =
    | {
        success: true;
        hymn: Hymn;
    }
    | {
        success: false;
        clientErrorMessage?: string;
        debug?: object;
    }