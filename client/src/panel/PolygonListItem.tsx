import * as React from "react";
import {SyntheticEvent} from "react";
import {GeoPolygon} from "../model";

interface Props {
    polygon: GeoPolygon;
    onDelete: () => void;
    onRename: (name: string) => void;
}

interface State {
    showInput: boolean;
    inputValue: string;
}

export class PolygonListItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showInput: false,
            inputValue: this.props.polygon.name,
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onInputChange(event: SyntheticEvent<HTMLInputElement>) {
        this.setState({inputValue: event.currentTarget.value});
    }

    onBlur() {
        this.props.onRename(this.state.inputValue);
        this.setEditMode(false);
    }

    setEditMode(val: boolean) {
        this.setState({showInput: val});
    }

    renderBadge() {
        const marginRight = {marginRight: "12px"};
        let className = "";
        // todo benutze this.props.polygon um className abhängig vom Status zu setzen
        // aktuelle Position innerhalb Polygon: class "badge badge-success"
        // aktuelle Position außerhalb Polygon: class "badge badge-secondary"
        return <span className={className} style={marginRight}>on</span>;
    }

    render() {
        return <div className="row">
            <span className="col-sm-10" style={{lineHeight: "36px"}}>
                {this.renderBadge()}
                {this.state.showInput ? <input className="form-control form-control-sm col-sm-10"
                                               style={{display: "inline-block", width: "10rem"}}
                                               value={this.state.inputValue}
                                               onChange={this.onInputChange}
                                               onBlur={this.onBlur}
                /> : <span style={{cursor: "pointer"}}
                           onClick={() => this.setEditMode(true)}
                >{this.props.polygon.name}</span>}
            </span>
            <a href="#" className="btn btn-light btn-sm col-sm-2" onClick={this.props.onDelete}>
                <span className="oi oi-trash"></span></a>
        </div>;
    }
}
