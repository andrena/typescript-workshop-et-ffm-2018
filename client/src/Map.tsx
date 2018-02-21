import * as React from "react";
import {GeoMap} from "./geo-map/GeoMap";
import {GeoCoordinates, GeoPolygon} from "./model";
import {GeolocationService} from "./GeolocationService";

interface Props {
    drawMode: boolean;
    onPolygonAdded: (_id: string, polygonCoordinates: GeoCoordinates[]) => void;
    polygons: GeoPolygon[];
    currentPos: GeoCoordinates;
    onMapDoubleClick: (coordinates: GeoCoordinates) => void;
}

export class Map extends React.Component<Props> {

    private geoMap?: GeoMap;
    private doubleClickCallback?: (position: GeoCoordinates) => void;

    render() {
        return <div id="map" style={{position: "absolute", top: 0, right: 0, bottom: 0, left: 0}}/>;
    }

    componentDidMount() {
        this.geoMap = new GeoMap("map", {longitude: 8.667049, latitude: 50.126788}, this.props.onPolygonAdded);
        this.geoMap.registerDoubleClickCallback(this.props.onMapDoubleClick);
    }

    componentWillUnmount() {
        this.geoMap!.removeDoubleClickCallback(this.doubleClickCallback!);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.polygons !== nextProps.polygons) {
            this.geoMap!.updatePolygons(nextProps.polygons);
        }
        if (this.props.drawMode !== nextProps.drawMode) {
            this.geoMap!.drawMode(nextProps.drawMode);
        }
        if (this.props.currentPos.latitude !== nextProps.currentPos.latitude
            || this.props.currentPos.longitude !== nextProps.currentPos.longitude) {
            this.geoMap!.setCurrentPos(nextProps.currentPos);
        }
    }
}
