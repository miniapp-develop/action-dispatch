const url = require('@xesam/url');
const {func, miniapp, page, webview} = require('./handlers');
const urlWithQuery = function (urlStr) {
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
    constructor() {
        this._customs = [];
        this._defaults = [page, miniapp, webview, func];
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

    parseAction(urlStr) {
        return urlWithQuery(urlStr);
    }

    handle(actionUrl, miniContext, inject = {}) {
        const action = this.parseAction(actionUrl);
        if (typeof inject === 'function') {
            action.params = inject(action.params) || {};
        } else {
            Object.assign(action.params, inject);
        }
        for (let handler of this._customs) {
            const ret = handler.apply(miniContext, [action, actionUrl, this]);
            if (ret) {
                return true;
            }
        }
        if (action.scheme !== this.config('scheme')) {
            return false;
        }
        for (let handler of this._defaults) {
            const ret = handler.apply(miniContext, [action, actionUrl, this]);
            if (ret) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Dispatcher;