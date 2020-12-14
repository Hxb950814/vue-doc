// 配置文件
const dev = 2; // 环境 1 测试  2 线上
// @ts-ignore
export default {
    /* 调试开关 */
    useEruda: false, // 开启eruda调试块
    testUrl: 'testm.qiuzhicaitang.com',
    releaseUrl: 'm.qiuzhicaitang.com',
    // @ts-ignore
    appId: dev === 1 ? 'wxc9da0599e2dd2177' : 'wx55558e07a3804002',
    // @ts-ignore
    url: dev === 1 ? 'http://testm.qiuzhicaitang.com' : 'https://m.qiuzhicaitang.com',
    enablePermission: false // 是否开启权限，默认true, 不开启则权限拦截失效
};
