/* 交易模块 */
export default {
    id: '07',
    name: '财务模块',
    defaultLink: '/finance_manage',
    children: [
        {
            id: '0701',
            name: '营收概况',
            href: '/finance_manage/revenue/index', // 默认的链接
            children: [
                {
                    id: '070101',
                    name: '营收概况',
                    href: '/finance_manage/revenue/index'
                }
            ]
        },
        {
            id: '0701',
            name: '收入明细',
            href: '/finance_manage/income/index', // 默认的链接
            children: [
                {
                    id: '070101',
                    name: '收入明细',
                    href: '/finance_manage/income/index'
                }
            ]
        },
        {
            id: '0701',
            name: '奖励明细',
            href: '/finance_manage/reward/index', // 默认的链接
            children: [
                {
                    id: '070101',
                    name: '奖励明细',
                    href: '/finance_manage/reward/index'
                }
            ]
        },
        {
            id: '0701',
            name: '财务设置',
            href: '/finance_manage/settings/pay/index', // 默认的链接
            children: [
                {
                    id: '070101',
                    name: '支付设置',
                    href: '/finance_manage/settings/pay/index'
                },
                {
                    id: '070101',
                    name: '提现设置',
                    href: '/finance_manage/settings/withdraw/index'
                }
            ]
        },
        {
            id: '0701',
            name: '课程订单',
            href: '/finance_manage/courseOrder/index', // 默认的链接
            children: [
                {
                    id: '070101',
                    name: '课程订单',
                    href: '/finance_manage/courseOrder/index'
                }
            ]
        }

    ]
};
