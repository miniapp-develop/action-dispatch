const Dispatcher = require('./libs/dispatch');

const d = new Dispatcher().register(({scheme, host, queryObj}, urlStr) => {
    if (!scheme) {
        wx.navigateTo({
            url: urlStr
        });
        return true;
    }
    if (scheme === 'http' || scheme === 'https') {
        console.log('打开网页', urlStr);
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