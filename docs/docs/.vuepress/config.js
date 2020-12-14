module.exports = {
    base: '/docs', // url base
    title: '富水系统前端文档',
    description: '欢迎访问',
    port: 8992, // 开发模式端口
    // dest: 'dist_publish/fushui', // 打包到的目录
    serviceWorker: true, // 生产环境开启pwa
    head: [
        ['link', { rel: 'icon', href: `http://pic.qianxiangbank.com/02.ico` }]
    ],
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            {
                text: '文档',
                items: [
                    { text: '通用',link: '/common/' },
                    { text: '后台', link: '/admin/' },
                    { text: 'h5', link: '/h5/' },
                    { text: 'www', link: '/www/' }
                ]
            }
        ],
        sidebar: {
            '/common/': [
                {
                    title: '通用',
                    collapsable: false,
                    children: [
                        ''
                    ]
                },
            ],
            '/admin/': [
                {
                    title: '后台网页',
                    collapsable: false,
                    children: [
                        '',
                        'grammar', // 语法
                        'standard' // 环境配置
                    ]
                },
            ],
            '/h5/': [
                {
                    title: '弹性K线',
                    collapsable: false,
                    children: [
                        '',
                        'envfile',
                        'nginxconf',
                        'h5-interface'
                    ]
                },
            ]
        }
    },
    markdown: {
        lineNumbers: true
    },
    configureWebpack: {
        resolve: {
            alias: {
            }
        }
    },
    chainWebpack: (config, isServer) => {
        // config is an instance of ChainableConfig
    },
    evergreen: true, // 只针对常青树浏览器，禁用 IE5 的 ES5 转码和 polyfill
};
