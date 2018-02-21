import {PolygonStore} from "./PolygonStore";
import {GeoPolygon} from "../model";

describe.skip("PolygonStore", () => {

    let store: PolygonStore;
    let feature1: ol.Feature, feature2: ol.Feature;
    beforeEach(() => {
        store = new PolygonStore();
        feature1 = {feature: 1} as any as ol.Feature;
        feature2 = {feature: 2} as any as ol.Feature;
    });

    describe("savePolygonFeature", () => {

        test("should return unique ids on savePolygonFeature", () => {
            const id1 = store.savePolygonFeature(feature1);
            const id2 = store.savePolygonFeature(feature2);
            expect(id1.length).toBeGreaterThan(10);
            expect(id2.length).toBeGreaterThan(10);
            expect(id1).not.toEqual(id2);
        });
    });

    describe("returnAndRemoveAllBut", () => {

        test("should return empty list if all polygon features should be kept", () => {
            const idList = [store.savePolygonFeature(feature1), store.savePolygonFeature(feature2)];
            const polygonsToDelete = store.returnAndRemoveAllBut(idList);
            expect(polygonsToDelete).toHaveLength(0);
        });

        test("should return list of polygons to delete", () => {
            const id1 = store.savePolygonFeature(feature1);
            store.savePolygonFeature(feature2);
            let polygonsToDelete = store.returnAndRemoveAllBut([id1]);
            expect(polygonsToDelete).toEqual([feature2]);
            polygonsToDelete = store.returnAndRemoveAllBut([id1]);
            expect(polygonsToDelete).toHaveLength(0);
        });

        test("should ignore unknown ids", () => {
            const id1 = store.savePolygonFeature(feature1);
            let polygonsToDelete = store.returnAndRemoveAllBut([id1, "unknownId"]);
            expect(polygonsToDelete).toHaveLength(0);
            polygonsToDelete = store.returnAndRemoveAllBut(["unknownId"]);
            expect(polygonsToDelete).toEqual([feature1]);
        });
    });

    describe("determineMissingPolygons", () => {

        test("should return all polygons without corresponding feature in the feature list", () => {
            const id1 = store.savePolygonFeature(feature1);
            const missingPolygon = createPolygon("missingId");
            const missingPolygons = store.determineMissingPolygons([createPolygon(id1), missingPolygon]);
            expect(missingPolygons).toEqual([missingPolygon]);
        });

        test("should return empty list if all polygons are known", () => {
            const id1 = store.savePolygonFeature(feature1);
            const knownPolygon = createPolygon(id1);
            const missingPolygons = store.determineMissingPolygons([knownPolygon]);
            expect(missingPolygons).toHaveLength(0);
        });
    });

});

function createPolygon(_id: string): GeoPolygon {
    return {_id, name: "GeoPolygon" + _id, coordinates: []}
}