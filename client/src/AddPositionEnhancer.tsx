import * as React from "react";
import {GeoCoordinates} from "./model";
import {GeolocationService} from "./GeolocationService";

interface State {
    currentPosition: GeoCoordinates;
}

export interface PositionProps {
    currentPosition: GeoCoordinates;
}

/**
 * Erweitert den State einer Komponente um PositionProps anhand des mitgelieferten geolocationService.
 */
export const addPosition = function <T>(geolocationService: GeolocationService,
                                        PositionConsumer: React.ComponentClass<T & PositionProps>) {

    return class PositionProvider extends React.Component<T, State> {

        private readonly positionUpdated = (currentPosition: GeoCoordinates) => {
            this.setState({currentPosition});
        };

        constructor(props: T) {
            super(props);
            this.state = {
                currentPosition: {longitude: 0, latitude: 0},
            };
        }

        render() {
            // cast as workaround because generic types cannot be used with spread operator atm
            const props: Readonly<T & PositionProps> = {
                ...this.props as any,
                currentPosition: {...this.state.currentPosition}
            };
            return <PositionConsumer {...props} />;
        }

        componentDidMount() {
            geolocationService.subscribe(this.positionUpdated);
        }

        componentWillUnmount() {
            geolocationService.unsubscribe(this.positionUpdated);
        }

    }
};
