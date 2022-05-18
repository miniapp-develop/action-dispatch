const Dispatcher = require('./Dispatcher');

function httpHandle(action, actionUrl, dispatcher) {
    if (action.protocol !== 'https:') {
        return false;
    }
    const finalUrl = action.createUrlString();
    wx.navigateTo({
        url: `${dispatcher.config('webview')}?_url=${encodeURIComponent(finalUrl)}`
    });
    return true;
}

const pagePathHandle = (action) => {
    if (action.protocol) {
        return false;
    }
    const finalUrl = action.createUrlString();
    wx.navigateTo({
        url: decodeURIComponent(`${finalUrl}`)
    });
    return true;
};

const pageNameHandle = ({hostname, params, query}, actionUrl, dispatcher) => {
    if (hostname !== 'page') {
        return false;
    }
    const pageRoute = dispatcher.getPageRoute(params._name);
    if (!pageRoute) {
        console.error('没有找到 page:', params._name);
    } else {
        wx.navigateTo({
            url: decodeURIComponent(`${pageRoute}?${query}`)
        });
    }
    return true;
};

const miniappHandle = ({hostname, params}) => {
    if (hostname !== 'miniapp') {
        return false;
    }
    let finalParams = {};
    for (let key in params) {
        finalParams[key] = decodeURIComponent(params[key]);
    }
    wx.navigateToMiniProgram(finalParams);
    return true;
};

const webviewHandle = ({hostname, query}, actionUrl, dispatcher) => {
    if (hostname !== 'webview') {
        return false;
    }
    wx.navigateTo({
        url: `${dispatcher.config('webview')}?${query}`
    });
    return true;
};

function functionHandle({hostname, pathname, params}) {
    if (hostname !== 'function') {
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

class MiniDispatcher extends Dispatcher {

    constructor(pageRoutes) {
        super(arguments);
        this._routes = pageRoutes;
        this.config('protocol', 'mini:');
        this.registerHandle(httpHandle)
            .registerHandle(pagePathHandle);
    }

    getPageRoute(pageName) {
        return this._routes[pageName];
    }

    handleAction(action, actionUrl, miniContext) {
        const highPriority = super.handleAction(action, actionUrl, miniContext);
        if (highPriority) {
            return true;
        }
        if (action.protocol !== this.config('protocol')) {
            return false;
        }
        return super._handleAction([pageNameHandle, miniappHandle, webviewHandle, functionHandle], action, actionUrl, this, miniContext);
    }
}

module.exports = MiniDispatcher;