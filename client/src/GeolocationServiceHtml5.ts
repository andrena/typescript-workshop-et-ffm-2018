import {GeolocationService, PositionListener} from "./GeolocationService";
import {GeoCoordinates} from "./model";

/** Ein GeolocationService, der die HTML5 geolocation API nutzt. */
export class GeolocationServiceHtml5 implements GeolocationService {

    private readonly listeners: PositionListener[] = [];
    private watchId: number | undefined;

    setCurrentPosition(coordinates: GeoCoordinates) {
        // es werden nur "echte" GPS-Daten verwendet, daher nichts tun
    }

    subscribe(listener: PositionListener): void {
        if (this.listeners.length === 0) {
            this.watchPosition();
        }

        this.listeners.push(listener);
    }

    unsubscribe(listener: PositionListener): void {
        GeolocationServiceHtml5.removeFromArray(this.listeners, listener);

        if (this.listeners.length === 0) {
            this.clearWatch();
        }
    }

    private watchPosition() {
        this.watchId = navigator.geolocation.watchPosition(position => this.handlePositionUpdate(position));
    }

    private clearWatch() {
        navigator.geolocation.clearWatch(this.watchId!);
    }

    private handlePositionUpdate(position: Position) {
        const newPosition = {longitude: position.coords.longitude, latitude: position.coords.latitude};
        this.listeners.forEach(listener => listener(newPosition));
    }

    private static removeFromArray<T>(array: T[], element: T) {
        const index = array.indexOf(element);
        if (index === -1) {
            throw new Error("Element not found in array");
        }

        array.splice(index, 1);
    }

}
