// require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { getConfig } = require('fushui-common/scripts/env');
const runConf = getConfig('www', process.env.NODE_ENV);

const runEnv = runConf.API_ENV; // api环境
const runPort = runConf.PORT; // 运行端口
const apiProxyPath = runConf['API_PATH_' + runEnv] || runConf.API_PATH; // API代理到端口

const nuxtConfig = {
    mode: 'universal',
    head: {
        title: '下单大师',
        htmlAttrs: {
            lang: 'zh-CN'
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
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
                href: '//unpkg.com/element-ui@2.13.1//lib/theme-chalk/index.css'
            },
            {
                rel: 'stylesheet',
                href: '//unpkg.com/swiper@6.1.2//swiper-bundle.min.css'
            }
        ]
        // script: [{
        //     src: '//unpkg.com/element-ui@2.13.1/lib/index.js'
        // }]
    },
    loading: { color: '#fff' },
    css: [
        '@/assets/style/common.scss' /* 基础css,添加到header里面去 */
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
        '@nuxt/typescript-build'
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/style-resources'
    ],
    styleResources: {
        scss: [ // 预先加载
            '@/assets/style/base.scss'
        ]
    },
    axios: {},
    build: {
        extend(config, ctx) {
            config.resolve = merge(config.resolve, {
                alias: {
                    '@common': path.resolve(__dirname, './../fushui-common'),
                    '@root': path.resolve(__dirname, './../')
                }
            });
        },
        plugins: [
        ],
        babel: {
            presets({ isServer }) {
                const targets = isServer ? { node: '10' } : { ie: '11' }; // 兼容到ie11
                return [
                    [
                        require.resolve('@nuxt/babel-preset-app'), // For nuxt-edge users
                        {
                            targets
                        }
                    ]
                ];
            },
            plugins: []
        },
        postcss: {
            plugins: {},
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
        }
        // '/tquote_api': {
        //     target: dev.TQUOTE_PATH || '', // 目标接口域名
        //     changeOrigin: true,
        //     pathRewrite: {
        //         '^/tquote_api': ''
        //     }
        // },
        // '/cquote_api': {
        //     target: dev.CQUOTE_PATH || '',
        //     changeOrigin: true,
        //     pathRewrite: {
        //         '^/cquote_api': ''
        //     }
        // }
    };
}

module.exports = nuxtConfig;
