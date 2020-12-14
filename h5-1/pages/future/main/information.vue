<template>
    <div>
        <tk-nav-bar>
            行情与资讯
        </tk-nav-bar>
        <div class="container">
            <section class="main-content">
                <div class="top-part">
                    <div class="cap-title">
                        <span class="text">行情数据</span>
                    </div>
                    <div class="data-selected">
                        <div class="select" :class="{active: activeTabIndex === '2'}" @click="clickSelectCompany('user')">
                            自选
                        </div>
                        <div class="select" :class="{active: activeTabIndex === '1'}" @click="clickSelectCompany('main')">
                            主力合约
                        </div>
                        <div v-for="(item,idx) in companyDataList" :key="idx" class="select" :class="{active: item.active}"
                             @click="clickSelectCompany(item.companyId)"
                        >
                            {{ item.companyName }}
                        </div>
                    </div>
                    <div class="swiper-wrap">
                        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                            <van-swipe-item v-for="(item, idx) in bannerDataList" :key="idx" @click="clickOnSwipe(idx)">
                                <a class="link">
                                    <img class="show-pic" :src="item.imageUrl" alt="">
                                </a>
                            </van-swipe-item>
                        </van-swipe>
                    </div>
                    <div class="cap-title">
                        <span class="text">
                            弹K资讯
                        </span>
                        <nuxt-link class="more" to="/news/list">
                            更多
                        </nuxt-link>
                    </div>
                </div>

                <ul class="tk-information-ul">
                    <li v-for="(item,idx) in infoList" :key="idx">
                        <div class="infos-block" @click="clickInfoDetail(item.articleId)">
                            <p class="title">
                                {{ item.title }}
                            </p>
                            <p>
                                <span class="origin">{{ item.articleFrom }}</span>
                                <span v-for="(tag,idx2) in item.tag" :key="idx2" class="tag">{{ tag }}</span>
                            </p>
                        </div>
                        <div class="img-wrap">
                            <img :src="item.imgName" alt="">
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HttpResponseBodyType, postAsync} from '~/utils/request';
    import {jumpToPageUrl} from '~/utils';

    @Component({
        async asyncData() {
            const result = await Promise.all([
                postAsync('/operate/getFutureCompanyList'),
                postAsync('/operate/getBannerList', {
                    displayPlatform: 2
                }),
                postAsync('/operate/getArticleIndex')
            ]);
            const resp1 = result?.[0]?.[1] || {} as HttpResponseBodyType;
            const resp2 = result?.[1]?.[1] || {} as HttpResponseBodyType;
            const resp3 = result?.[2]?.[1] || {} as HttpResponseBodyType;

            // console.log(resp1);
            console.log(resp2.data);
            const list: any[] = [];
            const list2: any[] = [];
            const list3: any[] = [];
            if (resp1?.code === '000000') {
                const data = resp1?.data || {};
                (data || []).forEach((item: any) => {
                    list.push({
                        active: false,
                        companyName: item.sourceName,
                        companyId: String(item.quotationSourceId)
                    });
                });
            }
            if (resp2?.code === '000000') {
                const data = resp2?.data || {};
                (data || []).forEach((item: any) => {
                    list2.push({
                        urlType: item.urlType,
                        url: item.url,
                        imageUrl: item.imageUrl,
                        pageId: item.pageId,
                        pageKey: item.pageKey,
                        pageValue: item.pageValue
                    });
                });
            }
            if (resp3?.code === '000000') {
                const data = resp3?.data;
                (data || []).forEach((item: any) => {
                    list3.push({
                        tag: (item.label || '').split(','),
                        title: item.title,
                        articleFrom: item.articleFrom,
                        articleId: '' + item.articleId,
                        pageValue: item.pageValue,
                        imgName: item.imgName,
                        isTop: Boolean(item.isTop)
                    });
                });
            }
            return {
                companyDataList: list,
                bannerDataList: list2,
                infoList: list3
            };
        }
    })
    export default class extends Vue {
        activeTabIndex= '';
        companyDataList: any[] = [];
        bannerDataList: any[] = [];
        infoList: any[] = [];

        mounted() {
            const typeid = this.$route.query.typeid;
            const jys = this.$route.query.jys;
            if (typeid) {
                this.activeTabIndex = String(typeid);
            } else if (jys) {
                const find = this.companyDataList.find((item: any) => {
                    return item.companyId === String(jys);
                });
                if (find) {
                    find.active = true;
                }
            } else {
                this.activeTabIndex = '1';
            }
        }

        clickSelectCompany(id: string) {
            // 跳转到页面
            if (id === 'main') {
                this.$router.push('/future?typeid=1');
            } else if (id === 'user') {
                this.$router.push('/future?typeid=2');
            } else {
                this.$router.push('/future?jys=' + id);
            }
        }

        clickOnSwipe(idx: number) {
            const iconConf = this.bannerDataList[idx];
            if (iconConf) {
                jumpToPageUrl(iconConf, this.$router);
            }
        }

        clickInfoDetail(id: string) {
            this.$router.push('/news/detail?id=' + id);
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: #fff;
    }

    .main-content {
        .top-part {
            padding-left: 30px;
            padding-right: 30px;
        }

        .cap-title {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;

            .text {
                display: inline-block;
                color: #FF1902;
                font-size: 32px;
                line-height: 60px;
                border-bottom: 1PX solid #FF1902;
            }

            .more {
                line-height: 60px;
                color: #999999;
                font-size: 28px;
                display: inline-block;
                padding-left: 20px;
            }
        }

        .data-selected {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: 30px;

            > div {
                width: 330px;
                height: 100px;
                line-height: 98px;
                font-size: 32px;
                color: #999;
                user-select: none;
                border: 1PX solid #999;
                text-align: center;
                margin-bottom: 30px;

                &.active {
                    border-color: #FF1902;
                    color: #FF1902;
                }
            }
        }
    }

    .swiper-wrap {
        width: 100%;
        height: 200px;
        border-radius: 6px;
        overflow: hidden;
    }

    .my-swipe {
        width: 100%;
        height: 100%;

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
</style>
