<template>
    <div>
        <tk-nav-bar>
            行情与资讯
        </tk-nav-bar>
        <div class="container">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp"
                          html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
                <ul v-if="dataLoaded && dataList.length > 0" class="tk-information-ul">
                    <li v-for="(item,idx) in dataList" :key="idx">
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
                        <div v-if="item.isTop" class="top-flag">
                            <!--todo-->
                        </div>
                    </li>
                </ul>
                <div v-if="dataLoaded && dataList.length === 0" class="tk-list-nodata">
                    <div class="icon">
                        无数据
                    </div>
                </div>
            </mescroll-vue>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import dataListMixins from '@/mixins/dataListMixins';
    import {postAsync} from '@/utils/request';

    @Component({
        components: {}
    })
    export default class extends dataListMixins {
        mounted() {
        }

        async getData(page: number) {
            const [_, resp] = await postAsync('/operate/getArticleList', {
                page
            });
            if (resp?.code === '000000') {
                this.page = page;
                const data = resp?.data || {};
                const result = data.result;
                const list: any[] = [];
                (result || []).forEach((item: any) => {
                    list.push({
                        tag: (item.label || '').split(','),
                        title: item.title,
                        articleFrom: item.articleFrom,
                        articleId: '' + item.articleId,
                        pageValue: item.pageValue,
                        imgName: item.imgName,
                        isTop: Boolean(item.isTop)
                    });
                });

                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(list);
                this.handleRefresh(true, data.totalPage > data.pageNo);
            } else {
                this.handleRefresh(false);
            }
        }

        clickInfoDetail(id: string) {
            this.$router.push('/news/detail?id=' + id);
        }
    }
</script>

<style lang="scss" scoped>
    .container {
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
                object-fit: contain;
            }
        }
    }
</style>
