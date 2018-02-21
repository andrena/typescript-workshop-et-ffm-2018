import {Application} from "express";
import bodyParser = require("body-parser");

export function configureServer(app: Application): void {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
}
