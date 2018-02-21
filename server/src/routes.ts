import {Application, Request, Response} from "express";
import {GeoPolygon} from "../../client/src/model";
import * as PouchDB from "pouchdb";


export function defineRoutes(app: Application, database: PouchDB.Database<{}>): void {

    app.route("/")
        .get((req: Request, res: Response) => {
            res.send("server running");
        });

    app.route("/api/polygons")
        .get(async (req: Request, res: Response) => {
            const result = await database.allDocs({include_docs: true});
            const docs = result.rows.map(row => row.doc);
            res.send(docs);
        });

    app.route("/api/polygons")
        .post(async (req: Request, res: Response) => {
            const polygon = <GeoPolygon>req.body;

            try {
                await database.put(polygon);
                res.sendStatus(201);
            } catch (e) {
                res.sendStatus(500);
            }
        });

    app.route("/api/polygons/:id")
        .delete(async (req: Request, res: Response) => {
            const id = req.params["id"];
            const doc = await database.get(id);
            await database.remove(doc);
            res.sendStatus(204);
        });

    app.route("/api/polygons")
        .put(async (req: Request, res: Response) => {
            const polygon = <GeoPolygon>req.body;
            const loadedPolygon = await database.get(polygon._id);
            const updated = {...loadedPolygon, ...polygon};
            await database.put(updated);
            res.send(updated);
        });

}
