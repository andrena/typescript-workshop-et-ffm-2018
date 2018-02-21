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

    private listeners: PositionListener[] = [];
    private intervalId?: number;

    constructor(private currentPosition: GeoCoordinates = defaultPosition,
                private settings: GeolocationServiceFakeLinearSettings = defaultSettings) {
    }

    setCurrentPosition(position: GeoCoordinates) {
        this.currentPosition = position;
    }

    subscribe(listener: PositionListener) {
        if (this.listeners.length === 0) {
            this.startTimer();
        }

        this.listeners.push(listener);
    }

    unsubscribe(listener: PositionListener) {
        this.listeners = this.listeners.filter(li => li !== listener);

        if (this.listeners.length === 0) {
            this.stopTimer();
        }
    }

    private startTimer() {
        this.intervalId = window.setInterval(() => this.updatePosition(), this.settings.updateRateMs);
    }

    private updatePosition() {
        let longitude = this.currentPosition.longitude + this.settings.speed;
        let latitude = this.currentPosition.latitude + this.settings.speed;
        this.currentPosition = {longitude, latitude};
        this.listeners.forEach(listener => listener(this.currentPosition));
    }

    private stopTimer() {
        if (typeof this.intervalId !== "number") {
            throw new Error("Watch already cleared");
        }

        window.clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

}
