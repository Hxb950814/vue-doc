export default {
    /* 调试开关 */
    useEruda: false, // 开启eruda调试块

    /* 行情数据接口 */
    situationApiUrl: 'http://cquote.tanxingk.com', // 正式
    situationApiWSUrl: 'cquote.tanxingk.com/api/ws', // 正式

    /* 交易数据接口 */
    tradeApiUrl: 'http://trade.tanxingk.com', // 正式
    tradeApiWSUrl: 'ws://trade.tanxingk.com:8765/api/ws', // 正式

    /* app 信息 */
    version: '1.0.0', // H5版本号
    contact: '021-65555', // 公司电话
    homepage: 'm.tanxingk.com', // 公司官网
    weixin: '00283736', // 微信公众号

    /* app 相关配置 */
    homePath: '/future', // 首页指向的地址

    /* 分享参数  */
    shareTitle: '弹性K线', // 分享标题
    shareDesc: '弹性K线，透视量化', // 分享描述
    shareImageUrl: 'https://rs.tanxingk.com/images/share200.png' // 分享图片地址
};
