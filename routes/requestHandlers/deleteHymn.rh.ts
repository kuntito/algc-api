import { Request, Response } from "express";
import { deleteHymn, validateInputHymnId } from "./deleteHymn.helpers";
import { DeleteHymnResponse } from "./deleteHymn.types";

export const deleteHymnRh = async (
    req: Request,
    res: Response<DeleteHymnResponse>
) => {
    const validationRes = validateInputHymnId(
        req.params.hymnId
    );
    if (!validationRes.isValid) {
        return res
            .status(400)
            .json({
                success: false,
                clientErrorMessage: validationRes.reason,
            });
    }

    const hymnId = validationRes.data;
    const isDeleted = await deleteHymn(hymnId);

    if (!isDeleted) {
        return res
            .status(500)
            .json({
                success: false,
                clientErrorMessage: "couldn't delete hymn, try again.",
            });
    }

    return res
        .status(200)
        .json({
            success: true,
        });
}