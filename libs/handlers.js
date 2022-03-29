const page = ({host, query}) => {
    if (host !== 'page') {
        return false;
    }
    wx.navigateTo({
        url: query.path
    });
    return true;
};

const miniapp = ({host, query}) => {
    if (host !== 'miniapp') {
        return false;
    }
    wx.navigateToMiniProgram(query);
    return true;
};

function func({host, query}) {
    if (host !== 'func') {
        return false;
    }
    const name = query.name;
    const fn = this[name];
    if (!fn) {
        return false;
    }
    fn.call(this, query);
    return true;
}

export {
    page,
    miniapp,
    func
}