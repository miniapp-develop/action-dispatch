const UrlObject = require('@xesam/url-object');
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
        return UrlObject(actionUrl);
    }

    _handleAction(handles, action, originActionUrl, dispatcher, handleContext) {
        for (let handle of handles) {
            const ret = handle.apply(handleContext, [action, originActionUrl, dispatcher]);
            if (ret) {
                return true;
            }
        }
        return false;
    }

    handleAction(action, originActionUrl, handleContext) {
        return this._handleAction(this._handles, action, originActionUrl, this, handleContext);
    }

    handle(actionUrl, extra, handleContext) {
        const action = this._parseAction(actionUrl);
        if (extra) {
            for (const k in extra) {
                action.searchParams.append(k, extra[k]);
            }
        }
        return this.handleAction(action, actionUrl, handleContext);
    }
}

module.exports = Dispatcher;