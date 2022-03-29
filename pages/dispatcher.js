const Dispatcher = require('../libs/index');

const d = new Dispatcher().register(({scheme, host, params}, actionUrl, dispatcher) => {
    if (!scheme) {
        wx.navigateTo({
            url: actionUrl
        });
        return true;
    }
    if (scheme === 'http' || scheme === 'https') {
        wx.navigateTo({
            url: `${dispatcher.config('webview')}?url=${actionUrl}`
        });
        return true;
    }
    if (host === 'dialog') {
        wx.showModal({
            title: params.title,
            content: params.content
        });
        return true;
    }
    return false;
});
export default d;