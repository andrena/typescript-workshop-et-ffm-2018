import * as ol from "openlayers";
import {GeoPolygon} from "../model";

export class PolygonStore {

    private polygonIdFeatureList: {_id: string, polygonFeature: ol.Feature}[] = [];
    private counter = +Date.now();

    savePolygonFeature(polygonFeature: ol.Feature): string {
        const _id = (this.counter++).toString(16).padStart(8);
        this.polygonIdFeatureList.push({_id, polygonFeature});
        return _id;
    }

    returnAndRemoveAllBut(idsToKeep: string[]): ol.Feature[] {
        const polygonFeaturesToRemove: ol.Feature[] = [];
        this.polygonIdFeatureList = this.polygonIdFeatureList.filter(element => {
            if(idsToKeep.indexOf(element._id) === -1) {
                polygonFeaturesToRemove.push(element.polygonFeature);
                return false;
            } else {
                return true;
            }
        });
        return polygonFeaturesToRemove;
    }

    determineMissingPolygons(polygons: GeoPolygon[]): GeoPolygon[] {
        return polygons.filter(polygon => {
            for(const entry of this.polygonIdFeatureList) {
                if(entry._id === polygon._id) {
                    return false;
                }
            }
            return true;
        });
    }
}
