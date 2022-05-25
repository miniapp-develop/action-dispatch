const url = require('@xesam/url');

class UrlObject {
    constructor(urlString) {
        this._url = url(urlString);
        if (this._url.query) {
            this._params = this._url.query.split('&')
                .map(pair => {
                    const sepIndex = pair.indexOf('=');
                    return [pair.substring(0, sepIndex), pair.substring(sepIndex + 1)]
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

    assignParams(values = {}) {
        Object.assign(this._params, values);
    }

    get query() {
        return Object.entries(this._params)
            .map(([key, value]) => {
                return `${key}=${value}`;
            })
            .join('&');
    }

    createUrlString() {
        let segments = [];
        segments.push(this._url.protocol ? this._url.protocol + '//' : '');
        segments.push(this._url.host || '');
        segments.push(this._url.pathname || '');
        const query = this.query;
        segments.push(query ? '?' + query : '');
        segments.push(this._url.hash || '');
        return segments.join('');
    }
}

module.exports = UrlObject;