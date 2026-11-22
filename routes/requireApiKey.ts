import { NextFunction, Request, Response } from "express";
import { envConfig } from "../envConfig";

const API_KEY_HEADER = "x-api-key";

/**
 * guards routes that change data,
 * so only approved apps can call them.
 * 
 * a request is approved when its `x-api-key` header
 * matches the key in the server's env.
 *
 * used as middleware, before the route's handler runs.
 */
export const requireApiKey = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const sentKey = req.header(API_KEY_HEADER);
    const isKeyValid = sentKey === envConfig.ALGC_API_KEY;

    if (isKeyValid) {
        next();
    } else {
        res
            .status(401)
            .json({
                success: false,
                clientErrorMessage: "unauthorized",
            });
    }
}