### 介绍

::: tip
富水系统前端文档
:::


## NodeJs和Yarn版本

本项目前端构建依赖 `NodeJs` 和 `yarn`， 所有的包安装都使用`yarn`命令安装的，而不是`cnpm`或者`npm`。

保证项目能够正常启动，必须保证NodeJs版本 >= `8.0`(推荐Nodejs12), 请安装最新版`yarn`
```yaml
npm i -g yarn
```

为了保证yarn能够正常安装包，可以使用淘宝镜像
```yaml
yarn config set registry https://registry.npm.taobao.org -g
```
为了保证yarn能够正常`node-sass`，可以使用淘宝镜像
```yaml
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```

## 项目

- [后台](/admin/)
- [h5](/h5/)
- [pc](/pc/)

## 文件目录

```yaml
+-- fushui-common #common项目
+-- fushui-admin #admin项目
+-- fushui-h5 #h5项目
+-- fushui-common #common项目
+-- fushui-www #www项目
```

## .gitignore

由于是一个git项目，根目录的`.gitignore`文件负责管理所有子目录的忽略文件，一般来说如下的文件和文件夹应该被忽略：

- `.DS_Store` macOS 来存储这个文件夹的显示属性的文件
- `node_modules` node 的模块包文件夹
- `.env.local` vuecli 本地配置文件
- `.env.*.local` vuecli 本地配置文件
- `.nuxt`  nuxt项目运行文件夹

NPM 和 yarn的 一系列log

- `npm-debug.log*`  
- `yarn-debug.log*`
- `yarn-error.log*`

编辑器配置文件
- `.idea` webstorm 和 IDEA 的配置文件夹
- `.vscode`  vscode 的配置文件夹

其他版本控制器的配置文件
- `.svn` svn 的配置文件夹


## 项目框架介绍

### 命令
本项目是`yarn workspace`管理的`monorepo`, 除了一些不相容的包放在子目录之外，所有的npm包都安装在根目录。

执行安装或者更新依赖：
```
yarn
```

执行命令有两种形式：
```yaml
#在根目录执行fushui-h5 里面的dev
yarn workspace fushui-h5 dev
#在fushui-h5 目录执行dev
yarn dev
```

我们归纳了基本的项目命令在根目录的`package.json`的`scripts`里面。

一般本地开发开发我们会用`dev`，编译用`build`，请谨记这个约定。

### 代码和校验

本项目采用Vue + TypeScript模式构建， 代码质量检验用EsLint， Eslint模块在根目录的package.json里，每个子项目都有一个
`.eslintrc.js`来控制每个子项目的代码约束规则，每个项目的文件大体一致，这样保证整个项目风格一致。
