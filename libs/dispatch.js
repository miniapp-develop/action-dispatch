const url = require('@xesam/url');
const urlWithQuery = url.create(res => {
    if (res.query) {
        res.query = res.query.split('&').map(pair => {
            return pair.split('=');
        }).reduce((obj, [key, value]) => {
            obj[decodeURIComponent(key)] = decodeURIComponent(value);
            return obj;
        }, {});
    }
    return res;
});

class Dispatcher {
    constructor(name) {
        this._name = name;
        this._handlers = {};
    }

    register(scheme, handler) {
        this._handlers[scheme] = handler;
        return this;
    }

    unregister(scheme) {
        delete this._handlers[scheme];
        return this;
    }

    clearAll() {
        this._handlers = {};
        return this;
    }

    handle(urlStr) {
        const res = urlWithQuery(urlStr);
        const handler = this._handlers[res.scheme];
        if (handler) {
            return {
                done: true,
                value: handler(res)
            }
        } else {
            return {
                done: false
            };
        }
    }
}

module.exports = Dispatcher;