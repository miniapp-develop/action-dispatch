import {func, miniapp, page} from './handlers';

const url = require('@xesam/url');
const urlWithQuery = function (urlStr) {
    const res = url(urlStr);
    if (res.query) {
        res.query = res.query.split('&').map(pair => {
            return pair.split('=');
        }).reduce((obj, [key, value]) => {
            obj[decodeURIComponent(key)] = decodeURIComponent(value);
            return obj;
        }, {});
    }
    return res;
}

const DEFAULT_SCHEME = 'mini';

class Dispatcher {
    constructor() {
        this._customs = [];
        this._defaults = [page, miniapp, func];
        this.config({scheme: DEFAULT_SCHEME});
    }

    config({scheme = DEFAULT_SCHEME}) {
        this._scheme = scheme;
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
            const ret = handler.apply(context, [data, urlStr]);
            if (ret) {
                return true;
            }
        }
        if (data.scheme !== this._scheme) {
            return false;
        }
        for (let handler of this._defaults) {
            const ret = handler.apply(context, [data, urlStr]);
            if (ret) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Dispatcher;