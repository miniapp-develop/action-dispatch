const {MiniDispatcher} = require('../libs/index');
export default new MiniDispatcher({
    pageB: '/pages/pageB/index'
}).registerHandle((action, originActionUrl, dispatcher) => {
    if (action.hostname === 'dialog') {
        wx.showModal({
            title: action.searchParams.get('title'),
            content: action.searchParams.get('content')
        });
        return true;
    }
    return false;
});