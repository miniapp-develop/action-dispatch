const Dispatcher = require('./libs/index');

const d = new Dispatcher().register(({scheme, host, queryObj}, urlStr, dispatcher) => {
    if (!scheme) {
        wx.navigateTo({
            url: urlStr
        });
        return true;
    }
    if (scheme === 'http' || scheme === 'https') {
        wx.navigateTo({
            url: `${dispatcher._webview}?url=${urlStr}`
        });
        return true;
    }
    if (host === 'dialog') {
        wx.showModal({
            title: queryObj.title,
            content: queryObj.content
        });
        return true;
    }
    return false;
});
export default d;