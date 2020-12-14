/* 权限模块 */
export default {
    id: '09',
    name: '权限模块',
    defaultLink: '/permission_manage',
    children: [
        {
            id: '0901',
            name: '账号管理',
            href: '/permission_manage/accounts/list', // 默认的链接
            children: [
                {
                    id: '090101',
                    name: '账号管理',
                    href: '/permission_manage/accounts/list'
                }
            ]
        }
    ]
};
