Page({
    data: {
        src: ''
    },
    onLoad(query) {
        console.log('内置webview', query);
        console.log('内置webview, decodeURIComponent(url)=', decodeURIComponent(query._url));
        this.setData({
            src: decodeURIComponent(query._url)
        });
    }
});
