** PROJECT-SETUP **

+   to setup the project in cwd:
    `npm init -y`

    this creates a `package.json` file

+   to setup repo:
    `git init`

+   create `/.gitignore`
    add:
    `
    node_modules
    .env
    .cursorrules
    package-lock.json
    .vscode/settings.json
    `
+   web framework for handling routes:
    `npm install express`

+   typescript compiler (local):
    `npm install -D typescript`

+   runs typescript files directly without compiling:
    `npm install -D ts-node`

+   auto-restarts server on file changes:
    `npm install -D nodemon`

+   typescript type definitions for node.js:
    `npm install -D @types/node`

+   typescript type definitions for express:
    `npm install -D @types/express`

+   loads environment variables from .env file:
    `npm install dotenv`

+   in project root, create `tsconfig.json`
    copy content from my google drive `G:\My Drive\0\tsconfig.json`

+   in project root, create `server.ts`

+   in `server.ts`, add:
    `
import express, { Express } from "express";

const app: Express = express();
// TODO ensure PORT doesn't clash with other projects
const PORT = 5003;

// allows project to parse JSON in request body
app.use(express.json());

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
})
    `

+   to start server with `npm run dev`,
    in `package.json`, go to the `scripts` tag and add:

    `
    {
        ...,
        "scripts": {
            ...,
            "dev": "nodemon server.ts"
        },
        ...
    }
    `

    `nodemon` is the command.
    `server.ts` is the relative file path


+   enables cross-origin requests, allows you specify what hosts can access this API:
    `npm install cors`
    `npm install -D @types/cors`
