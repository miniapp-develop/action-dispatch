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

    _handleAction(handles, action, rawActionUrl, dispatcher, handleContext) {
        for (let handle of handles) {
            const ret = handle.apply(handleContext, [action, rawActionUrl, dispatcher]);
            if (ret) {
                return true;
            }
        }
        return false;
    }

    handleAction(action, rawActionUrl, handleContext) {
        return this._handleAction(this._handles, action, rawActionUrl, this, handleContext);
    }

    handle(actionUrl, extra, handleContext) {
        const action = this._parseAction(actionUrl);
        action.assignParams(extra);
        return this.handleAction(action, actionUrl, handleContext);
    }
}

module.exports = Dispatcher;