import * as ol from "openlayers";
import {GeoCoordinates, GeoPolygon} from "../model";
import {PolygonStore} from "./PolygonStore";
import Polygon = ol.geom.Polygon;
import Coordinate = ol.Coordinate;

const CUSTOM_TILESERVER_URL = "https://zugelder.org/osm-tiles/{z}/{x}/{y}.png";

export class GeoMap {

    private readonly polygonStore = new PolygonStore();
    private readonly source = new ol.source.Vector({wrapX: false});
    private readonly doubleClickCallbacks: ((coordinates: GeoCoordinates) => void)[] = [];

    private readonly map: ol.Map;
    private readonly draw: ol.interaction.Draw;
    private readonly currentPos: ol.geom.Point;

    constructor(elementId: string,
                initialCoordinates: GeoCoordinates,
                polygonAddedCallback?: (mapElementId: string, polygonCoordinates: GeoCoordinates[]) => void) {

        const convertedCoordinates = GeoMap.geoCoordinatesToOlCoordinate(initialCoordinates);
        this.currentPos = new ol.geom.Point(convertedCoordinates);
        this.map = GeoMap.initMap(elementId, this.source, this.currentPos);
        this.draw = GeoMap.initDrawer(this.source);

        this.initDoubleClick();
        if (polygonAddedCallback) {
            this.registerPolygonAddedCallback(this.source, polygonAddedCallback);
        }
    }

    private static initMap(elementId: string, source: ol.source.Vector, currentPos: ol.geom.Point) {
        const osm = new ol.source.OSM();
        osm.setUrl(CUSTOM_TILESERVER_URL);
        const mapLayer = new ol.layer.Tile({source: osm});

        const vector = new ol.layer.Vector({source});

        const currentPosition = new ol.source.Vector();
        currentPosition.addFeature(new ol.Feature(currentPos));
        const pointLayer = new ol.layer.Vector({source: currentPosition});

        return new ol.Map({
            controls: [new ol.control.Zoom()],
            target: elementId,
            layers: [mapLayer, vector, pointLayer],
            view: new ol.View({
                center: currentPos.getCoordinates(),
                maxZoom: 18,
                zoom: 14
            })
        });
    }

    setCurrentPos(coordinates: GeoCoordinates) {
        this.currentPos.setCoordinates(GeoMap.geoCoordinatesToOlCoordinate(coordinates))
    }

    drawMode(on: boolean) {
        if (on) {
            this.map.addInteraction(this.draw);
        } else {
            this.map.removeInteraction(this.draw);
        }
    }

    updatePolygons(polygons: GeoPolygon[]) {
        const polygonIds = polygons.map(polygon => polygon._id);
        // bestimme, welche Polygone auf der Karte nicht mehr angezeigt werden sollen
        const featuresToRemove = this.polygonStore.returnAndRemoveAllBut(polygonIds);
        // entferne Polygone von der Karte
        featuresToRemove.forEach(polygon => this.source.removeFeature(polygon));
        // bestimme, welche Polygone auf der Karte noch nicht angezeigt werden
        const polygonsNotYetOnMap = this.polygonStore.determineMissingPolygons(polygons);
        // füge sie hinzu
        polygonsNotYetOnMap.forEach(polygon => this.addPolygonFeature(polygon));
    }

    registerDoubleClickCallback(callback: ((coordinates: GeoCoordinates) => void)) {
        this.doubleClickCallbacks.push(callback);
    }

    removeDoubleClickCallback(callback: ((coordinates: GeoCoordinates) => void)) {
        const start = this.doubleClickCallbacks.indexOf(callback);
        if (start !== -1) {
            this.doubleClickCallbacks.splice(start, 1);
        }
    }

    private initDoubleClick() {
        this.disableDoubleClickZoom();
        this.map.getViewport().addEventListener("dblclick", (e: Event) => {
            e.preventDefault();
            const coordinates = this.map.getEventCoordinate(e);
            this.doubleClickCallbacks.forEach(cb => cb(GeoMap.olCoordinateToGeoCoordinates(GeoMap.transformProjection(coordinates))));
        })
    }

    private disableDoubleClickZoom() {
        const dblClickInteraction = this.map.getInteractions().getArray().find((interaction) => {
            return interaction instanceof ol.interaction.DoubleClickZoom
        });
        if (dblClickInteraction) {
            this.map.removeInteraction(dblClickInteraction);
        }
    }

    private addPolygonFeature(polygon: GeoPolygon) {
        const geometry = new ol.geom.Polygon([polygon.coordinates.map(GeoMap.transformGeoProjection)]);
        const feature = new ol.Feature({name: "loadedPolygon", geometry, fromBackend: true});
        this.source.addFeature(feature);
        return feature;
    }

    private registerPolygonAddedCallback(source: ol.source.Vector, callback: (mapElementId: string, polygonCoordinates: GeoCoordinates[]) => void) {
        source.on("addfeature", () => {
            const features = source.getFeatures();
            const addedFeature = features[features.length - 1];
            // polygons from backend should not trigger callback like drawn polygons, because they are already in the panel list
            const id = this.polygonStore.savePolygonFeature(addedFeature);
            if (addedFeature.get("fromBackend")) return;
            // cast is safe as long as we only use polygons as map features
            const coordinates = (addedFeature.getGeometry() as Polygon).getCoordinates()[0];
            const geoCoordinates = coordinates
                .map(GeoMap.transformProjection)
                .map(GeoMap.olCoordinateToGeoCoordinates);
            callback(id, geoCoordinates);
        });
    }

    private static geoCoordinatesToOlCoordinate(coordinates: GeoCoordinates): ol.Coordinate {
        return ol.proj.fromLonLat([coordinates.longitude, coordinates.latitude]);
    }

    private static olCoordinateToGeoCoordinates(coordinate: Coordinate): GeoCoordinates {
        return {longitude: coordinate[0], latitude: coordinate[1]};
    }

    private static initDrawer(source: ol.source.Vector) {
        return new ol.interaction.Draw({
            source: source,
            type: "Polygon",
        });
    }

    private static transformProjection(coordinate: Coordinate) {
        return ol.proj.transform(coordinate, "EPSG:3857", "EPSG:4326");
    }

    private static transformGeoProjection(coordinates: GeoCoordinates) {
        return ol.proj.transform([coordinates.longitude, coordinates.latitude], "EPSG:4326", "EPSG:3857");
    }

}
