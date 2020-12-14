/* 用户模块 */
export default {
    id: '05',
    name: '用户模块',
    defaultLink: '/user_manage',
    children: [
        {
            id: '0501',
            name: '平台用户',
            href: '/user_manage/platforms/list', // 默认的链接
            children: [
                {
                    id: '050101',
                    name: '平台用户',
                    href: '/user_manage/platforms/list'
                }
            ]
        },
        {
            id: '0502',
            name: '期货用户',
            href: '/user_manage/futures/list',
            children: [
                {
                    id: '050201',
                    name: '期货用户',
                    href: '/user_manage/futures/list'
                }
            ]
        }, {
            id: '0503',
            name: '交易用户',
            href: '/user_manage/transaction/list',
            children: [
                {
                    id: '050301',
                    name: '交易用户',
                    href: '/user_manage/transaction/list'
                }
            ]
        },
        {
            id: '0504',
            name: '推荐用户',
            href: '/user_manage/recommend/list',
            children: [
                {
                    id: '050401',
                    name: '推荐用户',
                    href: '/user_manage/recommend/list'
                }
            ]
        },
        {
            id: '0505',
            name: '期货公司',
            href: '/user_manage/futures_company/list',
            children: [
                {
                    id: '050501',
                    name: '期货公司',
                    href: '/user_manage/futures_company/list'
                }
            ]
        },
        {
            id: '0506',
            name: '银行管理',
            href: '/user_manage/bank_manage/list',
            children: [
                {
                    id: '050601',
                    name: '银行管理',
                    href: '/user_manage/bank_manage/list'
                }
            ]
        },
        {
            id: '0506',
            name: '账号管理',
            href: '/user_manage/account_manage/list',
            children: [
                {
                    id: '050601',
                    name: '账号管理',
                    href: '/user_manage/account_manage/list'
                }
            ]
        }
    ]
};
