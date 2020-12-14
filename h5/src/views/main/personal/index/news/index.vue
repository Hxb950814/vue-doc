<template>
    <div class="hbb-order-page">
        <h2>
            <span>我的消息</span>
            <span @click="clearRead" v-if="isRead">清除未读</span>
        </h2>
        <div class="box">
            <div class="group" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
                <div class="imgBox">
                    <img v-if="item.messageType === 1" src="@assets/images/xx-1.png" alt="">
                    <img v-if="item.messageType === 2" src="@assets/images/xx-2.png" alt="">
                    <img v-if="item.messageType === 3" src="@assets/images/xx-3.png" alt="">
                    <img v-if="item.messageType === 4" src="@assets/images/xx-4.png" alt="">
                    <img v-if="item.messageType === 5" src="@assets/images/xx-5.png" alt="">
                    <span v-if="!item.isRead"></span>
                </div>
                <div class="right">
                    <div style="width: 90%">
                        <h2 class="ellipsis">{{['','平台公告','课程通知','订单通知','积分商城','反馈通知'][item.messageType]}}</h2>
                        <p class="ellipsis">{{item.messageContent}}</p>
                    </div>
                    <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
                </div>
            </div>
            <div class="hbb-noData" v-if="dataList.length === 0">
                <img width="200px" src="@assets/images/noData.png" alt="">
                <p>暂无数据</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal.ts";

    @Component({})
    export default class extends Vue {
        isRead = true;
        dataList:any[] = [];
        mounted() {
           this.getDataList();
        }

        getDataList() {
            PersonalModule.getQueryMyMessageNotice().then((res:any) => {
                this.dataList = res?.data;
                let arr = this.dataList.filter((x:any) => x.isRead === 0);
                if (arr.length > 1) {
                    this.isRead = true;
                } else {
                    this.isRead = false;
                }
            })
        }


        goDetail(item:any) {
            // 去详情页面
            let goPath;

            switch (item.messageType) {
                case 1:
                    goPath = '/personal/announcement';
                    break;
                case 2:
                    goPath = '/personal/course';
                    break;
                case 3:
                    goPath = '/personal/orderNews';
                    break;
                case 4:
                    this.$toast('敬请期待');
                    return false;
                    goPath = '/personal/integral';
                    break;
                case 5:
                    this.$toast('敬请期待');
                    return false;
                    goPath = '/personal/feedbackNews';
                    break;
                default:
                    break;

            }
            let requestObj = {
                messageType: item.messageType
            }
            PersonalModule.getQueryMessageNoticeInfo(requestObj).then((res:any) => {})
            this.$router.push({
                path: goPath,
                query: {
                    id: item.messageType
                }
            })
        }

        clearRead() {
            // 清除所有未读消息
            PersonalModule.updateAllMessageNotice().then((res:any) => {
                this.getDataList();
            })
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-order-page{
        h2{
            background-color: #f6f6f6;
            font-size: 24px;
            color: #333;
            display: flex;
            width: 100%;
            height: 75px;
            font-weight: normal;
            padding: 0 30px;
            align-items: center;
            justify-content: space-between;
        }
        .box{
            padding: 0 30px;
            display: flex;
            width: 100%;
            flex-direction: column;
            .group{
                display: flex;
                width: 100%;
                margin-top: 25px;
                position: relative;
                align-items: center;
                .imgBox{
                    width: 72px;
                    height: 72px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius:10px;
                    }
                    position: relative;
                    span{
                        display: flex;
                        width: 20px;
                        height: 20px;
                        background: #ff2c27;
                        border-radius: 50%;
                        position: absolute;
                        right: -5px;
                        top: -5px;
                        z-index: 5;
                    }


                    &.c{
                        width: 120px;
                        position: absolute;
                        top: 20px;
                        right: 0;
                        height: 120px;
                    }
                }
                .right{
                    display: flex;
                    padding:10px 20px;
                    width: calc(100% - 72px);
                    align-items: center;
                    justify-content: space-between;
                    h2{
                        font-size: 30px;
                        height: auto;
                        color: $base-font-color;
                        margin-bottom: 10px;
                        background: none;
                        padding: 0;
                        @include ellipsis(1);
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
                            padding:5px 20px;
                            margin-right: 10px;
                            border-radius: 30px;
                            font-size: 22px;
                            color: $color-ff9600;
                            background-color:#f6f6f6;
                        }
                    }

                }
                p{
                    font-size: 24px;
                    color: #666;
                    margin-top: 10px;
                    @include ellipsis(1)
                }
            }
        }
    }
</style>
