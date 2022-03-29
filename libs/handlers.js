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

function func({host, path, params}) {
    if (host !== 'func') {
        return false;
    }
    const methodName = path.substring(1)
    const fn = this[methodName];
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