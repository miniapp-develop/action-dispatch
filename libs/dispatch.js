const url = require('@xesam/url');
const {func, miniapp, page, webview} = require('./handlers');
const urlWithParams = function (urlStr) {
    const res = url(urlStr);
    res.params = {};
    if (res.query) {
        res.params = res.query.split('&')
            .map(pair => {
                return pair.split('=');
            })
            .reduce((obj, [key, value]) => {
                obj[decodeURIComponent(key)] = decodeURIComponent(value); // todo 处理多选的情况
                return obj;
            }, res.params);
    }
    return res;
}

const DEFAULT_SCHEME = 'mini';
const DEFAULT_WEBVIEW_PAGE = '/pages/web/index';

class Dispatcher {
    constructor(delegate = DEFAULT_DISPATCHER) {
        this._defaults = delegate;
        this._customs = [];
        this._cfg = {
            scheme: DEFAULT_SCHEME,
            webview: DEFAULT_WEBVIEW_PAGE
        };
    }

    config(name, value) {
        if (arguments.length === 0) {
            return this._cfg;
        } else if (arguments.length === 1) {
            return this._cfg[arguments[0]];
        } else {
            this._cfg[arguments[0]] = arguments[1];
            return this;
        }
    }

    register(handler) {
        this._customs.push(handler);
        return this;
    }

    parseAction(actionUrl) {
        return urlWithParams(actionUrl);
    }

    handle(actionUrl, miniContext, extra = {}) {
        const action = this.parseAction(actionUrl);
        Object.assign(action.params, extra);
        for (let handler of this._customs) {
            const ret = handler.apply(miniContext, [action, actionUrl, this, miniContext]);
            if (ret) {
                return true;
            }
        }
        if (this._defaults) {
            return this._defaults.handle(actionUrl, miniContext, extra);
        }
        return false;
    }
}

const DEFAULT_DISPATCHER = new Dispatcher(null);
DEFAULT_DISPATCHER.register((action, actionUrl, dispatcher, context) => {
    if (action.scheme !== dispatcher.config('scheme')) {
        return false;
    }
    for (let handler of [page, miniapp, webview, func]) {
        const ret = handler.apply(context, [action, actionUrl, dispatcher, context]);
        if (ret) {
            return true;
        }
    }
    return false;
});

module.exports = Dispatcher;