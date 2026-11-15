import { Request, Response } from "express";
import { UpdateHymnResponse } from "./updateHymn.types";
import { updateHymn, validateUpdateHymn } from "./updateHymn.helpers";


export const updateHymnRh = async (
    req: Request,
    res: Response<UpdateHymnResponse>
) => {
    const valResUpdateHymn = validateUpdateHymn(
        req.params.hymnId,
        req.body,
    );
    if (!valResUpdateHymn.isValid) {
        return res
            .status(400)
            .json({
                success: false,
                clientErrorMessage: valResUpdateHymn.reason,
            });
    }

    const updatedHymn = await updateHymn(
        valResUpdateHymn.data.hymnId,
        valResUpdateHymn.data.hymnInput,
    );

    if (updatedHymn == null) {
        return res
            .status(500)
            .json({
                success: false,
                clientErrorMessage: "couldn't update hymn, try again.",
            });
    }

    return res
        .status(200)
        .json({
            success: true,
            hymn: updatedHymn,
        });
}