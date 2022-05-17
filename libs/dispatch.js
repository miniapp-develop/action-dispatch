const UrlObject = require('./UrlObject');
const {func, miniapp, page, webview, http} = require('./handlers');

const DEFAULT_PROTOCOL = 'mini:';
const DEFAULT_WEBVIEW_PAGE = '/pages/web/index';

class Dispatcher {
    constructor(delegate = DEFAULT_DISPATCHER) {
        this._defaults = delegate;
        this._customs = [];
        this._cfg = {
            protocol: DEFAULT_PROTOCOL,
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
        return new UrlObject(actionUrl);
    }

    handle(actionUrl, miniContext, extra = {}) {
        const action = this.parseAction(actionUrl);
        action.assignParams(extra);
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
    if (action.protocol === 'http:' || action.protocol === 'https:') {
        const ret = http.apply(context, [action, actionUrl, dispatcher, context]);
        if (ret) {
            return true;
        }
    } else if (action.protocol !== dispatcher.config('protocol')) {
        for (let handler of [page, miniapp, webview, func]) {
            const ret = handler.apply(context, [action, actionUrl, dispatcher, context]);
            if (ret) {
                return true;
            }
        }
    }
    return false;
});

module.exports = Dispatcher;