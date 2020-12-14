/* K豆模块 */
export default {
    id: '04',
    name: 'K豆模块',
    defaultLink: '/kcoin_manage',
    children: [
        {
            id: '0401',
            name: 'K豆产品',
            href: '/kcoin_manage/products/list', // 默认的链接
            children: [
                {
                    id: '040101',
                    name: 'K豆产品',
                    href: '/kcoin_manage/products/list'
                }
            ]
        },
        {
            id: '0402',
            name: 'K豆订单',
            href: '/kcoin_manage/orders/list',
            children: [
                {
                    id: '040201',
                    name: 'K豆订单',
                    href: '/kcoin_manage/orders/list'
                }
            ]
        }, {
            id: '0403',
            name: 'K豆记录',
            href: '/kcoin_manage/records/list',
            children: [
                {
                    id: '040301',
                    name: 'K豆记录',
                    href: '/kcoin_manage/records/list'
                }
            ]
        },
        {
            id: '0404',
            name: 'K豆设置',
            href: '/kcoin_manage/ratio_settings/list',
            children: [
                {
                    id: '040401',
                    name: 'K豆比例设置',
                    href: '/kcoin_manage/ratio_settings/list'
                },
                {
                    id: '040402',
                    name: '通道设置',
                    href: '/kcoin_manage/channel_settings/list'
                }
            ]
        },
        {
            id: '0405',
            name: '签到管理',
            href: '/kcoin_manage/checkin_manage/data',
            children: [
                {
                    id: '040501',
                    name: '签到数据统计',
                    href: '/kcoin_manage/checkin_manage/data'
                },
                {
                    id: '040502',
                    name: '签到记录',
                    href: '/kcoin_manage/checkin_record/list'
                },
                {
                    id: '040503',
                    name: '用户签到统计',
                    href: '/kcoin_manage/checkin_analysis/list'
                },
                {
                    id: '040504',
                    name: '签到设置',
                    href: '/kcoin_manage/checkin_setting/list'
                }
            ]
        }
    ]
};
