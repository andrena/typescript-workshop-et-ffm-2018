import {GeoCoordinates} from "../model";

interface MinMaxValues {
    minLong: number;
    maxLong: number;
    minLat: number;
    maxLat: number;
}

interface GeoVector {
    p1: GeoCoordinates;
    p2: GeoCoordinates;
}

export function isWithinPolygon(position: GeoCoordinates, vertices: GeoCoordinates[]): boolean {
    if (vertices.length < 3) return false;

    const minMaxValues = determinMinMax(vertices);
    // quick check if position is outside of bounding box of polygon
    if (isDefinitelyOutside(position, minMaxValues)) return false;
    // create ray between position and some position outside of the polygon
    // count intersections of ray and polygon sides: odd value means position is within polygon
    const somePositionOutside = {latitude: position.latitude, longitude: minMaxValues.minLong - 0.01};
    const intersectionCount = determineIntersectionCount({
        p1: position,
        p2: somePositionOutside
    }, polygonToVectors(vertices));
    return !!(intersectionCount % 2);
}

function isDefinitelyOutside(position: GeoCoordinates, minMaxValues: MinMaxValues) {
    const {minLong, maxLong, minLat, maxLat} = minMaxValues;
    return position.longitude < minLong
        || position.longitude > maxLong
        || position.latitude < minLat
        || position.latitude > maxLat;
}

function determinMinMax(coordinates: GeoCoordinates[]): MinMaxValues {
    let minLong = coordinates[0].longitude;
    let maxLong = coordinates[0].longitude;
    let minLat = coordinates[0].latitude;
    let maxLat = coordinates[0].latitude;
    for (let i = 1; i < coordinates.length; i++) {
        const long = coordinates[i].longitude;
        const lat = coordinates[i].latitude;
        if (long < minLong) {
            minLong = long;
        } else if (long > maxLong) {
            maxLong = long;
        }
        if (lat < minLat) {
            minLat = lat;
        } else if (lat > maxLat) {
            maxLat = lat;
        }
    }
    return {minLong, maxLong, minLat, maxLat};
}

function determineIntersectionCount(v1: GeoVector, polygonSides: GeoVector[]) {
    let intersections = 0;
    for (const side of polygonSides) {
        if (hasIntersection(v1, side)) {
            intersections++;
        }
    }
    return intersections;
}

function hasIntersection(v1: GeoVector, v2: GeoVector) {
    const {a: a1, b: b1, returnFalse: returnFalse1} = subCalculation(v1, v2);
    if (returnFalse1) return false;
    const {a: a2, b: b2, returnFalse: returnFalse2} = subCalculation(v2, v1);
    if (returnFalse2) return false;
    // collinear
    if (a1 * b2 - a2 * b1 === 0) return false;
    return true;
}

function subCalculation(v1: GeoVector, v2: GeoVector) {
    let returnFalse = false;
    const a = v1.p2.latitude - v1.p1.latitude;
    const b = v1.p1.longitude - v1.p2.longitude;
    const c = (v1.p2.longitude * v1.p1.latitude) - (v1.p1.longitude * v1.p2.latitude);
    const d1 = a * v2.p1.longitude + b * v2.p1.latitude + c;
    const d2 = a * v2.p2.longitude + b * v2.p2.latitude + c;
    if (d1 > 0 && d2 > 0) returnFalse = true;
    if (d1 < 0 && d2 < 0) returnFalse = true;
    return {a, b, returnFalse};
}

function polygonToVectors(polygon: GeoCoordinates[]) {
    const vectors: GeoVector[] = [];
    for (let i = 0; i < polygon.length - 1; i++) {
        vectors.push({p1: polygon[i], p2: polygon[i + 1]});
    }
    return vectors;
}