import axios, { AxiosError, AxiosResponse } from 'axios';
import to from 'await-to-js';
import Cookie from 'js-cookie';
import envConf from '@root/env.json';
import { getOriginalUrl, getRedirect, getToken, getFutureToken } from '@/utils/server_var';

// 开发环境走代理，不需要配置
const env = process.env.NODE_ENV === 'development' ? envConf.www.dev : envConf.www.release || {};

interface HttpResponsePageType {
    hasNext: boolean; // 是否有下一页
    hasPre: boolean; // 是否有上一页
    nextPage: number; // 下一页No
    pageNo: number; // 当前页No
    pageSize: number;// 一页多少条
    prePage: number;// 上一页No
    totalCount: number;// 数据总条数
    totalPage: number;// 数据总页数
    result: any[] // 数据
}

/* JSON 数据返回结构 */
export interface HttpResponseBodyType {
    code: string;
    data: any | HttpResponsePageType;
    message: string;
}

/* CQuote的 数据返回结构 */
export interface HttpResponseCQuoteBodyType {
    // eslint-disable-next-line camelcase
    err_code: number;
    // eslint-disable-next-line camelcase
    err_msg: string;
    data: any;
}

const service = axios.create({
    timeout: 15000, // 请求超时时间
    withCredentials: true, // 允许跨域携带cookie
    headers: { // 默认配置请求头
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json'
    }
});

// request拦截器
service.interceptors.request.use((config: any) => {
    let token = '';
    let futureToken = '';
    if (process.server) {
        token = getToken();
        futureToken = getFutureToken();
        // console.log('futureToken', futureToken);
    } else {
        token = Cookie.get('token') || '';
        futureToken = Cookie.get('futureToken') || '';
    }
    config.headers.pcToken = token || '';
    config.headers.pcFuturetoken = futureToken || '';
    console.log(
        `${!process.server ? '【浏览器】' : '【服务端】'}:${config.method}  ${config.url}  参数:【${config.data || '无'}】, token:${token ? '有' : '无'}`
    );

    return config;
}, (error: any) => {
    Promise.reject(error);
});

// response拦截器
service.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        if (response.request.responseType === 'arraybuffer' ||
            response.request.responseType === 'blob') {
            return response;
        }
        const resCode = response.data.code;
        if (resCode === '200004') { // 无登录权限
            if (response.config?.url?.endsWith('/user/validateToken')) { // 白名单
                return response.data;
            }
            // 没有权限就直接删除cookie
            if (process.server) { // 服务端拦截
                const redirect = getRedirect();
                const path = getOriginalUrl();
                redirect && redirect(`/auth/login?delkey=1&to=${encodeURIComponent(path)}`);
            } else {
                setTimeout(() => {
                    window.location.href = `/auth/login?delkey=2&to=${encodeURIComponent(location.pathname + location.search)}`; // 回
                }, 0);
            }
            return Promise.reject(new Error('need login'));
        } else if (resCode === '200005') { // 权限不足
            return Promise.reject(new Error('permission error'));
        } else if (resCode === '200006') { // 期货账号权限不足（未登录）
            Cookie.remove('futureToken');
           // return Promise.reject(new Error('permission error'));
        }
        return response.data;
    },
    (error: AxiosError) => {
        if (error.message.includes('timeout')) {
            console.log('请求超时,接口:', error.config.url);
        } else if (error.message === 'Request failed with status code 404') {
            console.log('请求接口404, 接口:', error.config.url);
        } else {
            console.log('请求接口发生了错误, 接口:', error.config.url);
        }
        // @ts-ignore
        return Promise.reject(error);
    }
);

export interface HttpRequestSetting {
    paramType?: 'json' | 'url' | 'file'; // 请求参数类型
    responseType?: 'arraybuffer' | 'blob'; // 返回参数类型
    proxyType?: 'api' | 'tquote_api' | 'cquote_api'; // 代理组的名字  api=app数据  api_tquote=行情数据(上海) cquote_api=行情(北京)
    domain?: string; // domain (有domain 则 proxyType将不生效)
}

/* 非同步的接口 */
export type HttpRequestMethod = (
    path: string,
    params?: object,
    setting?: HttpRequestSetting
) => Promise<HttpResponseBodyType | undefined>;

/* 同步的接口 */
export type HttpRequestMethodAsync = (
    path: string,
    params?: object,
    setting?: HttpRequestSetting
) => Promise<[Error | null, HttpResponseBodyType | undefined]>;

const defaultHttpRequestSetting: HttpRequestSetting = {
    paramType: 'url',
    proxyType: 'api',
    responseType: undefined,
    // @ts-ignore
    domain: env['API_PATH_' + env.API_ENV] || env.API_PATH
};

const defaultHttpCqouteRequestSetting: HttpRequestSetting = {
    paramType: 'json',
    proxyType: 'cquote_api',
    responseType: undefined,
    domain: process.env.CQUOTE_PATH || ''
};

function json2Url(data: any) {
    if (!data) {
        return '';
    }
    let strData = '';
    Object.keys(data).forEach((item) => {
        strData += item + '=' + data[item] + '&';
    });
    if (strData.length > 0) {
        strData = strData.slice(0, strData.length - 1);
    }
    return strData;
}

function urlTrim(path: string) {
    return path.replace(/(\/){2,}/g, '/');
}

export function get(path: string, params = {}, setting?: HttpRequestSetting): Promise<HttpResponseBodyType | undefined> {
    const newSetting = { ...defaultHttpRequestSetting, ...setting };
    return service.get(path, {
        /* 只有测试时候的服务器才不需要走代理 */
        baseURL: process.server ? newSetting.domain : '/' + newSetting.proxyType,
        params,
        responseType: newSetting.responseType
    });
}

export function post(path: string, params = {}, setting?: HttpRequestSetting): Promise<HttpResponseBodyType | undefined> {
    const newSetting = { ...defaultHttpRequestSetting, ...setting };
    const isSetDomain = setting?.domain;
    const url = (process.server ? newSetting.domain : '/' + newSetting.proxyType) + urlTrim('/' + path);
    if (newSetting.paramType === 'url') {
        return service.post(url, json2Url(params), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: newSetting.responseType
        });
    } else if (newSetting.paramType === 'file') {
        return service.post(url, params, {
           headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
    return service.post(url, Object.keys(params).length === 0 ? undefined : params, {
        responseType: newSetting.responseType
    });
}

export async function getAsync(path: string, params = {}, setting?: HttpRequestSetting): Promise<[Error | null, HttpResponseBodyType | undefined]> {
    return await to<HttpResponseBodyType | undefined>(get(path, params, setting));
}

export async function postAsync(path: string, params = {}, setting?: HttpRequestSetting): Promise<[Error | null, HttpResponseBodyType | undefined]> {
    return await to<HttpResponseBodyType | undefined>(post(path, params, setting));
}
