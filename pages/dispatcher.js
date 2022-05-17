const Dispatcher = require('../libs/index');

const d = new Dispatcher().register(({protocol, hostname, params}, actionUrl, dispatcher) => {
    if (!protocol) {
        wx.navigateTo({
            url: actionUrl
        });
        return true;
    }
    if (hostname === 'dialog') {
        wx.showModal({
            title: params.title,
            content: params.content
        });
        return true;
    }
    return false;
});
export default d;