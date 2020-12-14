# 语法

::: tip
 为方便后台人员和其他开发人员查看代码，对语法做一些说明
:::

## Vue+Typescript的基本用法

### 完整示例
Vue文件的template部分类似于HTML的语法：
如：
```html
<template>
    <div>
        <span>我是{{name}}</span><button @click="clickChangeName"></button>
        <span>我还是是{{name2}}</span>
        <span>我的账号{{account}}</span>
    </div>
</template>
<script lang="ts">
    import { Component, Watch, Vue } from 'vue-property-decorator';    
    import { Getter } from 'vuex-class';
    @Component({
         components: {}, // 组件
         mixins: [] // 混入
    })
    export default class extends Vue {
        // 定义个变量，可以在template里面绑定使用，前面不需要写private, public等等，默认是default
        name = '123';
        search = {
            name: ''
        };
    
        // Getters，获取vuex
        @Getter('account')
        account!: string;   
    
        /* vue的 computed */
        getter name2(){
            console.log('使用computed');
            return '123';
        }       
    
        /*监听变量变化*/
        @Watch('name')
        onNameChange(val: string){
            console.log('name发生了改变,最新值：', this.name);
        }

        // 生命周期函数
        mounted () {
            // 
        }

        beforeDestroy() {
        }
        
        // 普通函数
        searchData () {
             this.tableData.currentPage = 1;
             this.getDataList();
        }
        
        clickChangeName(){
            this.name = '' + Math.random() * 1000;
        }       
    }
</script>

<!--项目里使用的是scss，加scoped后不会污染其他的页面的css-->
<style lang="scss" scoped>
    /*scss简单语法*/
    .anme{
        .name{
            /*子级*/
        }
        &:hover{
            /*&是连接符，去除连接的空格*/
        }
    }
    /*
        会被编译成
        .anme .name[data-093872]{}
        .anme:hover[data-093872]{}
    */

    /*有时候权重太低，我们需要提升权重 要在最前面加/deep/ */
    /deep/ .sop{
        .name{}
    }
    /*
        会被编译成(权重会被提升)
        .sop[data-093872] .name{}
    */
}   
</style>
```

这段实例里面最重要的是Typescript在vue里面的语法。
如果写错了编辑器基本会提示错误，按照错误提示修改即可。

## SCSS用法
scss的用法请参考。。。

## 常用组件
。。。





