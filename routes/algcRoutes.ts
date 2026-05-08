import express from "express";
import { getAllHymnsReqHandler } from "./requestHandlers/getAllHymns/getAllHymnsReqHandler";

const algcRouter = express.Router();

algcRouter.get("/allHymns", getAllHymnsReqHandler);

export default algcRouter;