# 介绍

::: tip
 后台系统基于 VueCli4构建, 基于VueJS + Axios + ElementUI + TypeScript + SCSS
:::


## 技术栈

- [VueCLI 4](https://cli.vuejs.org/zh/)
- [Vue-Router](https://router.vuejs.org/)
- [Vuex](https://vuex.vuejs.org/zh/)
- [Element-UI](https://element.eleme.cn/#/zh-CN/component/installation)
- [Axios](https://www.kancloud.cn/yunye/axios/234845)


## 文件目录
项目所在文件夹 `/admin` , 文件目录如下

```yaml
+-- dist  #build出来的文件夹，用于生产环境
+-- public  #公共目录
+-- src   #源代码目录
|   +-- assets  #资源相关目录
|   +-- components  #vue组件
|   +-- router  #路由
|   +-- mixins  #mixins
|   +-- store  #vuex
|   +-- types  #自定义.d.ts目录
|   +-- utils  #工具类目录
|   +-- views  #页面
|   +-- App.vue 
|   +-- main.ts  
+-- .editorconfig  #编辑器格式控制文件
+-- .eslintrc.js  #ESLint配置
+-- .env.development  #开发配置
+-- package-lock.json
+-- tsconfig.json  #typescript配置文件
+-- tslint.json  #tslint格式配置文件
+-- README.md
+-- vue.config.js  #vuecli配置文件
```

## 配置文件
1.根目录的`env.json`配置文件。

```yaml
"admin": {
    "dev": { #开发模式
        "PORT": "8079", #运行端口
        "API_ENV": 1, 
        "API_PATH_1": "http://127.0.0.1:8001",
        "API_PATH_2": "http://lily.fushui.qianxiangbank.com/api/",
        "API_PATH_3": "http://gl.tanxingk.com/api/"
    },
    "test": {
    },
    "release": {
    }
}
```
2.`.eslintrc.js` ESLint文件，代码语法校验配置。
3.`.babel.config.js` 代码编译配置文件。
4.`tsconfig.json` TypeScript编译配置文件
5.`vue.config.js` Vue项目配置文件


## 命令

在执行命令之前，最好需要指定yarn的稳定地址，这里推荐淘宝的yarn地址，你可以这么设置：
```yaml
yarn config set registry https://registry.npm.taobao.org -g
```


```yaml
yarn  # 安装依赖
yarn serve # 本地编译热启动
yarn build # 编译打包成生产环境代码
yarn lint # 校验所有文件的代码格式，并且自动修改并保持可以修改的格式
```

## 启动步骤
- 1.启动本地开发服务器
```yaml
yarn dev
```     

##  打包部署

1）用`git`上传代码<br>
3）在`qx-test-sit`这个服务器上执行
```
 1.   cd  /data/fengcang/lily   
 2.   ./startWeb.sh hotfix_01131406_fcfix9 admin   #执行脚本，参数1：:分支名，参数2：项目名（目前只支持：wap和admin）
```
编译完成之后访问下面链接即可(需要配置host指向：`123.59.143.167`)：<br>
链接： [http://lily.fengcang.qianxiangbank.com/](http://lily.fengcang.qianxiangbank.com/)

`注：这里只拿测试环境部署，正式环境由运维来部署操作，原理一致。`

## 约定
1. 系统的请求里含有`/api/`前缀来标志是ajax请求，以便于区别是其他的url连接，因此请不要在路由路径里带`/api/`字符串。


## 附录
1. 生产环境nginx配置
```yaml
 #资源
 location ~ .*\.(gif|jpg|jpeg|png|webp|bmp|mp4|flv|avi|swf|svg|woff|ttf|otf|eot)$
 {
      expires    30d;
      error_log  off;
      access_log off;
 }
 location ~ .*\.(js|css|json)?$
 {
      expires    12h;
      error_log  off;
      access_log off; 
 }
 # api代理
 location ^~ /api/ {
     add_header 'Access-Control-Allow-Origin' '*';
     proxy_pass http://192.0.0.1:10001; #自行修改端口
 }
 # url路径
 location / {
     root /data/fengcang/lily/webHtml/admin/dist/;  #dist文件夹路径
     try_files $uri $uri/ /index.html last;
 }
```

