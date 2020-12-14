<template>
    <div>

        <div class="hbb-courses-list" v-if="dataList.length > 0">
            <div class="group" v-for="(item, index) in dataList" :key="index" @click="goCoursesDetail(item)">
                <img :src="item.courseImgUrl" alt="">
                <div class="right">
                    <h2 class="ellipsis">{{item.courseName}}</h2>
                    <p class="ellipsis">{{item.courseDescribe}}</p>
                    <div class="tab">
                        <span v-if="item.label1">{{item.label1}}</span>
                        <span v-if="item.label2">{{item.label2}}</span>
                        <span v-if="item.label3">{{item.label3}}</span>
                    </div>
                    <div class="bottom">
                        <div>
                            <b>¥{{(item.isLimitTimeDiscount === 1 ? item.discountPrice : item.markPrice) | money}}</b>
                            <s v-if="item.isLimitTimeDiscount === 1">¥{{item.markPrice | money}}</s>
                        </div>
                        <span v-if="item.isLimitTimeDiscount === 1 && item.discountTimeType === 1">{{item.time_text}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="hbb-noData" v-else>
            <span>暂无数据</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import dayjs from 'dayjs';
    import dataListMixins from "@/mixins/dataListMixins";


    @Component({})
    export default class  extends dataListMixins {
        @Prop({type: Number,default:0, required:false })
        mode!:number; // 1:banner图  2：热销课程
        @Prop({type: Number,default:0, required:false })
        courseId!:number; // 0:今日课程 则：其他课程

        dataList:any[] = [];

        mounted() {
            this.getData(1);
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
            Fn = this.mode === 0 ? HomeModule.getQueryRecommendCourseList(requestData) : HomeModule.getQueryAllNoListenCourseList(requestData);
            Fn.then((res:any) => {
                this.page = page;
                const data = res?.data || {};
                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(data?.result);
                this.dataList.forEach((x:any) => {
                    if(x.discountEndTime){
                        x.time_text = x.discountEndTime ? this.getTimeText((new Date(dayjs(x.discountEndTime).format('YYYY/MM/DD HH:mm:ss')).getTime() -  new Date().getTime())/1000, x) : x.discountEndTime;
                    }
                })
                this.handleRefresh(true, data.totalPage > data.pageNo);
            }).catch((err:string) => {
                // this.$toast(err);
                this.handleRefresh(false);
            });
        }


        getTimeText(value:number, item:any) {
            //获取到的时间
            let day;
            let hr;
            let min;
            let sec;
            setInterval(() => {
                value--;
                day = parseInt(String(value / 60 / 60 / 24));
                hr = parseInt(String(value / 60 / 60 % 24));
                min = parseInt(String(value / 60 % 60));
                sec = parseInt(String(value % 60));
                day = Number(day > 9 ? day : '0' + day);
                hr =  Number(hr > 9 ? hr : '0' + hr);
                min =  Number(min > 9 ? min : '0' + min);
                sec =  Number(sec > 9 ? sec : '0' + sec);
                item.time_text = `${day}天${hr}时${min}分${sec}秒`;
                let index = this.dataList.indexOf(item);
                this.$set(this.dataList,index , item)
            },1000);
        }


        goCoursesDetail(item:any) {
            this.$router.push({
                path: '/home/curriculum',
                query: {
                    id: item.courseTypeId
                }
            })
        }

    }
</script>

<style lang="scss" scoped>
    .hbb-courses-list{
        display: flex;
        width: 100%;
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
                padding:10px 20px;
                h2{
                    font-size: 30px;
                    color: $base-font-color;
                    margin-bottom: 10px;
                    @include ellipsis(1);
                }
                p{
                    font-size: 26px;
                    color: $color-666;
                    margin-bottom: 10px;
                }

                .tab{
                    width: 100%;
                    margin-bottom: 10px;
                    span{
                        padding:5px 20px;
                        margin-right: 10px;
                        border-radius: 30px;
                        font-size: 22px;
                        color: $color-ff9600;
                        background-color:#f6f6f6;
                    }
                }
                .bottom{
                    display: flex;
                    width: 100%;
                    align-items: center;
                    justify-content: space-between;
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
