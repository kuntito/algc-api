/// response
export type DeleteHymnResponse =
    | {
        success: true;
    }
    | {
        success: false;
        clientErrorMessage?: string;
        debug?: object;
    }
