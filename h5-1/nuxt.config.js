const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { getConfig } = require('fushui-common/scripts/env');

const runConf = getConfig('h5', process.env.NODE_ENV);

const runEnv = runConf.API_ENV; // api环境
const runPort = runConf.PORT; // 运行端口
const apiProxyPath = runConf['API_PATH_' + runEnv] || runConf.API_PATH; // API代理到端口

const baseConfig = {
    resourcePath: 'https://rs.tanxingk.com' // 静态资源站点
};

const nuxtConfig = {
    mode: 'universal',
    head: {
        title: '弹性K线',
        htmlAttrs: {
            lang: 'zh-CN'
        },
        meta: [
            {charset: 'utf-8'},
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0,user-scalable=no'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            },
            {
                rel: 'stylesheet',
                href: `${baseConfig.resourcePath}/css/reset.css`
            }, /* reset.scss */
            {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/vant@2.8.1/lib/index.css'
            } /* 只引入vant的css */
        ],
        script: [
            {src: '/js/fontSize.js'}, /* fontSize.js */
            {src: `${baseConfig.resourcePath}/js/jweixin-1.4.0.js`} /* jweixin.js */
        ]
    },
    loading: {color: '#fff'},
    css: [
        '@/assets/style/base.scss' /* 基础css */
    ],
    plugins: [
        {
            src: '@plugins/server_init.ts',
            ssr: true
        },
        {
            src: '@plugins/client_init.ts',
            ssr: false
        }
    ],
    buildModules: [
        ['@nuxt/typescript-build']
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/style-resources'
    ],
    styleResources: {
        scss: [
            '@/assets/style/variables.scss',
            '@/assets/style/helper.scss'
        ]
    },
    build: {
        // optimization: {
        //     splitChunks: {
        //         cacheGroups: {
        //             vendor: {
        //                 name: 'vendor',
        //                 test: /[\\/]node_modules[\\/]/,
        //                 chunks: 'all',
        //                 priority: 10 // 优先级
        //             }
        //         }
        //     }
        // },
        extractCSS: { allChunks: true }, // 将主块中的 CSS 提取到一个单独的 CSS 文件中
        extend(config, ctx) {
            // console.log('extend', config, ctx)
            config.resolve = merge(config.resolve, {
                alias: {
                    '@common': path.resolve(__dirname, './../fushui-common'),
                    '@root': path.resolve(__dirname, './../')
                }
            });
        },
        plugins: [
            new webpack.DefinePlugin({
                CONST_CQUOTE_WS_PATH: JSON.stringify(`${process.env.CQUOTE_WS_PATH}`) // ws地址
            })
        ],
        babel: {
            presets({isServer}) {
                const targets = isServer ? {node: '10'} : {ie: '11'}; // 兼容到ie11
                return [
                    [
                        require.resolve('@nuxt/babel-preset-app'), // For nuxt-edge users
                        {
                            targets
                            // corejs: { version: 3 }
                        }
                    ]
                ];
            }
        },
        postcss: {
            plugins: {
                'postcss-px2rem': {
                    remUnit: 100,
                    propList: ['*']
                }
            },
            preset: {
                autoprefixer: true
            }
        }
    },
    server: {
        port: runPort
    }
};

// 测试下开启代理
if (process.env.NODE_ENV === 'development') {
    const runEnv = runConf.API_ENV; // api环境
    console.log('------------------------------------------');
    console.log(`正在【开发模式】下启动 ,当前API接口环境：【${['未知环境', '本地环境', '测试环境', '正式环境'][runEnv]}】`);
    console.log(`API代理到：${apiProxyPath}`);
    console.log('数据api接口代理到:', runConf.TQUOTE_PATH);
    console.log('cquote接口代理到:', runConf.CQUOTE_PATH);
    console.log('------------------------------------------');
    nuxtConfig.axios = {
        proxy: true, // 表示开启代理
        prefix: '/api', // 表示给请求url加个前缀 /api
        credentials: true // 表示跨域请求时是否需要使用凭证
    };
    nuxtConfig.proxy = {
        '/api': {
            target: apiProxyPath || '', // 目标接口域名
            changeOrigin: true, // 表示是否跨域
            pathRewrite: {
                '^/api': '' // 把 /api 替换成‘’
            }
        },
        '/tquote_api': {
            target: runConf.TQUOTE_PATH || '', // 目标接口域名
            changeOrigin: true,
            pathRewrite: {
                '^/tquote_api': ''
            }
        },
        '/cquote_api': {
            target: runConf.CQUOTE_PATH || '',
            changeOrigin: true,
            pathRewrite: {
                '^/cquote_api': ''
            }
        }
        // '/cquote_ws': {
        //     target: process.env.CQUOTE_WS_PATH || '', // 目标接口域名,
        //     changeOrigin: true,
        //     ws: true, // 代理websocket
        //     secure: false, // 是否验证SSL Certs
        //     pathRewrite: {}
        // }
    };
}

module.exports = nuxtConfig;
