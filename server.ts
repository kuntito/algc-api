import express, { Express } from "express";
import cors from 'cors';
import algcRouter from "./routes/algcRoutes";

const app: Express = express();
const PORT = 5004;

// allows project to parse JSON in request body
app.use(express.json());

// any one can access API routes
app.use(cors());
// for specific origins, use:
// `
// app.use(
//     cors({
//         origin: [
//             'http://localhost:5173',
//             'https://myapp.com'
//         ]
//     })
// );
// `

app.use(
    "api/algc", algcRouter
);

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
})