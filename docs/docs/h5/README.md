# 介绍

::: tip
 后台系统基于 Nuxt + TypeScript构建
:::


## 技术栈

- [Nuxt](https://zh.nuxtjs.org/)
- [TypeScript](https://www.typescriptlang.org/)


## 文件目录
项目所在文件夹 `/h5` , 文件目录如下

```yaml
+-- dist  #build出来的文件夹，用于生产环境
+-- components  #组件目录
+-- layouts  #布局文件目录
+-- middleware  #中间件目录
+-- mixins  #mixins文件目录
+-- pages  #vue文件目录
+-- plugins  #插件目录
+-- server  #服务端代码目录
+-- static  #静态文件目录
+-- store  #vuex文件目录
+-- types  #.d.ts目录
+-- utils  #工具类ts文件目录
+-- .editorconfig  #编辑器格式控制文件
+-- .eslintrc.js  #ESLint配置
+-- tsconfig.json  #typescript配置文件
+-- README.md
+-- nuxt.config.js  #nuxt配置文件
+-- vue-shim.d.ts
```

## 命令

```yaml
yarn  # 安装依赖

yarn dev # 本地编译热启动

yarn build # 编译代码
yarn start # 生产模式启动代码

yarn lint # 校验所有文件的代码格式，并且自动修改并保持可以修改的格式
```

## 启动前准备
启动之前你需要拷贝一根.env文件到根目录，否则项目运行报错。<a href="envFile">.env文件参考</a>


## 启动步骤
- 1.启动本地开发服务器
```bash
yarn dev
```    
##  打包部署

1）用`git`上传代码<br>
2）在`qx-test-sit`这个服务器上执行
```
 1.   cd  /data/fushui/lily   
 2.   ./startWeb.sh feature_02121801_init  h5   #执行脚本，参数1：:分支名，参数2：项目名（目前支持：www，h5和admin）
```
编译完成之后访问下面链接即可：<br>
链接： [https://testm.tanxingk.com/](https://testm.tanxingk.com/)

`注：这里只拿测试环境部署，正式环境由运维来部署操作，原理一致。`

## 约定
1. 系统的请求里含有`/api/`前缀来标志是ajax请求，以便于区别是其他的url连接，因此请不要在路由路径里带`/api/`字符串。


## 相关配置
- <a href="envFile">.env文件</a>
- <a href="nginxConf">nginx配置</a>


