/* 交易模块 */
export default {
    id: '08',
    name: '策略模块',
    defaultLink: '/strategy_manage',
    children: [
        {
            id: '0801',
            name: '策略管理',
            href: '/strategy_manage/manage/index', // 默认的链接
            children: [
                {
                    id: '080101',
                    name: '策略管理',
                    href: '/strategy_manage/manage/index'
                }
            ]
        },
        {
            id: '0802',
            name: '策略运行',
            href: '/strategy_manage/running/index', // 默认的链接
            children: [
                {
                    id: '080201',
                    name: '策略运行',
                    href: '/strategy_manage/running/index'
                }
            ]
        },
        {
            id: '0803',
            name: '策略终止',
            href: '/strategy_manage/termination/index', // 默认的链接
            children: [
                {
                    id: '080301',
                    name: '策略终止',
                    href: '/strategy_manage/termination/index'
                }
            ]
        },
        {
            id: '0804',
            name: '多空组合',
            href: '/strategy_manage/multIspace/index', // 默认的链接
            children: [
                {
                    id: '080401',
                    name: '多空组合',
                    href: '/strategy_manage/multIspace/index'
                }
            ]
        }
    ]
};
