<template>
    <header class="app-header clearfix">
        <div class="l-part">
            <a class="image-icon" href="/">
                <img src="@/assets/images/head_icon.png" width="150" alt="logo">
            </a>

            <span class="welcome-text">
                欢迎  {{ userName }}  进入{{ moduleName }}，祝你工作愉快
            </span>
        </div>

        <ul class="right-menu">
            <!--            <li class="item" @click="updatePermission">更新权限</li>-->
            <!--            <li class="item" @click="clickModifyPassword">修改密码</li>-->
            <li class="item" @click="safeExit">
                安全退出
            </li>
        </ul>
    </header>
</template>

<script lang="ts">
    import {Component, Provide, Watch, Vue} from 'vue-property-decorator';
    import {Getter} from 'vuex-class';
    import {Route} from 'vue-router';
    import PubSub from 'pubsub-js';
    import mapsRouterData from '@/router/maps';

    @Component
    export default class Headbar extends Vue {
        moduleName = '';

        @Getter('account')
        account: any;

        @Getter('userName')
        userName: any;

        @Getter('moduleId')
        moduleId?: string;

        mounted() {
            const find = mapsRouterData.find((item: any) => {
                return String(item.id) === String(this.moduleId);
            });
            if (find) {
                this.moduleName = find.name;
            }
        }

        beforeDestroy() {
        }

        // 路由发生了变化，重新渲染路由
        @Watch('$route')
        onRouterChange(route: Route) {
            //   this.markMenu(route.meta.groupId);
        }

        /* 登出 */
        async safeExit() {
            const [err, resp] = await this.$getAsync('/admin/logout'); // 退出
            this.$store.dispatch('removeToken');
            this.$store.dispatch('removePermissionList'); // 清除permissionList
            window.location.href = '/login';
        }

        /* 点击修改密码 */
        clickModifyPassword() {
            PubSub.publish('popShowModifyPanel', {});
        }

        /* 更新权限 */
        async updatePermission() {
            const [err, resp] = await this.$postAsync('/menu/getAllAuthCode', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$store.dispatch('setPermissionList', {permissionList: resp.data});
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
