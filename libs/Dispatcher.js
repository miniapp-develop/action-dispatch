const UrlObject = require('./UrlObject');
const DEFAULT_WEBVIEW_PAGE = '/pages/web/index';

class Dispatcher {
    constructor() {
        this._handles = [];
        this._cfg = {
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

    registerHandle(handle) {
        this._handles.unshift(handle);
        return this;
    }

    _parseAction(actionUrl) {
        return new UrlObject(actionUrl);
    }

    _handleAction(handles, action, actionUrl, dispatcher, miniContext) {
        for (let handle of handles) {
            const ret = handle.apply(miniContext, [action, actionUrl, dispatcher, miniContext]);
            if (ret) {
                return true;
            }
        }
        return false;
    }

    handleAction(action, actionUrl, miniContext) {
        return this._handleAction(this._handles, action, actionUrl, this, miniContext);
    }

    handle(actionUrl, extra, miniContext) {
        const action = this._parseAction(actionUrl);
        action.assignParams(extra);
        return this.handleAction(action, actionUrl, miniContext);
    }
}

module.exports = Dispatcher;