/* 行情模块 */
export default {
    id: '05',
    name: '课程模块',
    defaultLink: '/course_manage',
    children: [
        {
            name: '股票课程',
            href: '/course_manage/stock/subsectionList', // 默认的链接
            children: [
                {
                    id: '121',
                    name: '股票课程小节',
                    href: '/course_manage/stock/subsectionList'
                },
                {
                    id: '121',
                    name: '股票课程目录',
                    href: '/course_manage/stock/tableOfContentsList'
                }
            ]
        },
        {
            id: '0601',
            name: '基金课程',
            href: '/course_manage/fund/subsectionList', // 默认的链接
            children: [
                {
                    id: '122',
                    name: '基金课程小节',
                    href: '/course_manage/fund/subsectionList'
                },
                {
                    id: '121',
                    name: '基金课程目录',
                    href: '/course_manage/fund/tableOfContentsList'
                }
            ]
        },
        {
            id: '0601',
            name: '保险课程',
            href: '/course_manage/Insurance/subsectionList', // 默认的链接
            children: [
                {
                    id: '121',
                    name: '保险课程小节',
                    href: '/course_manage/Insurance/subsectionList'
                },
                {
                    id: '121',
                    name: '保险课程目录',
                    href: '/course_manage/Insurance/tableOfContentsList'
                }
            ]
        },
        {
            id: '0601',
            name: '听书课程',
            href: '/course_manage/listenToBooks/list', // 默认的链接
            children: [
                {
                    id: '060101',
                    name: '听书课程',
                    href: '/course_manage/listenToBooks/list'
                }
            ]
        },
        {
            id: '0601',
            name: '小白课程',
            href: '/course_manage/noob/subsectionList', // 默认的链接
            children: [
                {
                    id: '060101',
                    name: '小白课程小节',
                    href: '/course_manage/noob/subsectionList'
                },
                {
                    id: '060101',
                    name: '小白课程目录',
                    href: '/course_manage/noob/tableOfContentsList'
                }
            ]
        },
        {
            id: '0601',
            name: '其他课程',
            href: '/course_manage/other/subsectionList', // 默认的链接
            children: [
                {
                    id: '060101',
                    name: '其他课程小节',
                    href: '/course_manage/other/subsectionList'
                },
                {
                    id: '060101',
                    name: '其他课程目录',
                    href: '/course_manage/other/tableOfContentsList'
                }
            ]
        },
        {
            id: '0601',
            name: '课程设置',
            href: '/course_manage/setting/list', // 默认的链接
            children: [
                {
                    id: '060101',
                    name: '课程设置',
                    href: '/course_manage/setting/list'
                }
            ]
        }
    ]
};
