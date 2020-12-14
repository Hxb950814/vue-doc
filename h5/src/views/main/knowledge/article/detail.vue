<template>
    <div class="hbb-detail-page">
        <h2 class="title">{{pageData && pageData.title}}</h2>
        <p class="info">
            <span>{{pageData && pageData.publishTime}}</span>
            <span>{{pageData && pageData.articleFrom}}</span>
        </p>
        <div class="con" v-html="pageData && pageData.content">

        </div>
        <div class="shareDiago" @click="shareModalState = false" v-if="shareModalState">
            <img src="@/assets/images/shareGuide.png" alt="">
        </div>
        <div class="footer">
            <van-icon name="arrow-left" size="20" color="rgb(187, 187, 187)" @click='goBack'/>
            <div>
                <span class="a" @click="likeClick(pageData)"><b :class="pageData.isLike === 0 ? '': 'active'"></b>{{pageData && pageData.likeNum}}</span>
                <span class="a"  @click="collectClick(pageData)"><b :class="pageData.isCollect === 0 ? '': 'active'"></b>{{pageData && pageData.collectNum}}</span>
                <span @click="goShare"  class="a"><svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="2" style="height: calc(100% - 0px); width: calc(100% - 0px);"><path d="M832 576a32 32 0 0 0-32 32l0.256 192L224 800.256 223.744 224H416a32 32 0 0 0 0-64H223.744A63.84 63.84 0 0 0 160 223.744v576.512C160 835.392 188.608 864 223.744 864h576.512A63.84 63.84 0 0 0 864 800.256V608a32 32 0 0 0-32-32M800.544 160H640a32 32 0 0 0 0 64l114.944-0.192-265.6 265.568a32 32 0 0 0 45.28 45.248l265.664-265.632v115.264a32 32 0 1 0 64 0V223.744A63.84 63.84 0 0 0 800.544 160" style="fill: rgb(0, 154, 255);"></path></svg></span>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {KnowledgeModule} from "@/store/modules/user/knowledge.ts";
    import {appweixin} from "@/utils/wechart";
    import {PersonalModule} from "@/store/modules/user/personal";
    import {HomeModule} from "@/store/modules/user/home";

    @Component({
        components:{}
    })
    export default class extends Vue {
        id:string = '';
        pageData:any = {};
        shareModalState:boolean = false;

        mounted() {
            // 初始化
            this.id = String(this.$route.query.id);
            this.getDetail();
            // 月度任務
            setTimeout(() => {
                let requestObj = {
                    reasonId: this.id
                }
                PersonalModule.readTaskUserScore(requestObj).then((res:any) => {
                    if(res?.data === 0) return false;
                    this.$toast('+' + res?.data + '积分');
                })
            }, 15000)
        }

        getDetail() {
            let url = HomeModule.getUId ? location.href + '&abcde=' + HomeModule.getUId : location.href;
            KnowledgeModule.getQueryArticleInfoByIde(this.id).then((res:any) => {
                this.pageData = res?.data || {};
                appweixin.onMenuShare({
                    title: res?.data.title,
                    desc: res?.data.articleDescribe,
                    link: url,
                    show: location.href,
                    imgUrl: res?.data.shareTitleImgUrl
                });
            })
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

        goShare() {
            this.shareModalState = true;
        }


        goBack() {
            this.$router.back();
        }
    }
</script>

<style lang="scss">
.hbb-detail-page{
    padding:30px;
        h2{
            @include ellipsis(2);
            color: #333;
            font-size: 40px;
        }
        .info{
            display: flex;
            width: 100%;
            margin: 30px 0;
            align-items: center;
            span{
                color: #999;
                font-size: 26px;
                &:nth-of-type(2){
                    color: #009aff;
                    margin-left: 30px;
                }
            }
        }
        .con{

            width: 100%;
            color: #666;
            font-size: 26px;
            line-height: 45px;
            margin-bottom: 100px;
            img{
                width: 100%;
            }
        }
        .fwb{
             display: flex;
            width: 100%;
            margin:30px 0;
            color: #009aff;
            font-size: 28px;
            font-weight: bold;
        }
        .footer{
                width: 100%;
                padding-left: 30px;
                position: fixed;
                display: flex;
                justify-content: space-between;
                align-items: center;
                bottom: 0;
                left: 0;
            background: #fff;
                height: 90px;
                border-top: 2px solid #eee;

                div{
                    display: flex;
                    .a{

                        display: flex;
                        align-items: center;
                        margin-right:50px;
                        color: #666;
                        font-size: 22px;
                        b{
                            width: 30px;
                                height: 30px;
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
                        &:nth-of-type(3){
                           width: 48px;
                                height: 48px;
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
    .shareDiago{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 999;
        background-color: #000000b3;
        img{
            width: 300px;
            position: absolute;
            right: 80px;
            top: 80px;
        }
    }
}
</style>
