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
        dispatcher.handle(actionUrl, this.data.extra, this);
    },
    aFn(params) {
        wx.showModal({
            title: params.get('title'),
            content: '默认弹框'
        });
    }
});
