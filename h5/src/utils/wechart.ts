import request from "./request";
import wx from 'weixin-jsapi';
import config from "./config";
import {HomeModule} from "@/store/modules/user/home";



function replaceSpecialChar(url:any) {
    url = url.replace(/&quot;/g, '"');
    url = url.replace(/&amp;/g, '&');
    url = url.replace(/&lt;/g, '<');
    url = url.replace(/&gt;/g, '>');
    url = url.replace(/&nbsp;/g, ' ');
    return url;
}


// 找到地址栏指定参数的最后一个  多个或者单个
function lastParams(s:any) {
    if(s.indexOf('?') !== -1) {
        var a = s.split('?');
        var b = a[1].split('&');
        var c = b.filter((x:any) => x.indexOf('abcde') !== -1);
        var d = c.length ? [c[c.length -1]] : [];
        var e = b.filter((x:any) => x.indexOf('abcde')  === -1);
        var f = a[0] + '?' + [...e, ...d].join('&');
        return f;
    } else {
        return s;
    }
}

// 得到地址栏参数的值根据 key获得value
function GetQueryString(name:any){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if(r!=null)return  unescape(r[2]);
    return null;
}
// 获取分享信息接口
async function getshareInfo(url:any) {
    let targetUrl = lastParams(url);
    const resp = await request.getAsync("/userInvite/getshareInfo", {url:targetUrl});
    return new Promise(resolve => {
        resolve(resp[1]?.data)
    })
}

const appweixin = {
    isWeiXin: function () {
        var matches = window.navigator.userAgent.match(/MicroMessenger/i);
        return !!(matches && matches[0]);
    },
    onMenuShare:function (shareData:any) {
        if (!appweixin.isWeiXin()) {
            return false;
        }
        getshareInfo(shareData.show).then((r:any) => {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: r.appId, // 必填，公众号的唯一标识
                timestamp: r.timestamp, // 必填，生成签名的时间戳
                nonceStr: r.nonceStr, // 必填，生成签名的随机串
                signature: r.signature, // 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ'
                ]
            });
            wx.ready(function () {
                shareData = shareData || {
                    title: "求知财堂",
                    desc: "认知决定财富",
                    link: config.url,
                    imgUrl: "https://rs.qiuzhicaitang.com/static/images/qiuzhicaitangicon.png",
                    success: function () {
                        // 分享成功可以做相应的数据处理
                        alert('分享成功')
                        alert('appId:' + r.appId)
                        alert('timestamp:' + r.timestamp)
                        alert('nonceStr:' + r.nonceStr)
                        alert('signature:' + r.signature)
                    },
                    fail: function () {
                        alert('调用失败')
                    },
                    complete: function () {
                        alert('调用结束')
                    }
                };
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);
                wx.onMenuShareQQ(shareData);
            });
            wx.error(function (res:any) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，
                // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
                // 对于SPA可以在这里更新签名。
                console.log(res, '222');
            })
        })
    }
};

export {appweixin};
