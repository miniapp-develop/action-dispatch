const {MiniDispatcher} = require('../libs/index');

describe('MiniDispatcher', () => {
    let testDispatcher;
    beforeEach(() => {
        global.wx = {
            navigateTo: jest.fn(),
            navigateToMiniProgram: jest.fn()
        };
        global.fn = jest.fn();
        testDispatcher = new MiniDispatcher({
            page1: '/page1/index',
            page2: '/page2/index'
        });
    })

    test("when get default protocol then get mini:", () => {
        expect(testDispatcher.config('protocol')).toEqual("mini:");
    })

    test("when get exist page then return the page1 path", () => {
        expect(testDispatcher.getPageRoute('page1')).toEqual('/page1/index');
        expect(testDispatcher.getPageRoute('page2')).toEqual('/page2/index');
    })

    test("when url is a https link then open webview", () => {
        testDispatcher.handle('https://a', {});
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/pages/web/index?_url=https%3A%2F%2Fa'
        });
    })

    test("when url is a https link and extra is not null then add extra to the link", () => {
        testDispatcher.handle('https://a', {name: 'xesam', age: 18});
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/pages/web/index?_url=https%3A%2F%2Fa%3Fname%3Dxesam%26age%3D18'
        });
    })

    test("when url is a pagePath link then open the path", () => {
        testDispatcher.handle('/page1/index');
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/page1/index'
        });
    })

    test("when url is a pagePath link and extra is not null then add extra to the path", () => {
        testDispatcher.handle('/page1/index', {name: 'xesam', age: 18});
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/page1/index?name=xesam&age=18'
        });
    })

    test("when url is page name then open the name-path", () => {
        testDispatcher.handle('mini://page?_name=page1');
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/page1/index?_name=page1'
        });
    })

    test("when url is page name and extra is not null then add extra to the path", () => {
        testDispatcher.handle('mini://page?_name=page1', {name: 'xesam', age: 18});
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/page1/index?_name=page1&name=xesam&age=18'
        });
    })

    test("when url is miniapp link then navigateToMiniProgram", () => {
        testDispatcher.handle('mini://miniapp?id=123&path=456');
        expect(wx.navigateToMiniProgram.mock.calls[0][0]).toStrictEqual({
            id: '123',
            path: '456'
        });
    })

    test("when url is miniapp link and extra is not null then add extra to the option", () => {
        testDispatcher.handle('mini://miniapp?id=123&path=456', {name: 'xesam', age: 18});
        expect(wx.navigateToMiniProgram.mock.calls[0][0]).toStrictEqual({
            id: '123',
            path: '456',
            name: 'xesam',
            age: '18'
        });
    })

    test("when url is webview link then open webview", () => {
        testDispatcher.handle('mini://webview?_url=https%3A%2F%2Fa');
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/pages/web/index?_url=https%3A%2F%2Fa'
        });
    })

    test("when url is webview link and extra is not null then add extra to the query", () => {
        testDispatcher.handle('mini://webview?_url=https%3A%2F%2Fa', {name: 'xesam', age: 18});
        expect(wx.navigateTo.mock.calls[0][0]).toStrictEqual({
            url: '/pages/web/index?_url=https%3A%2F%2Fa&name=xesam&age=18'
        });
    })

    test("when url is function then invoke the function", () => {
        testDispatcher.handle('mini://function/fn?value=abc');
        expect(fn.mock.calls[0][0].get('value')).toEqual('abc');
    })

    test("when url is function and extra is not null then add extra to the params", () => {
        testDispatcher.handle('mini://function/fn?value=abc', {name: 'xesam', age: 18});
        expect(fn.mock.calls[0][0].get('value')).toEqual('abc');
        expect(fn.mock.calls[0][0].get('name')).toEqual('xesam');
        expect(fn.mock.calls[0][0].get('age')).toEqual(18);
    })
});