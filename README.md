# miniapp action dispatch

处理小程序内各种动态下发的跳转。

### 使用方式

安装：

```shell script
npm install @mini-dev/action-dispatch
```

配置默认的 webview 页面地址：

```javascript

const {Dispatcher, MiniDispatcher} = require("@mini-dev/action-dispatch");
const dispatcher = new MiniDispatcher();
dispatcher.config("webview", '/pages/web/index');

```

配置自定义处理函数：

```javascript
dispatcher.register(({scheme, host, queryObj}, actionUrl, dispatcher) => {
    if (scheme === 'http' || scheme === 'https') {
        wx.navigateTo({
            url: `${dispatcher.config('webview')}?url=${actionUrl}`
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

### 默认支持的跳转协议

#### 根据具体路径跳转到小程序内的其他页面

    /pages/pageB/index?from=source1

通过 extra 传入的参数，都会被附加到执行跳转的 path 上。

比如：

```javascript
dispatcher.handle('/pages/pageB/index?from=source1', {a:100})
```
最终执行跳转的 path 为：

   /pages/pageB/index?from=source1&a=100

#### 通过页面名称跳转小程序内的其他页面

    mini://page?_name={page name}&key=value

其中 _name 指定目标页面的名字，其他参数（比如：key=value）、以及通过 extra 传入的参数，都会被附加到执行跳转的 path 上。

比如：

```javascript
dispatcher.handle('mini://page?_name=pageA&from=source2', {a:100})
```
最终执行跳转的 path 为：

   /pages/pageB/index?_name=pageA&from=source2&a=100
   
#### 跳转具体链接到网页

    https://aa.bb.cc/xyz?key=value&from=source5
    
通过 extra 传入的参数，都会被附加到最终的网页地址上。

#### 跳转到网页

    mini://webview?_url={webpage url}&key=value

其中 _url 指定目标网页的链接地址，其他参数（比如：key=value）、以及通过 extra 传入的参数，都会被附加到执行跳转的 path 上，而不是最终的网页地址上。

#### 跳转到其他小程序

    mini://miniapp?appId={miniapp id}&path={page path}
        
#### 执行特定方法

    mini://func/{function name}?param1=value1

### 修改默认协议

```javascript

dispatcher.config('protocol','test');

```
这样，默认的跳转协议就变成：

    test://page?_name={page name}
    test://webview?_url={webpage url}
    test://miniapp?appId={miniapp id}&path={page path}
    test://{function name}?param1=value1
    
    