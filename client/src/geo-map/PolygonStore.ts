import * as ol from "openlayers";
import {GeoPolygon} from "../model";

export class PolygonStore {

    private polygonIdFeatureList: {_id: string, polygonFeature: ol.Feature}[] = [];
    private counter = +Date.now();

    savePolygonFeature(polygonFeature: ol.Feature): string {
        const _id = (this.counter++).toString(16).padStart(8);
        // todo hänge das polygonFeature und die ID an die polygonIdFeatureList an
        return _id;
    }

    returnAndRemoveAllBut(idsToKeep: string[]): ol.Feature[] {
        // todo entferne alle Einträge in der polygonIdFeatureList, deren IDs nicht in idsToKeep sind
        // gebe alle entfernten polygonFeatures als neue Liste zurück
        return [];
    }

    determineMissingPolygons(polygons: GeoPolygon[]): GeoPolygon[] {
        // todo gebe alle polygons zurück, deren IDs nicht in der polygonIdFeatureList vorkommen
        return [];
    }
}
