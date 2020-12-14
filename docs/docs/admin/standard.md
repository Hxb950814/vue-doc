# 规范

>为了保障项目能够长久稳定的迭代，特此指定一些规范和原则。

## 稳健性
- 代码保持健壮，不要使用容易产生歧义的js代码，比如:
```javascript
for(var i = 0; i < 10; i ++){ // 不要使用var
    setTimeout(function() {
        console.log(i);
    }, 0);
}
console.log(name);  // 不要使用全局变量
```
早保证能够使用的情况下使用`ES2015+`的语法。

本项目采用了`TypeScript`进行开发，并采用了`tslint-config-alloy`的规范来约束代码，一旦不合乎规范的代码都会被检测出来，
请在提交代码时保证无格式代码错误，且务必保证`npm run lint`执行不错误。

## 易阅读
- 代码格式要使用约定的样式，也就是`tslint-config-alloy` + 自定义`tslint.json`指定的风格。
- 不要过度使用js奇技淫巧。
- 命名要符合前端组规范。

## 持久性
为了项目长久迭代，**请不要随意引用npm包**，**不要随意引用ui库**，**不要随意定义工具js和全局css**。

目前后台项目采用了`Element-UI` 这个UI库，有什么需要可以去[Element文档](https://element.eleme.cn/#/zh-CN/component/installation)找。


## 注意性能和编译时间
如果你的编译时间过长，应及时关注。

如果你的页面出现多次卡顿，请优化。

在页面销毁前释放分配的对象，避免内存泄露。比如`Echarts对象`, `富文本`,`二进制对象`。


## 代码审查
开发完成，上线之前先审查自己的代码，避免错改，漏改。然后再编译上传。

## 文件命名规范

**1.下划线分隔**
- 文件夹命名： `小写字母或数字+下划线`, 如: `node_comp`
- .png 等图片文件： `小写，字母或数字，可下划线分割`, 如: `head_icon.png`

**2.中划线分隔**
- .ts 和 .scss, .css文件： `小写，字母或数字，可中划线分割`, 如: `shims-vue.d.ts`、 `index.ts`, `reset.css`, `screen-media.scss`

**3.含大写驼峰命令和帕斯卡命名**
- .vue 页面文件命名： `字母数字或字母数字驼峰式命名, 首字母小写`, 如: `pageA.vue`、 `login.vue`
- .vue 组件文件命名： `帕斯卡命名,单词首字母大写`, 如: `MyComponents.vue`、 `MyEtitor2.vue`

## 变量命令规范

**1.css变量命名规范**
- class中划线隔离，如：`class='my-name'`
- id下划线隔离，如：`id='my_name'`

**2.ts变量命名规范**
- 变量和普通常量驼峰命名，如：`let tempArr = '1111'`
- 函数驼峰命名，如：
```
function getProductName(){
    return '';
}
```
- interface命名规范-帕斯卡命名（单词首字母大写）,如：
```
interface TypeReq{
}
```

### 其他代码规范

本项目的代码规范采用了`[@vue/standard]`和`[@vue/typescript/recommended]`的规范，并且做了一定的更改，
详细更改请参考项目根目录`.eslintrc.js`文件。
