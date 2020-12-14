<template>
    <div>
        <tk-nav-bar>系统设置</tk-nav-bar>

        <div class="container">
            <van-cell-group class="normal-menu-list">
                <van-cell title="账号设置" is-link url="/setting/account" />
                <van-cell title="行情设置" is-link @click="clickWait" />
                <van-cell title="交易设置" is-link @click="clickWait" />
                <van-cell title="图表设置" is-link @click="clickWait" />
                <van-cell title="皮肤设置">
                    <div style="padding-top: .1rem">
                        <a class="skin-btn" :class="{active: currentSkinType === 2}" @click="clickTheme(2)">黑色主题</a>
                        <a class="skin-btn" :class="{active: currentSkinType === 1}" @click="clickTheme(1)">白色主题</a>
                    </div>
                </van-cell>
                <van-cell title="关于我们" is-link url="/setting/version" />
                <van-cell title="意见反馈" is-link url="/setting/feedback" />
            </van-cell-group>

            <div v-if="isLogin" class="theme-button-wrap">
                <div class="theme-button skin-white" @click="clickLogout">
                    退出弹K
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';
    import config from '@/utils/config';

    @Component({
        components: {}
    })
    export default class extends Vue {
        version = '***';
        currentSkinType = 0; // 1是白色 2是黑色 0是未定
        isLogin = false;

        mounted() {
            this.version = config.version;
            this.currentSkinType = +(localStorage.getItem('currentSkinType') || 1);
            // 判断是否登录
            this.validate();
        }

        clickTheme(type: number) {
            if (this.currentSkinType === type) {
                return;
            }
            this.currentSkinType = type;
            localStorage.setItem('currentSkinType', String(type));
        }

        clickWait() {
            this.$showToast('功能开发中，敬请期待！');
        }

        async clickLogout() {
            // 通知服务器删除token
            const [_, resp] = await postAsync('/user/loginOut', { type: 0 });
            if (resp?.code === '000000') {
                this.$showToast('退出成功,正在跳转！');
            }
            setTimeout(() => {
                window.location.href = '/auth/login?delkey=2';
            }, 200);
        }

        async validate() {
            const [_, resp] = await postAsync('/user/validateToken', {
                type: 0
            });
            // console.log('登录拦截', resp);
            if (resp?.code === '000000') {
                this.isLogin = true;
            } else {
                this.isLogin = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .skin-btn {
        display: inline-block;
        line-height: 60px;
        height: 60px;
        background-color: #eee;
        color: #333;
        font-size: 28px;
        /*margin-top: 10px;*/
        padding: 0 10px;
        cursor: pointer;

        &.active {
            background-color: $color-main;
            color: #fff;
        }
    }
</style>
