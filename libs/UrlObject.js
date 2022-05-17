const url = require('@xesam/url');

class UrlObject {
    constructor(urlString) {
        this._url = url(urlString);
        if (this._url.query) {
            this._params = this._url.query.split('&')
                .map(pair => {
                    return pair.split('=');
                })
                .reduce((obj, [key, value]) => {
                    obj[key] = value; // todo 处理多选的情况
                    return obj;
                }, {});
        } else {
            this._params = {};
        }
    }

    get protocol() {
        return this._url.protocol
    }

    get hostname() {
        return this._url.hostname
    }

    get pathname() {
        return this._url.pathname
    }

    get params() {
        return this._params;
    }

    assignParams(values) {
        Object.assign(this._params, values);
    }

    get query() {
        return Object.entries(this._params)
            .map(([key, value]) => {
                return `${key}=${value}`;
            })
            .join('&');
    }

    getUrlString() {

    }
}

module.exports = UrlObject;