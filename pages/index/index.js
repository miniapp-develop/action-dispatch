import dispatcher from '../dispatcher';

Page({
    data: {
        extra: {
            name: 'index',
            id: '000000000000001'
        }
    },
    onLoad(query) {
    },
    onUnload() {
    },
    onTap(e) {
        const actionUrl = e.target.dataset.url;
        dispatcher.handle(actionUrl, this);
    },
    aFn() {
        wx.showModal({
            content: '默认弹框'
        });
    }
});
