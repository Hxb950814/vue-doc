/* 运营模块 */
export default {
    id: '03',
    name: '图片模块',
    defaultLink: '/image_manage',
    children: [
        {
            id: '0303',
            name: 'ICON管理',
            href: '/image_manage/icons/homeIcon',
            children: [
                {
                    id: '1',
                    name: '主页ICON',
                    href: '/image_manage/icons/homeIcon'
                },
                {
                    id: '2',
                    name: '求知ICON',
                    href: '/image_manage/icons/knowledgeIcon'
                },
                {
                    id: '3',
                    name: '工具ICON',
                    href: '/image_manage/icons/toolsIcon'
                },
                {
                    id: '4',
                    name: '互动ICON',
                    href: '/image_manage/icons/interactiveIcon'
                },
                {
                    id: '5',
                    name: '汇总ICON',
                    href: '/image_manage/icons/summaryIcon'
                },
                {
                    id: '6',
                    name: '资产ICON',
                    href: '/image_manage/icons/assetsIcon'
                }
            ]
        },
        {
            id: '0302',
            name: 'Banner管理',
            href: '/image_manage/pictures/list',
            children: [
                {
                    id: '030201',
                    name: 'Banner管理',
                    href: '/image_manage/pictures/list'
                }
            ]
        },
        {
            id: '0304',
            name: '广告管理',
            href: '/image_manage/notices/list',
            children: [
                {
                    id: '030401',
                    name: '广告管理',
                    href: '/image_manage/notices/list'
                }
            ]
        },
        // {
        //     id: '0309',
        //     name: '底部图标',
        //     href: '/image_manage/footer/list',
        //     children: [
        //         {
        //             id: '030901',
        //             name: '底部图标',
        //             href: '/image_manage/footer/list'
        //         }
        //     ]
        // },
        {
            id: '0308',
            name: '界面ID管理',
            href: '/image_manage/page_id/list',
            children: [
                {
                    id: '030801',
                    name: '界面ID管理',
                    href: '/image_manage/page_id/list'
                }
            ]
        }
    ]
};
