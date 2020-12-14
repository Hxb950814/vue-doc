/* 交易模块 */
export default {
    id: '08',
    name: '营销模块',
    defaultLink: '/marketing_manage',
    children: [
        {
            id: '0801',
            name: '推广管理',
            href: '/marketing_manage/promote-manage/registered/index', // 默认的链接
            children: [
                {
                    id: '080101',
                    name: '注册奖励',
                    href: '/marketing_manage/promote-manage/registered/index'
                },
                {
                    id: '080101',
                    name: '邀请奖励',
                    href: '/marketing_manage/promote-manage/invitation/index'
                },
                {
                    id: '080101',
                    name: '邀请记录',
                    href: '/marketing_manage/promote-manage/record/index'
                }
            ]
        },
        {
            id: '0801',
            name: '打卡管理',
            href: '/marketing_manage/clockIn-manage/setting/index', // 默认的链接
            children: [
                {
                    id: '080101',
                    name: '打卡设置',
                    href: '/marketing_manage/clockIn-manage/setting/index'
                },
                {
                    id: '080101',
                    name: '打卡记录',
                    href: '/marketing_manage/clockIn-manage/recording/index'
                }
            ]
        },
        {
            id: '0801',
            name: '积分商城',
            href: '/marketing_manage/pointsMall-manage/task/index', // 默认的链接
            children: [
                {
                    id: '080101',
                    name: '积分任务',
                    href: '/marketing_manage/pointsMall-manage/task/index'
                },
                {
                    id: '080101',
                    name: '积分记录',
                    href: '/marketing_manage/pointsMall-manage/recording/index'
                }
            ]
        }
    ]
};
