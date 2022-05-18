Page({
    data: {
        src: ''
    },
    onLoad(query) {
        console.log('内置webview', query);
        console.log('内置webview,decode url=', decodeURIComponent(query._url));
    }
});
