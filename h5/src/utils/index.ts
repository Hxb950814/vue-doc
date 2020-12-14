/* 是否是手机号号 */
import {HomeModule} from "@/store/modules/user/home";
import router from "../router";
import request from "@/utils/request";
import config from "@/utils/config";
import {showLoading, closeLoading, showToast, showMessageBox, showMessagePanel} from '@/utils/ui';

export function isMobile(value: string): boolean {
  // eslint-disable-next-line
    return /^[1][2,3,4,5,6,7,8,9,0][0-9]{9}$/.test(value);
}

/* 是否是身份证号 */
export function isIdNumber(value: string): boolean {
  // eslint-disable-next-line
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}

/* 是否是邮箱 */
export function isEmail(value: string): boolean {
  // eslint-disable-next-line
    return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value);
}


/* 是否是中文 */
export function isChinese(value: string) : boolean {
    return /^[(\u4e00-\u9fa5)]+$/.test(value);
}

/* 是否是字母和数字的组合 */
export function isMixNumberLetter(value: string) : boolean {
    return /^[0-9a-zA-Z]*$/.test(value);
}

/* 是否是URL */
export function isURL(value: string): boolean {
  // eslint-disable-next-line
    return /^http(s)?:\/\//.test(value);
}

export function sleep(time: number): Promise<any> {
  return new Promise((resolve: Function) => {
    setTimeout(resolve, time);
  });
}

export function designatedSite(value: string): boolean {
    // eslint-disable-next-line
    // 这里是正式和测试都做了
    return /^(http(s)?:\/\/)((test)?m\.qiuzhicaitang\.com)/g.test(value)
}

// hbb 公共方法
/* 只能输入正整数 or 保留小数点后2位 or 保留小数点后1位 */
export function integer(value: string, mode: number) {
  // mode:1 只能输入整数 2：保留小数点后面2位 3：保留小数点后面1位
  let v;
  switch (mode) {
    case 1:
      v = value.replace(/[^0-9]/g, "");
      break;
    case 2:
      v = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, "$1");
      break;
    case 3:
      v = value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, "$1");
      break;
    default:
      break;
  }
  return v;
}

export function tabIndexFn(obj:any) {
    setTimeout(() => {
        for (let i=0;i<document.getElementsByClassName(obj).length;i++) {
            document.getElementsByClassName(obj)[i].setAttribute('tabindex', 'none')
        }
    },0)
}


// 微信授权地址返回的动态地址设置
export function setRouterUrl(str:string) {
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(str)}&response_type=code&scope=snsapi_userinfo&state=STATE`;
}

export function getParameter(name:any) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2])
    }
    return null
}


export function funcUrlDel(names:any) {
    if(typeof(names)=='string'){
        names = [names];
    }
    var loca = window.location;
    var baseUrl;
    var obj = {}
    var arr = loca.search.substr(1).split("&");
    //获取参数转换为object
    for(var i = 0; i < arr.length; i++) {
        // @ts-ignore
        arr[i] = arr[i].split("=");
        // @ts-ignore
        obj[arr[i][0]] = arr[i][1];
    };
    //删除指定参数
    for(var i = 0; i < names.length; i++) {
        // @ts-ignore
        delete obj[names[i]];
    }
    //重新拼接url
    var url = loca.origin + loca.pathname + "?" + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
    return url;
}

export function RequestUrl (name:any) {
    var url = decodeURIComponent(location.search);
    var r = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        let strs;
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            // @ts-ignore
            r[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    // @ts-ignore
    return name == undefined ? r : r[name];
}

// 微信授权的公共方法

export function setUserInfo() {
    const code = getParameter('code');
    if(code){
        showLoading('授权中...');
        let abcde = localStorage.getItem('abcde');
        request.post('/user/userWeChatInfo', {code, abcde}, {
            paramType: 'form'
        }).then((res: any) => {
            if (res.code === '000000') {
                showToast('登录成功');
                localStorage.removeItem('abcde');
                handleData(res);
            } else {
            }
        }).catch((err: any) => {
            console.log('err', err);
        });
    } else {
        setTimeout(() => {
            const isAuth = (router as any).history.current.meta.auth;
            if(isAuth) {
                location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(location.href)}&response_type=code&scope=snsapi_userinfo&state=STATE`;
            } else {
                return false;
            }
        },500);
    }
}

function handleData(res:any) {
    console.log(res)
    const openId = res.data.openId;
    const nickname = res.data.nickName;
    const head = res.data.photo;
    const token = res.data.token;
    const studentNo = res.data.studentNo;
    const userId = res.data.userId;
    HomeModule.setOpenId(openId);
    HomeModule.setToken(token);
    HomeModule.setNickName(nickname);
    HomeModule.setHead(head);
    HomeModule.setStudentNo(studentNo);
    HomeModule.setUId(userId);
    localStorage.setItem('abcde', userId)
    //location.href.replace(window.location.search, '');
    let str =  funcUrlDel('code');
    window.location.href = str.replace("?state=STATE", '').replace("&state=STATE", '');
}

//  截取指定前几位的字符选
export function getSubString(str:string) {
    const s = str.length > 10 ? str.substring(0,10) + '...' : str;
    return s;
}


