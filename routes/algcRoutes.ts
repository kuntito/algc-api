import express from "express";
import { getAllHymnsReqHandler } from "./requestHandlers/getAllHymns/getAllHymnsReqHandler";
import { addHymnReqHandler } from "./requestHandlers/addHymn/addHymnReqHandler";
import { checkForUpdatesRh } from "./requestHandlers/checkForUpdates/checkForUpdatesRh";
import { deleteHymnRh } from "./requestHandlers/deleteHymn.rh";

const algcRouter = express.Router();

algcRouter.get("/allHymns", getAllHymnsReqHandler);

algcRouter.post("/hymn", addHymnReqHandler);

algcRouter.get("/checkForUpdates", checkForUpdatesRh);

algcRouter.delete("/hymn/:hymnId", deleteHymnRh);

export default algcRouter;