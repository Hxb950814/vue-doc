<template>
    <header class="tk-header">
        <div class="content">
            <a class="logo-img" href="/" />
            <div class="center-wrap">
                <div :class="{active: activeKind === ''}">
                    <nuxt-link to="/" class="link">
                        首页
                    </nuxt-link>
                </div>
                <div :class="{active: activeKind === 'position'}">
                    <nuxt-link to="/future/position" class="link">
                        持仓数据
                    </nuxt-link>
                </div>
                <div :class="{active: activeKind === 'deal'}">
                    <template v-if="isToken">
                        <nuxt-link to="/account/deal" class="link">
                            我的交易
                        </nuxt-link>
                    </template>
                    <template v-else>
                        我的交易
                    </template>
                </div>
                <div>社区</div>
                <div>关于我们</div>
            </div>
            <div class="right-part">
                <div v-if="!isLogined">
                    <a class="reg-btn" @click="clickLogin">
                        登录
                    </a>
                    <nuxt-link class="reg-btn border" to="/auth/register">
                        注册
                    </nuxt-link>
                </div>
                <div v-else class="login-info" @click="clickOnPersoninfo">
                    <svg class="icon" viewBox="0 0 90 90">
                        <path fill="#999" d="M45,49.75h.11a23.11,23.11,0,1,0,0-46.21H45a23.11,23.11,0,0,0,0,46.21Zm-16.17-23A16.14,16.14,0,0,1,45,10.58h.16a16.12,16.12,0,0,1-.05,32.23H45A16.13,16.13,0,0,1,28.85,26.7Z" />
                        <path fill="#999" d="M85.2,55.43a20.18,20.18,0,0,0-24.84-4.55A33.5,33.5,0,0,1,45,55.13a33.51,33.51,0,0,1-15.34-4.25A20.13,20.13,0,0,0,4.84,55.44,17.84,17.84,0,0,0,.5,67c0,10.76,10.15,19.51,22.63,19.51H66.87c12.48,0,22.63-8.75,22.63-19.5A17.26,17.26,0,0,0,85.2,55.43ZM79.73,60a10.54,10.54,0,0,1,2.67,6.93c-.05,6.88-7.06,12.48-15.64,12.48H23.34C14.75,79.42,7.75,73.83,7.75,67A10.4,10.4,0,0,1,10.43,60a12.81,12.81,0,0,1,9.79-4.49,13.8,13.8,0,0,1,6.34,1.6,40,40,0,0,0,18.52,5,40.06,40.06,0,0,0,18.52-5A13,13,0,0,1,79.73,60Z" />
                    </svg>
                    <span>{{ userName }}</span>
                </div>
                <div class="info-menu">
                    <ul>
                        <li @click="clickToAccount">
                            查看账户
                        </li>
                        <li @click="clickExit">
                            退出登录
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>
<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Getter } from 'vuex-class';
    import Cookie from 'js-cookie';
    import { postAsync } from '@/utils/request';

    @Component({
        asyncData() {
            return {
            };
        }
    })
    export default class TkHeader extends Vue {
        @Prop({ type: String, default: '' })
        activeKind!: string;

        @Getter('userLogined')
        isLogined!: boolean;

        @Getter('userName')
        userName!: string;

        showPersonMore = false;

        path = '';

        isToken:string = '';

        mounted() {
            this.path = this.$route.path;
            this.isToken = String(Cookie.get('token'));
        }

        clickOnPersoninfo() {
            this.showPersonMore = true;
        }

        clickToAccount() {
            this.$router.push({
                path: '/account'
            });
        }

        clickLogin() {
            let pathStr;
            if (this.$route.query.id) {
                pathStr = this.$route.path + '?id=' + this.$route.query.id;
            } else {
                pathStr = this.$route.path;
            }

            this.$router.push({
                path: '/auth/login',
                query: {
                    to: encodeURIComponent(pathStr)
                }
            });
        }

        async clickExit() {
            // 通知服务器删除token
            const [_, resp] = await postAsync('/user/loginOut', { type: 2 });
            if (resp?.code === '000000') {
            }
            // 退出成功删除cookie，修改vuex状态
            Cookie.remove('token'); // 删除掉token
            Cookie.remove('futureToken'); // 删除掉交易登陆的token
            this.$store.commit('user/exitLogin');
            // 刷新页面
            window.location.href = '/auth/login';
        }
    }
</script>

<style>
</style>
