# miniapp action dispatch

处理小程序内各种动态下发的跳转。

### 默认跳转协议

#### 跳转小程序内的其他页面

    mini://page?path={page path}

#### 跳转到网页

    mini://webview?url={webpage path}

#### 跳转到其他小程序

    mini://miniapp?appId={miniapp id}&path={page path}
        
#### 执行特定方法

    mini://func?name={function name}
    
    
    
    
    