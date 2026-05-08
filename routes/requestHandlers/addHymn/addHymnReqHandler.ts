import { Request, RequestHandler, Response } from "express";
import { addHymn, checkVerseOrderUniqueness, hymnSchemaValidator } from "./addHymnHelpers";

type AddHymnResponse =
    | {
        success: true;
    }
    | {
        success: false;
        clientErrorMessage?: string;
        debug?: object;
    }


const addHymnReqHandler: RequestHandler = async (
    req: Request,
    res: Response<AddHymnResponse>
) => {

    const hymnParseResult = hymnSchemaValidator.safeParse(req.body);

    if (!hymnParseResult.success) {
        return res
            .status(400)
            .json({
                success: false,
                clientErrorMessage: hymnParseResult.error.issues[0].message,
                debug: hymnParseResult.error
            })
    }

    const hymn = hymnParseResult.data;

    const isVerseOrderUnique = checkVerseOrderUniqueness(
        hymn.hymnVerses.map(v => v.verseOrder)
    );
    if (!isVerseOrderUnique) {
        return res
            .status(400)
            .json({
                success: false,
                clientErrorMessage: "duplicate verse orders exist",
            });
    }

    const isHymnAdded = await addHymn(
        hymn.title, 
        hymn.hymnVerses
    );

    if (!isHymnAdded) {
        return res
            .status(500)
            .json({
                success: false,
                clientErrorMessage: "hymn not added",
            });
    }

    return res
        .status(201)
        .json({
            success: true 
        });

}

export { addHymnReqHandler };