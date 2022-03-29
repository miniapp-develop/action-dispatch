import dispatcher from '../../dispatcher';

Page({
    data: {},
    onLoad(query) {
    },
    onUnload() {
    },
    onTap(e) {
        const urlStr = e.target.dataset.url;
        dispatcher.handle(this, urlStr);
    },
    aFn() {
        wx.showModal({
            content: '默认弹框'
        });
    }
});
