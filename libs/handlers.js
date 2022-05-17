const page = ({hostname, params}) => {
    if (hostname !== 'page') {
        return false;
    }
    wx.navigateTo({
        url: decodeURIComponent(params.path)
    });
    return true;
};

const miniapp = ({hostname, params}) => {
    if (hostname !== 'miniapp') {
        return false;
    }
    wx.navigateToMiniProgram(params);
    return true;
};

const webview = ({hostname, query}, actionUrl, dispatcher) => {
    if (hostname !== 'webview') {
        return false;
    }
    wx.navigateTo({
        url: `${dispatcher.config('webview')}?${query}`
    });
    return true;
};

function func({hostname, pathname, params}) {
    if (hostname !== 'func') {
        return false;
    }
    const methodName = pathname.substring(1)
    const method = this[methodName];
    if (!method) {
        return false;
    }
    method.call(this, params);
    return true;
}

function http(action, actionUrl, dispatcher) {
    wx.navigateTo({
        url: `${dispatcher.config('webview')}?url=${encodeURIComponent(actionUrl)}`
    });
    return true;
}

module.exports = {
    page,
    miniapp,
    webview,
    func,
    http
}