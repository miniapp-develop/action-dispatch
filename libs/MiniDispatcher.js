const Dispatcher = require('./Dispatcher');

function httpHandle(action, originActionUrl, dispatcher) {
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
    wx.navigateTo({
        url: decodeURIComponent(action.toString())
    });
    return true;
};

const pageNameHandle = (action, originActionUrl, dispatcher) => {
    if (action.hostname !== 'page') {
        return false;
    }
    const pageName = action.searchParams.get('_name');
    const pageRoute = dispatcher.getPageRoute(pageName);
    if (pageRoute) {
        wx.navigateTo({
            url: decodeURIComponent(`${pageRoute}${action.search}`)
        });
    } else {
        console.error('没有找到 page:', pageName, originActionUrl);
    }
    return true;
};

const miniappHandle = action => {
    if (action.hostname !== 'miniapp') {
        return false;
    }
    let finalOption = {};
    action.searchParams.keys().forEach(key => {
        finalOption[key] = decodeURIComponent(action.searchParams.get(key));
    });
    wx.navigateToMiniProgram(finalOption);
    return true;
};

const webviewHandle = ({hostname, search}, originActionUrl, dispatcher) => {
    if (hostname !== 'webview') {
        return false;
    }
    wx.navigateTo({
        url: `${dispatcher.config('webview')}${search}`
    });
    return true;
};

function functionHandle(action) {
    if (action.hostname !== 'function') {
        return false;
    }
    const methodName = action.pathname.substring(1)
    const method = this[methodName];
    if (!method) {
        return false;
    }
    method.call(this, action.searchParams);
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

    handleAction(action, originActionUrl, miniContext) {
        const highPriority = super.handleAction(action, originActionUrl, miniContext);
        if (highPriority) {
            return true;
        }
        if (action.protocol !== this.config('protocol')) {
            return false;
        }
        return super._handleAction([pageNameHandle, miniappHandle, webviewHandle, functionHandle], action, originActionUrl, this, miniContext);
    }
}

module.exports = MiniDispatcher;