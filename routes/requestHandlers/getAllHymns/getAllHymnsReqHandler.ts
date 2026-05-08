import { RequestHandler, Request, Response } from "express";
import { Hymn } from "../../models";
import { getAllHymns } from "./getAllHymnsHelpers";

type GetAllHymnsResponse = {
    success: true;
    hymnCount: number,
    allHymns: Hymn[],
} | {
    success: false;
    debug: object;
}

const getAllHymnsReqHandler: RequestHandler = async (
    req: Request,
    res: Response<GetAllHymnsResponse>
) => {
    const allHymns = await getAllHymns();

    if (allHymns === null) {
        return res
            .status(500)
            .json({
                success: false,
                debug: {
                    errorMessage: "couldn't fetch all hymns"
                }
            })
    }

    return res
        .status(200)
        .json({
            success: true,
            hymnCount: allHymns.length,
            allHymns: allHymns,
        })
}

export { getAllHymnsReqHandler };