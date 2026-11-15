import { RequestHandler, Request, Response } from "express";

// TODO remove `hasContentUpdate`.
//  hymn changes now go through a separate refresh,
//  where the app refetches all hymns and replaces its cache.
type CheckForUpdatesResponse = {
    success: true;
    hasContentUpdate: boolean;
    hasApkUpdate: {
        url: string;
    } | null;
} | {
    success: false;
    debug: object;
}

const checkForUpdatesRh: RequestHandler = async (
    req: Request,
    res: Response<CheckForUpdatesResponse>
) => {
    return res
        .status(200)
        .json({
            success: true,
            hasContentUpdate: false,
            hasApkUpdate: null,
        })
}

export { checkForUpdatesRh };