const {Dispatcher} = require('../libs/index');

describe('Dispatcher', () => {
    let testDispatcher;
    beforeEach(() => {
        testDispatcher = new Dispatcher();
    })

    test("when set config a custom value then get the custom value", () => {
        testDispatcher.config('name1', 'value1');
        testDispatcher.config('name2', 'value2');
        expect(testDispatcher.config('name1')).toEqual('value1');
        expect(testDispatcher.config('name2')).toEqual('value2');
    })

    test("when register Handle1 first then call Handle1 last", () => {
        const elements = [];
        const mockHandle1 = function () {
            elements.push(1);
        };
        const mockHandle2 = function () {
            elements.push(2);
        };
        const mockHandle3 = function () {
            elements.push(3);
        };
        testDispatcher.registerHandle(mockHandle1);
        testDispatcher.registerHandle(mockHandle2);
        testDispatcher.registerHandle(mockHandle3);
        testDispatcher.handle("");
        expect(elements).toEqual([3, 2, 1]);
    })

    test("when a handle consumed return true then the url has been consumed", () => {
        const mockHandle1 = jest.fn().mockReturnValue(true);
        const mockHandle2 = jest.fn().mockReturnValue(true);
        testDispatcher.registerHandle(mockHandle1);
        testDispatcher.registerHandle(mockHandle2);
        testDispatcher.handle("");
        expect(mockHandle1).toBeCalledTimes(0);
        expect(mockHandle2).toBeCalledTimes(1);
    })

    test("when add extra then add extra to search", () => {
        const mockHandle1 = jest.fn();
        testDispatcher.registerHandle(mockHandle1);
        testDispatcher.handle("", {name: 'xesam', age: 18});
        expect(mockHandle1.mock.calls[0][0].searchParams.get('name')).toEqual('xesam');
        expect(mockHandle1.mock.calls[0][0].searchParams.get('age')).toEqual(18);
    })
});