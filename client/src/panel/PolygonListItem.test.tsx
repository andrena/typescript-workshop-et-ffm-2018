import * as React from "react";
import {shallow} from "enzyme";
import {GeoPolygonWithStatus} from "../model";
import {PolygonListItem} from "./PolygonListItem";

describe("PolygonListItem", () => {

    let polygonActive: GeoPolygonWithStatus;
    let polygonInactive: GeoPolygonWithStatus;
    let onDelete: jest.Mock, onRename: jest.Mock;
    beforeEach(() => {
        polygonActive = {
            _id: "1",
            name: "name",
            coordinates: [],
            active: true,
        };
        polygonInactive = {
            _id: "1",
            name: "name",
            coordinates: [],
            active: false,
        };
        onDelete = jest.fn();
        onRename = jest.fn();
    });

    test("should render success badge if polygon is active (current position within polygon)", () => {
        const wrapper = shallow(<PolygonListItem polygon={polygonActive} onDelete={onDelete} onRename={onRename}/>);
        expect(wrapper.find("span").at(1).hasClass("badge badge-success")).toBe(true);
    });

    test("should render secondary badge if polygon is inactive", () => {
        const wrapper = shallow(<PolygonListItem polygon={polygonInactive} onDelete={onDelete} onRename={onRename}/>);
        expect(wrapper.find("span").at(1).hasClass("badge badge-secondary")).toBe(true);
    });

    test("should call onDelete on trash can click", () => {
        const wrapper = shallow(<PolygonListItem polygon={polygonActive} onDelete={onDelete} onRename={onRename}/>);
        wrapper.find("a").simulate("click");
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

});
