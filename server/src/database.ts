import * as PouchDB from "pouchdb";

export function createDB(directory: string) {
    const db = new PouchDB(directory);
    PouchDB.debug.enable('*');
    return db;
}
