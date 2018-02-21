import * as React from "react";
import {PolygonListItem} from "./PolygonListItem";
import {GeoPolygon, GeoPolygonWithStatus} from "../model";

interface Props {
    polygons: GeoPolygonWithStatus[];
    drawMode: boolean;
    onDrawModeChanged: () => void;
    onPolygonDelete: (polygon: GeoPolygon) => void;
    onPolygonRename: (name: string, polygonId: string) => void;
}

export class Panel extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.onPolygonDelete = this.onPolygonDelete.bind(this);
        this.onPolygonRename = this.onPolygonRename.bind(this);
    }

    onPolygonDelete(polygon: GeoPolygon) {
        return () => this.props.onPolygonDelete(polygon);
    }

    onPolygonRename(polygon: GeoPolygon) {
        return (name: string) => this.props.onPolygonRename(name, polygon._id);
    }

    render() {
        const style: React.CSSProperties = {
            position: "absolute",
            width: "18rem",
            top: "5%",
            right: "5%",
            backgroundColor: "rgba(255,255,255,0.8)",
        };
        return (
            <div className="card" style={style}>
                <div className="card-body">
                    {this.createDrawButton(this.props.drawMode)}
                    <ul className="list-group list-group-flush">
                        {this.props.polygons.map(polygon =>
                            <PolygonListItem
                                key={polygon._id}
                                polygon={polygon}
                                onDelete={this.onPolygonDelete(polygon)}
                                onRename={this.onPolygonRename(polygon)}/>)}
                    </ul>
                </div>
            </div>
        );
    }

    private createDrawButton(drawMode: boolean) {
        if (drawMode) {
            return (
                <a href="#" className="btn btn-danger" onClick={this.props.onDrawModeChanged}>
                    <span className="oi oi-x"/>&nbsp;
                    Abbrechen
                </a>
            );
        } else {
            return (
                <a href="#" className="btn btn-primary" onClick={this.props.onDrawModeChanged}>
                    <span className="oi oi-pencil"/>&nbsp;
                    Polygon zeichnen
                </a>
            );
        }
    }

}
