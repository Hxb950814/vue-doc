/* K豆模块 */
export default {
    id: '04',
    name: '内容模块',
    defaultLink: '/content_manage',
    children: [
        {
            id: '0401',
            name: '公告管理',
            href: '/content_manage/announcement/list', // 默认的链接
            children: [
                {
                    id: '040101',
                    name: '公告管理',
                    href: '/content_manage/announcement/list'
                }
            ]
        },
        {
            id: '0402',
            name: '文章管理',
            href: '/content_manage/article/list',
            children: [
                {
                    id: '040201',
                    name: '文章管理',
                    href: '/content_manage/article/list'
                }
            ]
        }, {
            id: '0403',
            name: '打新管理',
            href: '/content_manage/makeNew/list',
            children: [
                {
                    id: '040301',
                    name: '新股申购',
                    href: '/content_manage/makeNew/newShares'
                },
                {
                    id: '040301',
                    name: '新债申购',
                    href: '/content_manage/makeNew/newDebt'
                }
            ]
        },
        // {
        //     id: '0403',
        //     name: '版本管理',
        //     href: '/content_manage/version/list',
        //     children: [
        //         {
        //             id: '040301',
        //             name: '版本管理',
        //             href: '/content_manage/version/list'
        //         }
        //     ]
        // },
        {
            id: '0403',
            name: '帮助中心',
            href: '/content_manage/help/list',
            children: [
                {
                    id: '040301',
                    name: '问题列表',
                    href: '/content_manage/help/problem'
                },
                {
                    id: '040301',
                    name: '问题分类',
                    href: '/content_manage/help/classification'
                }
            ]
        }
        // {
        //     id: '0403',
        //     name: '反馈管理',
        //     href: '/content_manage/suggestions/list',
        //     children: [
        //         {
        //             id: '040301',
        //             name: '意见反馈',
        //             href: '/content_manage/suggestions/list'
        //         }
        //     ]
        // }
    ]
};
