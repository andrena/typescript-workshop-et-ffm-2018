import {GeolocationServiceLinear} from "./GeolocationServiceLinear";

describe.skip("GeolocationServiceLinear", () => {

    beforeEach(() => jest.useFakeTimers());

    function newService() {
        return new GeolocationServiceLinear(
            {latitude: 0, longitude: 0},
            {speed: 0.1, updateRateMs: 1000}
        );
    }

    test("should register listener, call it regularly and stop calling it after unsubscribing ", () => {
        const service = newService();
        const listener = jest.fn();
        service.subscribe(listener);

        expect(listener).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1000);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({latitude: 0.1, longitude: 0.1});

        jest.advanceTimersByTime(1000);
        expect(listener).toHaveBeenCalledTimes(2);
        expect(listener).toHaveBeenCalledWith({latitude: 0.2, longitude: 0.2});

        service.unsubscribe(listener);
        jest.advanceTimersByTime(1000);
        expect(listener).toHaveBeenCalledTimes(2);
    });

    test("should throw an Error if unsubscribe is called with a function that was never registered", () => {
        const service = newService();
        const listener = jest.fn();
        expect(() => service.unsubscribe(listener)).toThrow();
    });

});
