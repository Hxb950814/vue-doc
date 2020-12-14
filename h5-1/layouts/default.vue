<template>
    <nuxt :class="[isInApp ? 'tkapp' : '', 'page' + path]" />
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Route} from 'vue-router';
    import {Getter} from 'vuex-class';
    import {setShareConfig} from '@/utils';

    @Component({
        // middleware: 'common',
    })
    export default class extends Vue {
        @Getter('isInApp')
        isInApp!: boolean

        path = '';

        beforeMount() {

        }

        mounted() {
            console.log('是否app', this.isInApp);
            this.path = this.$route.path.replace(/\//g, '-');
            // this.path = this.$route.path.replace(/\//g, '-');
            this.setShareConf();
        }

        @Watch('$route')
        onRouterChange(newRoute: Route, oldRoute: Route) {
            this.setShareConf(newRoute, oldRoute);
        }

        setShareConf(newRoute?: Route, oldRoute?: Route) {
            setShareConfig();
            /* 不在白名单的页面全部是默认分享 */
            // const whiteList = [
            //     '/news/detail'
            // ];
            // if (!(oldRoute && newRoute)) { // 是刷新进入的页面
            //     if (!whiteList.includes(this.$route.path)) {
            //         setShareConfig(); // 默认分享
            //     }
            //     return;
            // }
            // // 是路由跳转，且从自定义分享的页面再进入默认分享的页面， 将默认分享设置
            // if (!whiteList.includes(newRoute.path) && whiteList.includes(oldRoute.path)) {
            //     setShareConfig();
            // } else {
            //     //
            // }
        }
    }
</script>

<style lang="scss">
</style>
