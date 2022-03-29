const page = ({host, params}) => {
    if (host !== 'page') {
        return false;
    }
    wx.navigateTo({
        url: params.path
    });
    return true;
};

const miniapp = ({host, params}) => {
    if (host !== 'miniapp') {
        return false;
    }
    wx.navigateToMiniProgram(params);
    return true;
};

const webview = ({host, query, params}, urlStr, dispatcher) => {
    if (host !== 'webview') {
        return false;
    }
    wx.navigateTo({
        url: `${dispatcher.config('webview')}?${query}`
    });
    return true;
};

function func({host, params}) {
    if (host !== 'func') {
        return false;
    }
    const name = params.name;
    const fn = this[name];
    if (!fn) {
        return false;
    }
    fn.call(this, params);
    return true;
}

module.exports = {
    page,
    miniapp,
    webview,
    func
}