import {func, miniapp, page, webview} from './handlers';

const url = require('@xesam/url');
const urlWithQuery = function (urlStr) {
    const res = url(urlStr);
    if (res.query) {
        res.queryObj = res.query.split('&').map(pair => {
            return pair.split('=');
        }).reduce((obj, [key, value]) => {
            obj[decodeURIComponent(key)] = decodeURIComponent(value);
            return obj;
        }, {});
    }
    return res;
}

const DEFAULT_SCHEME = 'mini';
const DEFAULT_WEBVIEW_PAGE = '/pages/web/index';

class Dispatcher {
    constructor() {
        this._customs = [];
        this._defaults = [page, miniapp, webview, func];
        this.config({scheme: DEFAULT_SCHEME});
    }

    config({scheme = DEFAULT_SCHEME, webview = DEFAULT_WEBVIEW_PAGE}) {
        this._scheme = scheme;
        this._webview = webview;
        return this;
    }

    register(handler) {
        this._customs.push(handler);
        return this;
    }

    parseUrl(urlStr) {
        return urlWithQuery(urlStr);
    }

    handle(context, urlStr) {
        const data = this.parseUrl(urlStr);
        for (let handler of this._customs) {
            const ret = handler.apply(context, [data, urlStr, this]);
            if (ret) {
                return true;
            }
        }
        if (data.scheme !== this._scheme) {
            return false;
        }
        for (let handler of this._defaults) {
            const ret = handler.apply(context, [data, urlStr, this]);
            if (ret) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Dispatcher;