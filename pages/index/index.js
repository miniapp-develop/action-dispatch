const Dispatcher = require('../../libs/dispatch');

Page({
    data: {},
    onLoad(query) {
        this.dispatcher = new Dispatcher('index');
        this.dispatcher.register('mini', ({host, query}) => {
            console.log({host, query})
            if (host === 'page') {
                wx.navigateTo({
                    url: `/pages/${query.path}/index`
                })
            } else if (host === 'mp') {
                wx.navigateToMiniProgram({
                    appId: query.appId
                })
            } else if (host === 'web') {
                console.log('打开网页', query.url);
            } else if (host === 'dialog') {
                wx.showModal({
                    title: query.title,
                    content: query.content
                })
            }
        });
    },
    onUnload() {
        this.dispatcher.clearAll();
    },
    onTap(e) {
        const urlStr = e.target.dataset.url;
        this.dispatcher.handle(urlStr);
    }
});
