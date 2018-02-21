import * as React from "react";
import {Map} from "./Map";
import {Panel} from "./panel/Panel";
import {GeoCoordinates, GeoPolygon, GeoPolygonWithStatus} from "./model";
import {addPosition, PositionProps} from "./AddPositionEnhancer";
import {isWithinPolygon} from "./ray-casting/rayCasting";
import {GeolocationServiceLinear} from "./GeolocationServiceLinear";
import * as api from "./api";

const geolocationService = new GeolocationServiceLinear();

interface State {
    drawMode: boolean;
    polygons: GeoPolygon[];
}

class AppComponent extends React.Component<PositionProps, State> {

    constructor(props: PositionProps) {
        super(props);
        this.state = {
            drawMode: false,
            polygons: [],
        };
        this.toggleDrawMode = this.toggleDrawMode.bind(this);
        this.addPolygon = this.addPolygon.bind(this);
        this.onPolygonDrawn = this.onPolygonDrawn.bind(this);
        this.onPolygonDelete = this.onPolygonDelete.bind(this);
        this.onPolygonRename = this.onPolygonRename.bind(this);
        this.setCurrentPosition = this.setCurrentPosition.bind(this);
    }

    async componentWillMount() {
        const polygons = await api.getAllPolygons();
        this.setState({polygons});
    }

    toggleDrawMode() {
        this.setState((prevState) => ({drawMode: !prevState.drawMode}));
    }

    addPolygon(_id: string, coordinates: GeoCoordinates[]) {
        const polygon: GeoPolygon = {
            _id,
            name: "Unbenannt",
            coordinates,
        };
        this.setState(prevState => ({polygons: [...prevState.polygons, polygon]}));
        api.savePolygon(polygon);
    }

    async deletePolygon(id: string) {
        await api.deletePolygon(id);

        this.setState(prevState => {
            const nextPolygons = prevState.polygons.filter(polygon => polygon._id !== id);
            return {polygons: nextPolygons};
        });
    }

    onPolygonDrawn(_id: string, polygonCoordinates: GeoCoordinates[]) {
        this.toggleDrawMode();
        this.addPolygon(_id, polygonCoordinates);
    }

    onPolygonDelete(polygon: GeoPolygon) {
        this.deletePolygon(polygon._id);
    }

    async onPolygonRename(name: string, polygonId: string) {
        await api.updatePolygon({_id: polygonId, name});

        this.setState(prevState => {
            return {
                polygons: prevState.polygons.map(polygon => {
                    if (polygon._id === polygonId) {
                        polygon.name = name;
                    }
                    return polygon;
                })
            };
        });
    }

    addPolygonStatus(polygons: GeoPolygon[]) {
        const casted = polygons as GeoPolygonWithStatus[];
        for (const polygon of casted) {
            polygon.active = isWithinPolygon(this.props.currentPosition, polygon.coordinates);
        }
        return casted;
    }

    setCurrentPosition(coordinates: GeoCoordinates) {
        geolocationService.setCurrentPosition(coordinates);
    }

    render() {
        return (
            <div>
                <Map drawMode={this.state.drawMode}
                     onPolygonAdded={this.onPolygonDrawn}
                     currentPos={this.props.currentPosition}
                     polygons={this.state.polygons}
                     onMapDoubleClick={this.setCurrentPosition}
                />
                <Panel drawMode={this.state.drawMode}
                       onDrawModeChanged={this.toggleDrawMode}
                       onPolygonDelete={this.onPolygonDelete}
                       onPolygonRename={this.onPolygonRename}
                       polygons={this.addPolygonStatus(this.state.polygons)}/>
            </div>
        );
    }
}

export const App = addPosition<{}>(geolocationService, AppComponent);
