import {isWithinPolygon} from "./rayCasting";
import {GeoCoordinates} from "../model";

describe("rayCasting", () => {

    let position1: GeoCoordinates, position2: GeoCoordinates, position3: GeoCoordinates, polygon: GeoCoordinates[];
    beforeEach(() => {
        position1 = {longitude: 8.118304, latitude: 49.324960};
        position2 = {longitude: 8.668894359802247, latitude: 50.12907149430282};
        position3 = {longitude: 8.656792232727051, latitude: 50.12142273530756};
        polygon = [
            {longitude: 8.649239132141116, latitude: 50.1305570826982},
            {longitude: 8.655161449645998, latitude: 50.12213813868044},
            {longitude: 8.669066021179201, latitude: 50.11938652872715},
            {longitude: 8.68382889959717, latitude: 50.1232937676977},
            {longitude: 8.689665386413576, latitude: 50.130832186599434},
            {longitude: 8.68133980963135, latitude: 50.13886452321225},
            {longitude: 8.665461132263186, latitude: 50.14288018587078},
            {longitude: 8.65138489935303, latitude: 50.139634676422276},
            {longitude: 8.649239132141116, latitude: 50.1305570826982}
        ];
    });

    test("return false on empty polygon", () => {
        expect(isWithinPolygon(position1, [])).toBe(false);
    });

    test("determine position far outside polygon (smaller/larger than minX/minY)", () => {
        expect(isWithinPolygon(position1, polygon)).toBe(false);
    });

    test("determine position inside polygon", () => {
        expect(isWithinPolygon(position2, polygon)).toBe(true);
    });

    test("determine position outside polygon (not shortcut)", () => {
        expect(isWithinPolygon(position3, polygon)).toBe(false);
    });

});