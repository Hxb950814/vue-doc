<template>
    <div>
        <tk-nav-bar>
            我的K豆
            <template #right>
                <div class="index-icon-align">
                    <nuxt-link class="index-icon search" to="/kcoin/record_list">
                        <img src="https://rs.tanxingk.com/images/icon_kcoin.png" alt="">
                    </nuxt-link>
                </div>
            </template>
        </tk-nav-bar>
        <div class="container">
            <div class="kcoin-head-bg">
                <p class="main-value">
                    <strong> {{ totalBean | moneyInteger }}</strong>
                </p>
                <ul class="menu-list">
                    <li>
                        <p class="value">
                            {{ availableBean | moneyInteger }}
                        </p>
                        <p class="label">
                            可用
                        </p>
                    </li>
                    <li>
                        <p class="value">
                            {{ freezeBean | moneyInteger }}
                        </p>
                        <p class="label">
                            冻结
                        </p>
                    </li>
                    <li>
                        <p class="value">
                            {{ consumptionBean | moneyInteger }}
                        </p>
                        <p class="label">
                            消费
                        </p>
                    </li>
                </ul>
            </div>
            <div class="kcoin-swipe">
                <div class="swipe-body">
                    <van-swipe class="swipe" :autoplay="5000" indicator-color="white">
                        <van-swipe-item v-for="(item, idx) in iconsList" :key="idx" @click="clickOnSwipe(idx)">
                            <a class="link">
                                <img class="show-pic" :src="item.imageUrl" alt="">
                            </a>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
            <div class="kcoin-desc">
                <p class="k-title">
                    K豆是什么？
                </p>
                <p class="k-detail">
                    K豆是用于在弹性K线上购买增值服务的一种通行证！ K豆不具有变现的功能
                </p>
                <p class="k-title">
                    如何获得K豆？
                </p>
                <p class="k-detail" style="text-align: left">
                    1、可以通过购买的形式，注意购买以后无法退货！ <br>
                    2、可以通过完成平台设置的任务获得；  <br>
                    3、可以通过平台组织的一些活动获得。 <br>
                </p>
            </div>
            <div class="bottom-wrap">
                <a class="btn left" @click="clickDoJob">去做任务</a>
                <nuxt-link class="btn right" to="/kcoin/buy">
                    <!--                    <i class="buy-flag" />-->
                    去购买
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import { postAsync } from '@/utils/request';
    import { jumpToPageUrl } from '@/utils';

    @Component({
        middleware: 'auth',
        components: {},
        async asyncData() {
            const [_, resp] = await postAsync('/beanProductCtrl/findMyAccount');
            console.log(resp?.data);
            if (resp?.code === '000000') {
                const data = resp?.data || {};
                const list: any[] = [];
                (data?.banners || []).forEach((item: any) => {
                    list.push({
                        imageUrl: item.imageUrl,
                        urlType: String(item.urlType), // 类型 1=内部链接 2=外部链接
                        url: item.url, // url
                        pageId: item.pageId,
                        pageKey: item.pageKey,
                        pageValue: item.pageValue
                    });
                });

                return {
                    totalBean: data.balance,
                    freezeBean: data.freezeBean,
                    consumptionBean: Math.abs(data.consumption),
                    balanceBean: data.balance,
                    availableBean: data.available,
                    iconsList: list
                };
            }
        }
    })
    export default class extends Vue {
        totalBean = 0; // 总的K豆
        freezeBean = 0; // 冻结K豆
        consumptionBean = 0; // 消费K豆
        availableBean = 0; // 可用K豆
        balanceBean = 0; // K豆余额

        iconsList: any[] = []; // banner数据

        async mounted() {
        }

        clickDoJob() {
            this.$showToast('功能开发中,敬请期待！');
        }

        clickOnSwipe(idx: number) {
            const iconConf = this.iconsList[idx];
            if (iconConf) {
                jumpToPageUrl(iconConf, this.$router);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .index-icon-align{
        margin-top: 25px;
        padding-right: 25px;
    }
    .index-icon{
        width: 40px;
        height: 40px;
        display: inline-block;

        >img{
            width: 100%;
            height: 100%;
        }
    }
    .show-pic{
        width: 100%;
        height: 100%;
    }
    .kcoin-head-bg{
        background-color: $color-main;
        .main-value {
            text-align: center;
            padding-bottom: 48px;
            padding-top: 68px;
            strong{
                font-size: 60px;
                font-weight: bold;
                color: #fff;
            }
        }
        .menu-list{
            display: flex;
            padding: 20px;
            >li{
                text-align: center;
                flex: 1;
                color: #fff;
            }
            .label{
                font-size: 24px;
                color: #fff;
                padding-bottom: 40px;
            }
            .value{
                color: #fff;
                font-size: 32px;
                padding-bottom: 25px;
            }
        }
    }
    .kcoin-swipe{
        margin: 20px;
        .swipe{
            height: 150px;
            background-color: #fff;
            border-radius: 10px;
        }
    }

    .kcoin-desc{
        text-align: center;
        background-color: #fff;
        padding: 10px 30px;
        margin-bottom: 120px;
        .k-title{
            font-size: 32px;
            padding-bottom: 32px;
            color: $color-main;
            margin-top: 20px;
            font-weight: bold;
        }
        .k-detail{
            color: #666;
            text-align: center;
            line-height: 1.8;
            font-size: 28px;
            margin-bottom: 30px;
        }
    }
    .bottom-wrap{
        height: 100px;
        max-width: 750px;
        background-color: #03b602;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 100%;
        display: flex;
        .btn{
            flex: 1;
            text-align: center;
            color: #fff;
            line-height: 100px;
            font-size: 25px;
            position: relative;
            &.left{
                border: none;
                background: linear-gradient(to right, #FF8A45, #FF4400);
            }
            &.right{
                background: linear-gradient(to right, #FF6D5F, #FD241C);
            }
        }
        .buy-flag{
            position: absolute;
            width: 132px;
            height: 48px;
            top: -25px;
            background: url('https://rs.tanxingk.com/images/first_buy.png') top /  100% 100%no-repeat;
        }
    }
</style>
