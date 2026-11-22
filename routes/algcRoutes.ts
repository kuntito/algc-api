import express from "express";
import { getAllHymnsReqHandler } from "./requestHandlers/getAllHymns/getAllHymnsReqHandler";
import { addHymnReqHandler } from "./requestHandlers/addHymn/addHymnReqHandler";
import { checkForUpdatesRh } from "./requestHandlers/checkForUpdates/checkForUpdatesRh";
import { deleteHymnRh } from "./requestHandlers/deleteHymn.rh";
import { updateHymnRh } from "./requestHandlers/updateHymn.rh";
import { requireApiKey } from "./requireApiKey";

const algcRouter = express.Router();

algcRouter.get(
    "/allHymns",
    getAllHymnsReqHandler
);

algcRouter.post(
    "/hymn",
    requireApiKey,
    addHymnReqHandler
);

algcRouter.get(
    "/checkForUpdates",
    checkForUpdatesRh
);

algcRouter.delete(
    "/hymn/:hymnId",
    requireApiKey,
    deleteHymnRh
);

algcRouter.put(
    "/hymn/:hymnId",
    requireApiKey,
    updateHymnRh
);

export default algcRouter;