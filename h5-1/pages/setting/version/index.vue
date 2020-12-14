<template>
    <div>
        <tk-nav-bar>当前版本</tk-nav-bar>
        <div class="container">
            <div class="icons">
                <img src="https://rs.tanxingk.com/images/logo.png" alt="" class="logo">
            </div>
            <van-cell-group class="normal-info-list">
                <van-cell title="客服热线">
                    <template>
                        <a class="contact" :href="'tel:' + contact">{{ contact }}</a>
                    </template>
                </van-cell>
                <van-cell title="微信公众号" :value="weixinKf">
                    <template>
                        <a class="contact" @click="clickCopy(weixinKf)">{{ weixinKf }}</a>
                    </template>
                </van-cell>

                <van-cell title="公司官网" :value="homepage" />
                <!--                <van-cell title="免责声明" is-link url="/agreement/disclaimer" />-->
            </van-cell-group>
            <div class="bottom-info">
                <nuxt-link class="link" to="/agreement/user">
                    《弹性K线APP软件许可及服务协议》
                </nuxt-link>
                <p class="about">
                    Copyright©2020-2020<br>
                    弹性K线tanxingk.com 版权所有
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import config from '@/utils/config';
    import {copyText} from '@/utils';

    @Component({
        components: {}
    })
    export default class extends Vue {
        version = '';
        contact = '';
        weixinKf = '';
        homepage = '';

        mounted() {
            this.version = config.version;
            this.contact = config.contact;
            this.weixinKf = config.weixin;
            this.homepage = config.homepage;
        }

        clickCopy(text: string) {
            copyText(text).then(() => {
                this.$showToast('复制成功');
            });
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: #fff;
    }

    .icons {
        margin-top: 60px;
        text-align: center;
    }

    .logo {
        width: 260px;
        height: 260px;
    }

    .contact {
        font-size: 32px;
        color: #333;
    }

    .version-text {
        text-align: center;
        font-size: 30px;
        margin-top: 12px;
        color: #666;
    }

    .bottom-info {
        text-align: center;
        margin-top: 140px;
        padding-bottom: 100px;

        .link {
            color: $color-main;
            font-size: 26px;
            display: inline-block;
            margin-bottom: 23px;
        }

        .about {
            font-size: 22px;
            line-height: 1.5;
            color: #999;
        }
    }
</style>
