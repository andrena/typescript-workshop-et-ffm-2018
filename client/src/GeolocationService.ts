import {GeoCoordinates} from "./model";

export type PositionListener = (coordinate: GeoCoordinates) => void;

/** Schnittstellendefinition für verschiedenen GeolocationServices. */
export interface GeolocationService {

    /** Registriert eine Funktion, die bei Änderungen an der aktuellen Position aufgerufen wird. */
    subscribe(listener: PositionListener): void;

    /** Entfernt eine vorher mittels subscribe() registrierte Funktion wieder. */
    unsubscribe(listener: PositionListener): void;

    /** Die GeolocationServices, die keine echten GPS-Daten verwenden, können per Doppelklick auf die Karte neu justiert
     * werden. Dabei wird diese Methode aufgerufen, um dem GeolocationService die Koordinaten zu übermitteln. */
    setCurrentPosition(coordinates: GeoCoordinates): void;

}
