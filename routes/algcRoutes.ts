import express from "express";
import { getAllHymnsReqHandler } from "./requestHandlers/getAllHymns/getAllHymnsReqHandler";
import { addHymnReqHandler } from "./requestHandlers/addHymn/addHymnReqHandler";
import { checkForUpdatesRh } from "./requestHandlers/checkForUpdates/checkForUpdatesRh";

const algcRouter = express.Router();

algcRouter.get("/allHymns", getAllHymnsReqHandler);

algcRouter.post("/hymn", addHymnReqHandler);

algcRouter.get("/checkForUpdates", checkForUpdatesRh);

export default algcRouter;