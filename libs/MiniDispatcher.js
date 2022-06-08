const Dispatcher = require('./Dispatcher');

function httpHandle(action, rawActionUrl, dispatcher) {
    if (action.protocol !== 'https:') {
        return false;
    }
    const finalUrl = action.toString();
    wx.navigateTo({
        url: `${dispatcher.config('webview')}?_url=${encodeURIComponent(finalUrl)}`
    });
    return true;
}

const pagePathHandle = action => {
    if (action.protocol) {
        return false;
    }
    const finalUrl = action.toString();
    wx.navigateTo({
        url: decodeURIComponent(`${finalUrl}`)
    });
    return true;
};

const pageNameHandle = (action, rawActionUrl, dispatcher) => {
    if (action.hostname !== 'page') {
        return false;
    }
    const pageRoute = dispatcher.getPageRoute(action.searchParams.get('_name'));
    if (pageRoute) {
        wx.navigateTo({
            url: decodeURIComponent(`${pageRoute}${action.search}`)
        });
    } else {
        console.error('没有找到 page:', action.searchParams.get('_name'));
    }
    return true;
};

const miniappHandle = action => {
    if (action.hostname !== 'miniapp') {
        return false;
    }
    let finalParams = {};
    for (let key in params) {
        finalParams[key] = decodeURIComponent(params[key]);
    }
    wx.navigateToMiniProgram(finalParams);
    return true;
};

const webviewHandle = ({hostname, query}, rawActionUrl, dispatcher) => {
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

    handleAction(action, rawActionUrl, miniContext) {
        const highPriority = super.handleAction(action, rawActionUrl, miniContext);
        if (highPriority) {
            return true;
        }
        if (action.protocol !== this.config('protocol')) {
            return false;
        }
        return super._handleAction([pageNameHandle, miniappHandle, webviewHandle, functionHandle], action, rawActionUrl, this, miniContext);
    }
}

module.exports = MiniDispatcher;