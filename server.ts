import express, { Express } from "express";

const app: Express = express();

const PORT = 5004;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
})