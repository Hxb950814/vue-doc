# h5和native交互文档

> 本文档为弹性k线 h5 和 安卓，ios app交互文档

## 前言
h5网页运行在app的webview中，webview提供了和网页js的交互方案。开发中可以实现：

- 1. js可以调用app
- 2. app可以调用js

##js变量名
如下几个js变量名，下面会用到
```javascript
window.tkJsBridge; // js对象类型，native端注入的函数请注入在该对象下面
window.tkJsBridgeCallback; // js对象类型， 主要是给native调用的js代码
window.tkJsBridgeLoaded; // 布尔类型， js用它来判断jsbridge是否初始化成功
window.tkJsBridgeReady;  // js函数类型，app端初始化jsbridge时需要调用该函数
```

## 初始化
js端需要检查`jsbridge`的建立成功了之后才能进行安全的js交互, 否则会报错。

app端在初始化webview之后调用如下js代码：
- 安卓在`loadUrl`之后,在`onPageFinished`里面执行`evaluateJavascript`方法传入如下代码来执行js。

```javascript
window.tkJsBridgeLoaded = true;
window.tkJsBridgeReady && window.tkJsBridgeReady();
```
<hr>
安卓java代码示例：

```java
@Override
public void onPageFinished(WebView view, String url) {
   super.onPageFinished(view, url);
   if (loadUrl.equals(url)) {
        //执行代码
        webView.evaluateJavascript("window.tkJsBridgeLoaded = true; window.tkJsBridgeReady && window.tkJsBridgeReady();", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String s) {
                LogUtils.e("kkk", "...evaluateJavascript初始化:" + s);
            }
        });
   }
}
```

至此`jsbridge`初始化成功。

## js调用app代码
`jsbridge`初始化成功， js能够直接调用app注入的函数，每个函数都是固定的模板
比如
```javascript
window.tkJsBridge.getAppInfo(paramString,cbFuncName)
```

- 参数：paramString 字符串，js向native端传递的参数，格式化成为string类型。
- 参数：cbFuncName 字符串，native端需要回调用的js函数名，便于js进行回调，app端请务必回调此函数。

`cbFuncName`接收两个参数，第一个参数是返回码`code`， 第二个参数是app端需要返回的参数。如果发生了错误，code字段是非0的。类似于nodejs的错误优先函数。

<hr>

安卓java代码示例：

```java
 @JavascriptInterface
 public void getAppInfo(String paramString, String callbackFuncName) {
    Map map = new HashMap();
    map.put("appversion", "1.1.1");
    map.put("appmodel", "vivo x10");
    String str = callbackFuncName + "(0, " +  JsonUtil.getInstance().mapJsonString(map)  + ")"; // 接收2个参数
    webView.evaluateJavascript(str, new ValueCallback<String>() {
        @Override
        public void onReceiveValue(String s) {
           LogUtils.e("kkk", "...evaluateJavascript:" + s);
        }
    });
 }
```

## native调用js
js端会把供native端调用的函数放在`window.tkJsBridgeCallback`中，native端之间执行js即可。

如果js端定义了
```javascript
window.tkJsBridgeCallback.showSharePanel;
```
那么native端可以直接执行这段代码。

java代码示例：

```java
   webView.evaluateJavascript(“window.tkJsBridgeCallback.showSharePanel()”, new ValueCallback<String>() {
        @Override
        public void onReceiveValue(String s) {
           LogUtils.e("kkk", "...evaluateJavascript:" + s);
        }
   });
```


## cookie注入

项目网页采用了cookie来进行权限验证，cookie里面的token字段就是登录时存下来的字符串。

native端可以将自己的token注入到webview的cookie里面，来达到权限验证的效果。
目前需要注入两个cookie：
- token: 登录的token，用于权限验证
- platform: 平台 1=安卓 2=ios

```java
    // 同步cookie到h5
public static void syncCookie(Context context, String url, String cookie) {
   CookieSyncManager.createInstance(context);
   CookieManager cookieManager = CookieManager.getInstance();
   cookieManager.setAcceptCookie(true);
   cookieManager.setCookie(url, cookie);
}
// 调用
syncCookie(this, url, "token=" + PreferenceUtils.getToken());
syncCookie(this, url, "platform=1");
```

## 前端封装

>为了方便调用，前端了调用方法目前支持如下方法：

- `onReady(cb)` jsbridge注入完成后的回调函数

- `invoke(funcName,paramString,cb)`  调用app端注入的方法
  - `funcName`: app定义得函数名，具体支持请查看api列表
  - `paramString`: js传给app的参数,必须是字符串
  - `cb`: app回调的函数，类似nodejs 错误优先函数
- `register(funcName,cb)`  注入函数给app端调用

示例：

```javascript
import JsBridge from 'fushui-common/lib/utils/jsbridge';
const instance = JsBridge.getInstance();
instance.onReady(() => {
  console.log('jsbridge准备好了');
  instance.invoke('getAppInfo', '', (errorCode, data) => {
    if(!errorCode){
       console.log('调用getAppInfo成功 获得数据：，' + JSON.stringify(data));
    }
  });
});
instance.register('showLog', '', (data) => {
     console.log('app调用了showLog');
});
```

## api列表

app上实现了如下的方法供js调用：

|  方法名   | 函数说明 | 参数 | 返回参数  |app支持版本  |
|  ----  | ---- |---- |----  |----  |
| getAppInfo |获取app信息 | 无 | { <br>appVersion: 'app版本号', <br>deviceModel: '设备型号', <br> osVersion: 'os版本号' <br>} |全支持 |
| gotoAppPage  |跳转到app页面 | code，<a href="#协议跳转的页面id列表">查看所有</a> | {} |全支持 |

## 协议跳转的页面id列表

js调用页面跳转或者app动态跳转是code的，定义如下，及时更新：

|  code   | 对应页面  |app支持版本  |
|  ----  | ----  |----|
|  **k豆**  | ----  |----|
| kcoin  | 我的k豆 | 全支持 |
| kcoin_product  | k豆产品 | 全支持 |
| kcoin_order  | k豆订单 | 全支持 |
| kcoin_record  | k豆记录 | 全支持 |
|  **帮助中心**  | ----  |----|
| help_center  | 帮助中心 | 全支持 |
| message_center  | 消息中心 | 全支持 |
| notice_platform  | 平台公告 | 全支持 |
| notice_system  | 系统通知 | 全支持 |
| notice_feedback  | 反馈通知 | 全支持 |
|  **其他**  | ----  |----|
| settings  | 系统设置 | 全支持 |
| feedback  | 意见反馈 | 全支持 |
| about_us  | 关于我们 | 全支持 |
| news  | 弹k资讯 | 全支持 |
