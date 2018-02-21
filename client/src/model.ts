export interface GeoCoordinates {
    longitude: number;
    latitude: number;
}
export interface GeoPolygon {
    _id: string;
    name: string;
    coordinates: GeoCoordinates[];
}
export interface GeoPolygonWithStatus extends GeoPolygon {
    active: boolean;
}
