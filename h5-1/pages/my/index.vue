<template>
    <div>
        <tk-nav-bar>
            我的
            <template slot="right">
                <div class="tools-form">
                    <nuxt-link class="menu-icon" to="/message/list" :class="{message : isLogined && !isReadMessage}">
                        <img src="https://rs.tanxingk.com/images/icon_message.png" alt="">
                    </nuxt-link>
                    <nuxt-link to="/setting" class="menu-icon">
                        <img src="https://rs.tanxingk.com/images/icon_setting.png" alt="">
                    </nuxt-link>
                </div>
            </template>
        </tk-nav-bar>
        <div class="container">
            <div>
                <section class="my-head-block">
                    <div class="wrapper">
                        <div class="main-form">
                            <div class="left-part">
                                <div class="head">
                                    <img v-if="isLogined" :src="headUrl" alt="">
                                    <img v-else src="https://rs.tanxingk.com/images/head.png" alt="">
                                </div>
                                <span class="username">{{ isLogined ? phone : '登录弹K，透视量化' }}</span>
                            </div>
                            <nuxt-link v-if="isLogined" class="sign-icon" to="/checkin" :class="{nosign : !isSigned}" />
                            <nuxt-link v-if="!isLogined" class="login-btn" to="/auth/login">
                                未登录
                            </nuxt-link>
                        </div>
                    </div>
                </section>
                <section class="my-items-block">
                    <div class="cap-title">
                        <h3 class="title">
                            期货账户
                        </h3>
                        <a class="right-btn" @click="clickOnLoginFutureAccount">未登录</a>
                    </div>
                    <ul class="item-list">
                        <li v-for="(item, idx) in iconsFutureList" :key="idx" class="item" @click="clickOnIcon(item)">
                            <img :src="item.imageUrl" alt="" class="icon">
                            <span class="name">{{ item.imageTitle }}</span>
                        </li>
                    </ul>
                </section>
                <section class="my-items-block">
                    <div class="message-margin">
                        <i class="icon icon-notice" />
                        <van-swipe style="height: .9rem" vertical :autoplay="5000" :loop="true"
                                   :show-indicators="false" :duration="1000" :touchable="false"
                        >
                            <van-swipe-item v-for="(item,idx) in messageScrollList" :key="idx">
                                <a class="cap-title message-scroll"
                                   @click="clickOnMessageScroll(item.messageType, item.messageId, item.messageNoticeId)"
                                >
                                    <h3 class="title" style="width: 100%;">
                                        <span class="notice-text" :class="{hasdot: !item.isRead}">{{ item.messageContent }}</span>
                                    </h3>
                                </a>
                            </van-swipe-item>
                        </van-swipe>
                    </div>
                </section>

                <section class="my-items-block">
                    <div class="cap-title">
                        <h3 class="title">
                            我的K豆
                        </h3>
                        <nuxt-link v-if="!isLogined" class="right-btn" to="/auth/login">
                            未登录
                        </nuxt-link>
                        <nuxt-link v-else class="right-btn" to="/kcoin" style="width: 1.5rem;text-align: right">
                            {{ kCoinNum }}
                        </nuxt-link>
                    </div>
                    <ul v-if="iconsKcoinList.length > 0" class="item-list">
                        <li v-for="(item, idx) in iconsKcoinList" :key="idx" class="item" @click="clickOnIcon(item)">
                            <img :src="item.imageUrl" alt="" class="icon">
                            <span class="name">{{ item.imageTitle }}</span>
                        </li>
                    </ul>
                </section>

                <section class="my-hold-swiper">
                    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                        <van-swipe-item v-for="(item, idx) in bannerDataList" :key="idx" class="item"
                                        @click="clickOnIcon(item)"
                        >
                            <a class="link">
                                <img :src="item.imageUrl" alt="" class="show-pic">
                            </a>
                        </van-swipe-item>
                    </van-swipe>
                </section>

                <section class="my-items-block">
                    <ul class="item-list-intro">
                        <li v-for="(item, idx) in iconsIntroList" :key="idx" class="item" @click="clickOnIcon(item)">
                            <img :src="item.imageUrl" alt="" class="icon">
                            <div>
                                <p class="title">
                                    {{ item.imageTitle }}
                                </p>
                                <p class="short">
                                    {{ item.description }}
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>
                <!-- 帮助中心 -->
                <section class="my-items-block bottom">
                    <ul class="item-list">
                        <li v-for="(item, idx) in iconsHelpList" :key="idx" class="item" @click="clickOnIcon(item)">
                            <img :src="item.imageUrl" alt="" class="icon">
                            <span class="name">{{ item.imageTitle }}</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';
    import {jumpToPageUrl} from '@/utils';

    @Component({
        components: {},
        async asyncData(app) {
            const result = await Promise.all([
                postAsync('/user/queryUserInfoByLogin'),
                postAsync('/operate/getIndexIconAndBannerList', {
                    displayPlatform: 2
                }),
                postAsync('/myMessage/messageRoll', {})
            ]);
            const resp = result?.[0]?.[1];
            const resp1 = result?.[1]?.[1];
            const resp3 = result?.[2]?.[1];
            // console.log('app', resp3);

            let isLogined = false;
            let isSigned = false;
            let headUrl = '';
            let phone = '';
            let kCoinNum = 0;
            let isReadMessage = false;
            if (resp?.code === '000000') {
                // console.log(resp.data);
                isLogined = true;
                isSigned = Number(resp.data.isSign) === 1;
                kCoinNum = resp.data.ableUseBean;
                headUrl = resp.data.photo;
                phone = resp.data.phone;
                isReadMessage = Number(resp.data.isRead) === 1;
            }

            const iconsFuture: any[] = [];
            const iconsKcoin: any[] = [];
            const iconsHelp: any[] = [];
            const iconsIntro: any[] = [];
            const bannerList: any[] = [];
            const messageScroll: any[] = [];

            if (resp1?.code === '000000') {
                const data = resp1?.data || {};
                const getData = (item: any) => {
                    return {
                        imageUrl: item.imageUrl,
                        imageTitle: item.imageTitle,
                        description: item.description || '',
                        urlType: String(item.urlType),
                        url: item.url,
                        power: item.power,
                        pageId: item.pageId,
                        pageKey: String(item.pageKey),
                        pageValue: item.pageValue
                    };
                };
                (data.listIcon1 || []).forEach((item: any) => {
                    iconsHelp.push(getData(item));
                });
                (data.listIcon2 || []).forEach((item: any) => {
                    iconsFuture.push(getData(item));
                });
                (data.listIcon3 || []).forEach((item: any) => {
                    iconsIntro.push(getData(item));
                });
                (data.listIcon4 || []).forEach((item: any) => {
                    iconsKcoin.push(getData(item));
                });
                (data.listBanner || []).forEach((item: any) => {
                    bannerList.push(getData(item));
                });
            }

            if (resp3?.code === '000000') {
                const data = resp3?.data || {};
                (data || []).forEach((item: any) => {
                    messageScroll.push({
                        isRead: Number(item.isRead) === 1,
                        messageType: item.messageType + '',
                        messageId: item.messageId + '',
                        messageNoticeId: item.messageNoticeId + '',
                        messageContent: item.messageContent
                    });
                });
            }

            return {
                isLogined,
                isSigned,
                headUrl,
                phone, // 手机号
                kCoinNum, // k豆数量
                isReadMessage, // 手机号
                iconsFutureList: iconsFuture,
                iconsKcoinList: iconsKcoin,
                iconsHelpList: iconsHelp,
                iconsIntroList: iconsIntro,
                bannerDataList: bannerList,
                messageScrollList: messageScroll
            };
        }
    })
    export default class extends Vue {
        isLogined = false; // 是否登录平台账户
        isSigned = false; // 是否已经签到
        isFutureLogined = false; // 是否登录期货账户
        headUrl = '';
        phone = '';
        isReadMessage = true;
        kCoinNum = 0; // 我的K豆数量
        iconsHelpList: any[] = []; // 帮助的icon列表
        iconsFutureList: any[] = []; // 期货的icon列表
        iconsKcoinList: any[] = []; // 我的K豆的icon列表
        iconsIntroList: any[] = []; // 帮助icon列表
        bannerDataList: any[] = []; // bannerList列表
        messageScrollList: any[] = []; // 滚动的消息列表

        mounted() {
        }

        jumpToUrlWithAuth(url: string) {
            if (this.isLogined) {
                this.$router.push(url);
            } else {
                this.$router.push('/auth/login?to=' + encodeURIComponent(url));
            }
        }

        async clickOnIcon(data: any) {
            if (data) {
                await jumpToPageUrl(data, this.$router);
            }
        }

        async clickOnMessageScroll(type: string, id: string, messageNoticeId: string) {
            // 1=平台公告，2=系统通知，3=K豆通知，7=反馈通知
            let url = '';
            switch (String(type)) {
                case '1':
                    url = '/message/notice_detail?id=' + id; // 平台公告
                    break;
                case '2':
                    url = '/message/system_detail?id=' + id; // todo 暂时没做
                    break;
                case '3':
                    url = '/message/kcoin_list'; // K豆通知
                    break;
                case '7':
                    url = '/message/feedback_list'; // 反馈通知
                    break;
                default:
                    console.log('消息类型不正确');
                    break;
            }
            await postAsync('/myMessage/queryMessageInfoByMessageNoticeId', {
                messageNoticeId
            });
            this.$router.push(url);
        }

        clickOnLoginFutureAccount() {
            if (!this.isLogined) {
                this.$showMessageBox('温馨提示',
                    '登录期货账号前<br>需要先登录弹性K线',
                    '确定',
                    '去登录').then(() => {
                    window.location.href = '/auth/login?to=' + encodeURIComponent('/my');
                }).catch(() => {
                });
            }
        }
    }
</script>

<style lang="scss">
    .tools-form {
        display: flex;
        justify-content: flex-end;
        margin-top: 25px;
        margin-right: 25px;

        .menu-icon {
            width: 40px;
            height: 40px;
            margin-left: 30px;
            position: relative;

            &.message {
                @include dot(#fff, 12px, 0px, -2px);
            }

            > img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .my-head-block {
        background-color: $color-main;
        padding: 35px 30px;

        .wrapper {

        }

        .main-form {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left-part {
                display: flex;
                align-items: center;
            }
        }

        .head {
            width: 90px;
            height: 90px;
            margin-right: 26px;
            background-color: #eaeaea;
            border-radius: 50%;
            overflow: hidden;

            > img {
                width: 100%;
                height: 100%;
            }
        }

        .username {
            color: #fff;
            font-size: 32px;
        }
    }

    .login-btn {
        font-size: 28px;
        justify-self: end;
        color: #fff;
        position: relative;
        padding-right: 20px;
        @include rightArrow(#fff, 16px, 10px, 0)
    }

    .sign-icon {
        display: block;
        background: url('https://rs.tanxingk.com/images/sign_white.png') top /100% 100% no-repeat;
        width: 40px;
        height: 40px;
        position: relative;
        &.nosign::after{
            position: absolute;
            content: '';
            top: 0;
            right: 0;
            bottom: auto;
            left: auto;
            width: 12px;
            height: 12px;
            background-color: #fff;
            border-radius: 50%;
        }
    }

    .my-items-block {
        background-color: #fff;
        margin-bottom: 20px;

        .cap-title {
            display: flex;
            justify-content: space-between;
            padding: 25px 20px;
            @include thinBorder('bottom', #eee);

            .title {
                color: #333;
                font-size: 32px;
                line-height: 35px;
                font-weight: normal;
            }

            .right-btn {
                align-items: center;
                font-size: 28px;
                line-height: 35px;
                color: #999;
                position: relative;
                padding-right: 30px;
                @include rightArrow(#999, 16px, 10px, 10px)
            }
        }

        .item-list {
            display: flex;
            flex-wrap: wrap;
            padding: 10px 20px;

            .item {
                flex: 0 0 25%;
                width: 180px;
                margin: 30px 0;
                text-align: center;

                .icon {
                    width: 60px;
                    height: 60px;
                    display: block;
                    margin: 0 auto;
                    // background-color: #eaeaea;
                    border-radius: 50%;
                }

                .name {
                    color: #333;
                    display: block;
                    font-size: 24px;
                    margin-top: 15px;
                    text-align: center;
                    @include ellipsis(1);
                }
            }
        }

        .item-list-intro {
            display: flex;
            flex-wrap: wrap;
            padding: 10px 40px;

            .item {
                width: 330px;
                display: flex;
                margin: 20px 0;

                .icon {
                    width: 70px;
                    height: 70px;
                    display: block;
                    border-radius: 50%;
                    // background-color: #ccc;
                }

                .icon + div {
                    margin-left: 24px;
                }

                .title {
                    color: #333;
                    font-size: 30px;
                }

                .short {
                    color: #999;
                    font-size: 24px;
                    margin-top: 4px;
                    max-width: 220px;
                    @include ellipsis() /*溢出*/
                }
            }
        }
    }

    .my-hold-swiper {
        margin: 20px;
        background-color: #fff;
        border-radius: 8px;
        height: 210px;
    }

    /deep/ .van-swipe .message-scroll.hasdot {
        &::after {
            display: none;
        }
    }

    .notice-text {
        width: 100%;
        color: #0087FF;
        font-size: 26px;
        display: inline-block;
        vertical-align: top;
        line-height: 40px;
        padding-right: 40px;
        @include ellipsis();
        position: relative;

        &.hasdot {
            @include dot($color-main, 10px, 14px, 15px); // 红点
        }
    }

    .my-items-block.bottom {
        margin-bottom: 0;

        .item-list {
            .item {
                width: 170px;

                .icon {
                    width: 70px;
                    height: 70px;
                }
            }
        }
    }

    .container {
        /*padding-bottom: 20px;*/
    }

    .my-swipe {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;

        .link {
            display: block;
            height: 100%;

            > img {
                display: block;
                height: 100%;
                width: 100%;
            }
        }
    }

    .message-margin {
        height: 90px;
        padding: 0 30px;
        display: flex;

        .icon {
            margin-top: 25px;
        }

        .van-swipe {
            flex: 1;
        }

        .van-swipe-item {
            width: 100%;
        }

        position: relative;
        @include rightArrow(#999, 16px, 35px, 32px); // 红箭头
    }
</style>
