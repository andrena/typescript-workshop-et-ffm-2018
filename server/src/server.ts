import * as express from "express";
import {defineRoutes} from "./routes";
import {createDB} from "./database";
import {configureServer} from "./config";

const app = express();
const port = process.env.PORT || 8081;
const databaseDirectory = process.env.DB_DIR || "pouchdb";

const db = createDB(databaseDirectory);

configureServer(app);
defineRoutes(app, db);

app.listen(port, () => {
    console.log(`Server listening on ${port}...`);
});
