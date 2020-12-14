<template>
    <div>
        <div class="hbb-courses-list" v-if="dataList.length > 0">
            <div class="group" v-for="(item, index) in dataList" :key="index" @click="goCoursesDetail(item)">
                <img :src="item.courseImgUrl" alt="">
                <div class="right" :style="{marginTop: mode === 0? '0' : ''}">
                    <div class="tab" v-if="mode === 0">
                        <span v-if="item.label1">{{item.label1}}</span>
                        <span v-if="item.label2">{{item.label2}}</span>
                        <span v-if="item.label3">{{item.label3}}</span>
                    </div>
                    <h2 style="margin-top:5px">{{item.courseName}}</h2>
                    <p v-if="mode === 0">{{item.chapterNo}} 第{{item.sectionNo}}节 {{item.sectionTitle}}</p>
                    <p>{{item.courseDescribe}}</p>
                    <p class="hbb-time" v-if="mode !== 0">{{item.className ? item.className + '，' : ''}} {{item.start_text}}至{{item.end_text}}</p>
                    <p class="hbb-time" v-if="mode === 0">{{item.className ? item.className + '，' : ''}} {{item.time_text}}，开始学习</p>
                    <p class="hbb-learn"  v-if="mode !== 0">共{{item.chapterNum}}章{{item.sectionNum}}个小节，学习进度：{{item.unLockNum}}%</p>
                </div>
            </div>
        </div>
        <div class="hbb-noData" v-else>
            <span v-if="courseId === 0">巴菲特说“投资很简单，但并不容易”</span>
            <span v-if="courseId === 1">巴菲特说“投资很简单，但并不容易”</span>
            <span v-if="courseId === 2">巴菲特说“投资很简单，但并不容易”</span>
            <span v-if="courseId === 3">了解保险，从这里开始~</span>
            <span v-if="courseId === 4">改变思维，穷人思维到富人思维</span>
            <span v-if="courseId === 5">巴菲特说“投资很简单，但并不容易”</span>
            <span v-if="courseId === 6">巴菲特说“投资很简单，但并不容易”</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {KnowledgeModule} from "@/store/modules/user/knowledge";
    import dataListMixins from "@/mixins/dataListMixins";
    import dayjs from "dayjs";

    @Component({})
    export default class  extends dataListMixins {
        @Prop({type: Number,default:0, required:false })
        mode!:number; // 0:今日课程 则：其他课程
        @Prop({type: Number,default:0, required:false })
        courseId!:number; // 0:今日课程 则：其他课程

        dataList:any[] = [];

        mounted(){
            this.getData(1)
        }

        async getData(page: number) {
            this.getQueryRecommendCourseList(page)
        }

        getQueryRecommendCourseList(page: number){
            // 推荐课程
            let Fn;
            let requestData = {
                page: page,
                courseId: this.courseId
            }
            Fn = this.mode === 0 ? KnowledgeModule.getSeekPageTodayCourse(page) : KnowledgeModule.getSeekPageNoListenCourseList(requestData);
            Fn.then((res:any) => {
                this.page = page;
                const data = res?.data || {};
                if (this.page === 1) {
                    this.dataList = [];
                }
                if(this.mode === 0) {
                    this.dataList = this.dataList.concat(res?.data);
                } else {
                    this.dataList = this.dataList.concat(data?.result);
                }
                this.dataList.forEach((x:any) => {
                    x.time_text = x.time ? dayjs(x.time).format("YYYY-MM-DD") : '';
                    x.start_text = x.startDate ? dayjs(x.startDate).format("YYYY-MM-DD") : '';
                    x.end_text = x.endDate ? dayjs(x.endDate).format("YYYY-MM-DD") : '';
                })
                this.handleRefresh(true, data.totalPage > data.pageNo);
            }).catch((err:string) => {
                // this.$toast(err);
                this.handleRefresh(false);
            });
        }

        goCoursesDetail(item:any) {
            if(this.mode === 0) {
                if(item.courseFrom === 1) {
                    this.$router.push({
                        path: '/home/audition',
                        query: {
                            id: item.chapterSectionId
                        }
                    })
                } else {
                    this.$router.push({
                        path: '/home/lookVideo',
                        query: {
                            id: item.chapterSectionId,
                            cId: item.courseTypeId
                        }
                    })
                }
            } else {
                this.$router.push({
                    path: '/home/seekCurriculum',
                    query: {
                        id: item.courseTypeId
                    }
                })
            }
        }

    }
</script>

<style lang="scss" scoped>
    .hbb-courses-list{
        display: flex;
        width: 100%;
        padding-bottom: 50px;
        flex-direction: column;
        .group{
            display: flex;
            width: 100%;
            margin-top: 25px;
            img{
                width: 170px;
                height: 200px;
                border-radius: 20px;
            }
            .right{
                display: flex;
                width: calc(100% - 170px);
                flex-direction: column;
                padding:5px 20px;
                h2{
                    font-size: 30px;
                    color: $base-font-color;
                    margin-bottom: 5px;
                    @include ellipsis(1);
                }
                p{
                    font-size: 26px;
                    color: $color-666;
                    margin-bottom: 3px;
                    @include ellipsis(1);
                    &.hbb-learn{
                        color: $color-ff9600;
                    }
                    &.hbb-time{
                        color: $color-gray;
                    }
                }

                .tab{
                    width: 100%;
                    margin-bottom: 10px;
                    span{
                        padding:5px 15px;
                        margin-right: 10px;
                        border-radius: 5px;
                        font-size: 22px;
                        color: $color-ff9600;
                        border: 2px solid $color-ff9600;
                    }
                }
                .bottom{
                    display: flex;
                    width: 100%;
                    align-items: center;
                    *{
                        margin-right: 20px;
                        font-size: 26px;
                        color: #666;
                    }
                    b{
                        color: $color-main;
                        font-size: 32px;
                    }
                    span{
                        font-size: 26px;
                        color: $color-ff9600;
                    }
                }

            }
        }
    }
</style>
