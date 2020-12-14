/* 用户模块 */
export default {
    id: '06',
    name: '用户模块',
    defaultLink: '/user_manage',
    children: [
        {
            id: '0506',
            name: '全部会员',
            href: '/user_manage/allMembers/list',
            children: [
                {
                    id: '050601',
                    name: '全部会员',
                    href: '/user_manage/allMembers/list'
                }
            ]
        },
        {
            id: '0506',
            name: '学习会员',
            href: '/user_manage/learningMember/list',
            children: [
                {
                    id: '050601',
                    name: '学习会员',
                    href: '/user_manage/learningMember/list'
                }
            ]
        },
        {
            id: '0506',
            name: '认证会员',
            href: '/user_manage/certificationMember/list',
            children: [
                {
                    id: '050601',
                    name: '学习会员',
                    href: '/user_manage/certificationMember/list'
                }
            ]
        },
        {
            id: '0506',
            name: '锁定会员',
            href: '/user_manage/lockingMember/list',
            children: [
                {
                    id: '050601',
                    name: '锁定会员',
                    href: '/user_manage/lockingMember/list'
                }
            ]
        },
        {
            id: '0506',
            name: '会员班级',
            href: '/user_manage/memberClass/list',
            children: [
                {
                    id: '会员班级',
                    name: '锁定会员',
                    href: '/user_manage/memberClass/list'
                }
            ]
        },
        {
            id: '0506',
            name: '会员管控',
            href: '/user_manage/memberControl/list',
            children: [
                {
                    id: '会员班级',
                    name: '会员管控',
                    href: '/user_manage/memberControl/list'
                }
            ]
        }
    ]
};
