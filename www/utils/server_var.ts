/* 保存服务端一些变量 */
let _redirect: Function | null = null; //
let _originalUrl: string = '';
let _token: string = ''; // token
let _future_token: string = ''; // 期货账户 token
let _platform: string = '';

export function setOriginalUrl(url: string) {
    _originalUrl = url;
}

export function getOriginalUrl() {
    return _originalUrl;
}

export function setRedirect(redi: Function) {
    _redirect = redi;
}

export function getRedirect() {
    return _redirect;
}

export function setToken(token: string) {
    _token = token;
}

export function getToken() {
    return _token;
}

export function setFutureToken(token: string) {
    // console.log('set token', token);
    _future_token = token;
}

export function getFutureToken() {
    return _future_token;
}

export function setPlatform(platform: string) {
    _platform = platform;
}

export function getPlatform() {
    return _platform;
}
