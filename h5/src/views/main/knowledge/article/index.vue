<template>
    <div class="hbb-meowCoin-page">
        <img width='100%' src="@assets/images/wenzang.png" alt="">
        <div class="top hbb-scoller-content" v-if="dataList.length > 0">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp"  html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
            <div class="group" v-for="(item,index) in dataList" :key='index' @click='goDetail(item)'>
                <div class="l">
                    <img :src="item.imgName" alt="" />
                </div>
                <div class="r">
                    <h2>{{item.title}}</h2>
                    <div>
                        <span @click.stop="likeClick(item)"><b :class="item.isLike === 0 ? '': 'active'"></b>{{item.likeNum}}</span>
                        <span @click.stop="collectClick(item)" >
                            <b :class="item.isCollect === 0 ? '': 'active'"></b>
                            {{item.collectNum}}</span>
                    </div>
                </div>
            </div>
            </mescroll-vue>
        </div>
        <div class="hbb-noData" v-else>
            暂无数据
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {KnowledgeModule} from "@/store/modules/user/knowledge.ts";
    import dataListMixins from "@/mixins/dataListMixins";

    @Component({
        components:{}
    })
    export default class  extends dataListMixins {
        dataList:any[] = [];
        mounted() {
            this.getData(1);

        }

        async getData(page: number) {
            KnowledgeModule.getQueryArticleListPage(page).then((res:any) => {
                this.page = page;
                const data = res?.data || {};
                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(data?.result);
                this.handleRefresh(true, data.totalPage > data.pageNo);
            }).catch((err:string) => {
                // this.$toast(err);
                this.handleRefresh(false);
            });
        }

        collectClick(item:any) {
            // isCollect 0: 取消收藏 1：收藏
            item.isCollect = item.isCollect === 0 ? 1 : 0;
            item.collectNum = item.isCollect === 0 ? item.collectNum - 1 : item.collectNum + 1;
            let requestData = {
                articleId: item.articleId,
                operate: item.isCollect === 0 ? 1 : 0,
                type: 1
            }
            KnowledgeModule.getUpdateArticleCollectOrLike(requestData).then((res:any) => {})
        }
        likeClick(item:any) {
            // isCollect 0: 取消点赞 1：点赞
            item.isLike= item.isLike === 0 ? 1 : 0;
            item.likeNum = item.isLike === 0 ? item.likeNum - 1 : item.likeNum + 1;
            let requestData = {
                articleId: item.articleId,
                operate: item.isLike === 0 ? 1 : 0,
                type: 0
            }
            KnowledgeModule.getUpdateArticleCollectOrLike(requestData).then((res:any) => {})
        }

        goDetail(item:any) {
            // 去详情页面
            this.$router.push({
                path: '/knowledge/articleDetail',
                query: {
                    id: String(item.articleId)
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
.hbb-meowCoin-page{
    .top{
        display: flex;
        flex-direction: column;
        width: 100%;
        .group{
            display: flex;
            width: 100%;
            padding:30px;
            border-bottom: 2px solid #eee;
            .l{

                width: 140px;
                height:140px;
                border-radius: 10px;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .r{
                width: calc(100% - 140px);
                padding-left: 30px;
                position: relative;
                h2{
                    @include ellipsis(2);
                    color: #333;
                    font-size: 30px;
                    font-weight: normal;
                }
                div{
                    display: flex;
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    span{
                        display: flex;
                        align-items: center;
                        margin-right:50px;
                        color: #666;
                        font-size: 22px;
                        b{
                            width: 24px;
                            height: 24px;
                            margin-right: 10px;
                        }
                        &:nth-of-type(1){
                            b{
                                background-color: #bbb;
                                &.active{
                                    background-color: #ff2c27;
                                }
                                -webkit-mask: url(../../../../assets/images/dianzan.svg) center center / contain no-repeat;
                            }
                        }
                        &:nth-of-type(2){
                            b{

                                background-color: #bbb;
                                &.active{
                                    background-color: #FFC000;
                                }
                                -webkit-mask: url(../../../../assets/images/shouc.svg) center center / contain no-repeat;
                            }
                        }
                    }
                }
            }
        }
        .hbb-noData{
            display: flex;
            width: 100%;
            height: 150px;
            justify-content: center;
            align-items: center;
            font-size: 26px;
            color: $color-gray;
        }
    }
}
</style>
