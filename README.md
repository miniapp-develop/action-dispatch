# miniapp action dispatch

处理小程序内各种动态下发的跳转。

### 使用方式

安装：

```shell script
npm install @mini-dev/action-dispatch
```

配置默认的 webview 地址：

```javascript

const Dispatcher = require("@mini-dev/action-dispatch");
const dispatcher = new Dispatcher();
dispatcher.config("webview", '/pages/web/index');

```

配置自定义处理函数：

```javascript
dispatcher.register(({scheme, host, queryObj}, urlStr, current) => {
    if (scheme === 'http' || scheme === 'https') {
        wx.navigateTo({
            url: `${current._webview}?url=${urlStr}`
        });
        return true;
    }
    return false;
});
```

处理跳转 url

```javascript
dispatcher.handle(pageThis, urlStr);
```

### 内置默认跳转协议

#### 跳转小程序内的其他页面

    mini://page?path={page path}

#### 跳转到网页

    mini://webview?url={webpage path}

#### 跳转到其他小程序

    mini://miniapp?appId={miniapp id}&path={page path}
        
#### 执行特定方法

    mini://func/{function name}?param1=value1

### 修改默认协议

```javascript

dispatcher.config('scheme','test');

```
这样，默认的跳转协议就变成：

    test://page?path={page path}
    test://webview?url={webpage path}
    test://miniapp?appId={miniapp id}&path={page path}
    test://{function name}?param1=value1
    
    