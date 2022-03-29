const Dispatcher = require('../libs/dispatch');

const d = new Dispatcher().register(({scheme, host, query}, urlStr) => {
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
            title: query.title,
            content: query.content
        });
        return true;
    }
    return false;
});
export default d;