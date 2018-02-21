import axios from "axios";
import {GeoPolygon} from "./model";


export async function savePolygon(polygon: GeoPolygon) {
    return axios.post("/api/polygons", polygon);
}

export async function deletePolygon(polygonId: string) {
    return axios.delete(`/api/polygons/${polygonId}`);
}

export async function updatePolygon(polygon: Partial<GeoPolygon>) {
    return axios.put("/api/polygons", polygon);
}

export async function getAllPolygons() {
    const response = await axios.get<GeoPolygon[]>("/api/polygons");
    return response.data;
}
