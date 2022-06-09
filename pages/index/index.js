import dispatcher from '../dispatcher';

Page({
    data: {
        extra: {
            name: 'extra_name',
            id: 'extra_id'
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
            content: params.get('content'),
            showCancel: false
        });
    }
});
