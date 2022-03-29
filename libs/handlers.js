const page = ({host, queryObj}) => {
    if (host !== 'page') {
        return false;
    }
    wx.navigateTo({
        url: queryObj.path
    });
    return true;
};

const miniapp = ({host, queryObj}) => {
    if (host !== 'miniapp') {
        return false;
    }
    wx.navigateToMiniProgram(queryObj);
    return true;
};

const webview = ({host, query, queryObj}, urlStr, dispatcher) => {
    if (host !== 'webview') {
        return false;
    }
    wx.navigateTo({
        url: `${dispatcher._webview}?${query}`
    });
    return true;
};

function func({host, queryObj}) {
    if (host !== 'func') {
        return false;
    }
    const name = queryObj.name;
    const fn = this[name];
    if (!fn) {
        return false;
    }
    fn.call(this, queryObj);
    return true;
}

module.exports = {
    page,
    miniapp,
    webview,
    func
}