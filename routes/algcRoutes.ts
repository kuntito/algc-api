import express from "express";
import { getAllHymnsReqHandler } from "./requestHandlers/getAllHymns/getAllHymnsReqHandler";
import { addHymnReqHandler } from "./requestHandlers/addHymn/addHymnReqHandler";

const algcRouter = express.Router();

algcRouter.get("/allHymns", getAllHymnsReqHandler);

algcRouter.post("/hymn", addHymnReqHandler);

export default algcRouter;