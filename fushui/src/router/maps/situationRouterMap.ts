/* 行情模块 */
export default {
    id: '06',
    name: '行情模块',
    defaultLink: '/situation_manage',
    children: [
        {
            id: '0601',
            name: '行情来源',
            href: '/situation_manage/source/list', // 默认的链接
            children: [
                {
                    id: '060101',
                    name: '行情来源',
                    href: '/situation_manage/source/list'
                }
            ]
        },
        {
            id: '0602',
            name: '行情种类',
            href: '/situation_manage/type/list', // 默认的链接
            children: [
                {
                    id: '060201',
                    name: '行情种类',
                    href: '/situation_manage/type/list'
                }
            ]
        },
        {
            id: '0603',
            name: '行情合约',
            href: '/situation_manage/contract/list/list', // 默认的链接
            children: [
                {
                    id: '060301',
                    name: '合约列表',
                    href: '/situation_manage/contract/list/list'
                },
                {
                    id: '060302',
                    name: '延展合约',
                    href: '/situation_manage/contract/stretch/list'
                },
                {
                    id: '060303',
                    name: '品种指数',
                    href: '/situation_manage/contract/variety/list'
                }
            ]
        },
        {
            id: '0604',
            name: '行情指数',
            href: '/situation_manage/index/list', // 默认的链接
            children: [
                {
                    id: '060401',
                    name: '行情指数',
                    href: '/situation_manage/index/list'
                }
            ]
        },
        {
            id: '0605',
            name: '持仓数据',
            href: '/situation_manage/position/list', // 默认的链接
            children: [
                {
                    id: '060501',
                    name: '行情指数',
                    href: '/situation_manage/position/list'
                }
            ]
        },
        {
            id: '0606',
            name: '设置管理',
            href: '/situation_manage/settings/quotation_title/list', // 默认的链接
            children: [
                {
                    id: '060601',
                    name: '行情抬头',
                    href: '/situation_manage/settings/quotation_title/list'
                },
                {
                    id: '060602',
                    name: 'K线图表',
                    href: '/situation_manage/settings/kline_chart/list'
                }
            ]
        },
        {
            id: '0607',
            name: '预警管理',
            href: '/situation_manage/warning/list', // 默认的链接
            children: [
                {
                    id: '060701',
                    name: '预警管理',
                    href: '/situation_manage/warning/list'
                }
            ]
        }
    ]
};
