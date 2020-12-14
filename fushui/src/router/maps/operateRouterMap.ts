/* 运营模块 */
export default {
    id: '03',
    name: '运营模块',
    defaultLink: '/operate_manage',
    children: [
        {
            id: '0301',
            name: '文章管理',
            href: '/operate_manage/articles/list', // 默认的链接
            children: [
                {
                    id: '030101',
                    name: '文章列表',
                    href: '/operate_manage/articles/list'
                }
            ]
        },
        {
            id: '0302',
            name: '图片管理',
            href: '/operate_manage/pictures/list',
            children: [
                {
                    id: '030201',
                    name: '图片管理',
                    href: '/operate_manage/pictures/list'
                }
            ]
        }, {
            id: '0303',
            name: 'Icon管理',
            href: '/operate_manage/icons/list',
            children: [
                {
                    id: '030301',
                    name: 'Icon管理',
                    href: '/operate_manage/icons/list'
                }
            ]
        },
        {
            id: '0304',
            name: '公告管理',
            href: '/operate_manage/notices/list',
            children: [
                {
                    id: '030401',
                    name: '公告管理',
                    href: '/operate_manage/notices/list'
                }
            ]
        },
        {
            id: '0305',
            name: '短信管理',
            href: '/operate_manage/sms/record/list',
            children: [
                {
                    id: '030501',
                    name: '短信记录',
                    href: '/operate_manage/sms/record/list'
                },
                {
                    id: '030502',
                    name: '短信场景',
                    href: '/operate_manage/sms/scene/list'
                }
            ]
        },
        {
            id: '0306',
            name: '问题管理',
            href: '/operate_manage/common_questions/list',
            children: [
                {
                    id: '030601',
                    name: '常见问题',
                    href: '/operate_manage/common_questions/list'
                },
                {
                    id: '030601',
                    name: '问题分类',
                    href: '/operate_manage/questions_category/list'
                }
            ]
        },
        {
            id: '0307',
            name: '意见管理',
            href: '/operate_manage/suggestions/list',
            children: [
                {
                    id: '030701',
                    name: '意见反馈',
                    href: '/operate_manage/suggestions/list'
                }
            ]
        }, {
            id: '0309',
            name: '版本管理',
            href: '/operate_manage/version/list',
            children: [
                {
                    id: '030901',
                    name: '版本管理',
                    href: '/operate_manage/version/list'
                }
            ]
        }, {
            id: '0310',
            name: '弹窗管理',
            href: '/operate_manage/modal/list',
            children: [
                {
                    id: '031001',
                    name: '弹窗管理',
                    href: '/operate_manage/modal/list'
                }
            ]
        },
        {
            id: '0308',
            name: '页面ID管理',
            href: '/operate_manage/page_id/list',
            children: [
                {
                    id: '030801',
                    name: '页面ID管理',
                    href: '/operate_manage/page_id/list'
                }
            ]
        }
    ]
};
