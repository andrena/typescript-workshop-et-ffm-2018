import {GeoCoordinates} from "./model";
import {GeolocationService, PositionListener} from "./GeolocationService";

interface GeolocationServiceFakeLinearSettings {
    speed: number;
    updateRateMs: number;
}

const defaultPosition: GeoCoordinates = {
    longitude: 8.668894359802247,
    latitude: 50.12907149430282
};

const defaultSettings: GeolocationServiceFakeLinearSettings = {
    speed: 0.0001,
    updateRateMs: 250
};

/** Ein GeolocationService, der Punkte auf einer Linie liefert ohne Bezug zur echten Position des Geräts. */
export class GeolocationServiceLinear implements GeolocationService {

    constructor(private currentPosition: GeoCoordinates = defaultPosition,
                private settings: GeolocationServiceFakeLinearSettings = defaultSettings) {
    }

    // erlaubt es, eine aktuelle Position direkt zu setzen, z.B. beim Doppelklick auf die Karte
    setCurrentPosition(position: GeoCoordinates) {
        this.currentPosition = position;
    }

    subscribe(listener: PositionListener) {
    }

    unsubscribe(listener: PositionListener) {
    }

}
