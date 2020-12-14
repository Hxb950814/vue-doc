/* 交易模块 */
export default {
    id: '07',
    name: '交易模块',
    defaultLink: '/transaction_manage',
    children: [
        {
            id: '0701',
            name: '时间管理',
            href: '/transaction_manage/time/calendar', // 默认的链接
            children: [
                {
                    id: '070101',
                    name: '交易日历',
                    href: '/transaction_manage/time/calendar'
                }
            ]
        },
        {
            id: '0702',
            name: '挂单订单',
            href: '/transaction_manage/pendingOrder/index', // 默认的链接
            children: [
                {
                    id: '070201',
                    name: '挂单订单',
                    href: '/transaction_manage/pendingOrder/index'
                }
            ]
        },
        {
            id: '0703',
            name: '委托订单',
            href: '/transaction_manage/commissionOrder/index', // 默认的链接
            children: [
                {
                    id: '070301',
                    name: '委托订单',
                    href: '/transaction_manage/commissionOrder/index'
                }
            ]
        },
        {
            id: '0704',
            name: '成交订单',
            href: '/transaction_manage/dealOrder/index', // 默认的链接
            children: [
                {
                    id: '070401',
                    name: '成交订单',
                    href: '/transaction_manage/dealOrder/index'
                }
            ]
        },
        {
            id: '0705',
            name: '云条件单',
            href: '/transaction_manage/cloudConditionsOrder/index/index', // 默认的链接
            children: [
                {
                    id: '070501',
                    name: '未触发列表',
                    href: '/transaction_manage/cloudConditionsOrder/index/index'
                },
                {
                    id: '070502',
                    name: '已触发列表',
                    href: '/transaction_manage/cloudConditionsOrder/triggered/triggered'
                },
                {
                    id: '070503',
                    name: '已失效列表',
                    href: '/transaction_manage/cloudConditionsOrder/invalid/invalid'
                }
            ]
        }
    ]
};
