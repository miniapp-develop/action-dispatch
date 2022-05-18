const {MiniDispatcher} = require('../libs/index');
export default new MiniDispatcher({
    pageB: '/pages/pageB/index'
}).registerHandle(({hostname, params}, actionUrl, dispatcher) => {
    if (hostname === 'dialog') {
        wx.showModal({
            title: params.title,
            content: params.content
        });
        return true;
    }
    return false;
});