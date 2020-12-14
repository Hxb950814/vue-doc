<template>
<div class="pageBox">
    <div class="hbb-invite-box">
        <img src="@assets/images/haoyout.png" alt="">
        <van-tabs v-model="friendState" @change="onClick">
            <van-tab
                v-for="(item, index) in navList"
                :key="index"
                :title="item.title + '('+ item.num +')'"
            >
            </van-tab>
        </van-tabs>
        <div class="con hbb-scoller-content hbb-scoller-content1">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp"  html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
            <template v-if="friendState === 0">
                <ul v-if="dataList.length > 0">
                    <li v-for="(item,index) in dataList" :key="index">
                        <div>
                            <h2>{{item.mobile}}</h2>
                            <p>注册时间：{{item.create_time}}</p>
                        </div>
                        <div>
                            <span>
                                {{item.learn_state === 0 ? '未报班' : '已报班'}}
                            </span>
                        </div>
                    </li>
                </ul>
                <div v-else class="hbb-noData">
                    暂无数据
                </div>
            </template>
            <template v-if="friendState === 1">
                <ul v-if="dataList1.length > 0">
                    <li v-for="(item,index) in dataList1" :key="index">
                        <div>
                            <h2>{{item.mobile}}</h2>
                            <p>注册时间：{{item.create_time}}</p>
                        </div>
                        <div>
                            <h2>首次入学：{{item.class_name}}</h2>
                            <p>入学时间：{{item.rTime}}</p>
                        </div>
                    </li>
                </ul>
                <div v-else class="hbb-noData">
                    暂无数据
                </div>
            </template>
            </mescroll-vue>
        </div>
    </div>

</div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Mixins} from "vue-property-decorator";

    import {PersonalModule} from '@/store/modules/user/personal.ts';
    import TopNav from "@components/nav/topNav.vue";
    import Footer from "@components/footer/index.vue";
    import dataListMixins from "@/mixins/dataListMixins";
    import {HomeModule} from "@/store/modules/user/home";
    import dayjs from "dayjs";

    @Component({components: {TopNav,Footer}})
    export default class  extends dataListMixins {
        friendState = 0;

        navList:any[] = [
            {title: '未入班', num: 0},
            {title: '已报班', num: 0},
        ]

        pageData:any = {
            invitesetting: {
                inviteMax: 0,

            },
            info: {
                rownum: 0,
                sumMoney: 0,
                userCount: 0
            },
            list: []
        };

        dataList:any = []; // 未报班数据源
        dataList1:any = []; // 已报班数据源

        mounted() {
            this.getData(1);
        }

        async getData(page: number) {
            this.getInviteNoLearn(page);
        }

        getInviteNoLearn(page:number) {
            PersonalModule.getInviteNoLearn(page).then((res:any) => {
                this.page = page;
                const data = res?.data || {};

                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(data.result);
                this.dataList.forEach((x:any) => {
                    x.create_time = x.create_time ? dayjs(x.create_time).format("YYYY-MM-DD") : '';
                })
                this.navList[0].num = this.dataList.length;

                this.handleRefresh(true, data.totalPage > data.pageNo);
            }).catch((err:string) => {
                // this.$toast(err);
                this.handleRefresh(false);
            });
        }

        getInviteLearn(page:number) {
            PersonalModule.getInviteLearn(page).then((res:any) => {
                this.page = page;
                const data = res?.data || {};

                if (this.page === 1) {
                    this.dataList1 = [];
                }
                this.dataList1 = this.dataList1.concat(data.result);
                this.dataList1.forEach((x:any) => {
                    x.create_time = x.create_time ? dayjs(x.create_time).format("YYYY-MM-DD") : '';
                    x.rTime = x.rTime ? dayjs(x.rTime).format("YYYY-MM-DD") : '';
                })
                this.navList[1].num = this.dataList1.length;


                this.handleRefresh(true, data.totalPage > data.pageNo);
            }).catch((err:string) => {
                // this.$toast(err);
                this.handleRefresh(false);
            });
        }

        onClick(name:any) {
            this.friendState = Number(name);
            if(this.friendState === 0) {
                this.getInviteNoLearn(1)
            } else {
                this.getInviteLearn(1)
            }
        }
    }
</script>

<style lang="scss">
    .pageBox{
    }
   .hbb-invite-box{
       display: flex;
       width: 100%;
       flex-direction: column;
       .con{
           display: flex;
           width: 100%;
           border-top: 2px solid #ddd;
           margin-top: 10px;
           ul{
               width: 100%;
               li{
                   display: flex;
                   width: 100%;
                   height: 100px;
                   align-items: center;
                   justify-content: space-between;
                   padding:0 30px;
                   border-bottom: 2px solid #ddd;
                   div{
                       h2{
                           color: #666;
                           font-size: 26px;
                           font-weight: normal;
                       }
                       p{
                           color: #999;
                           margin-top: 10px;
                           font-size: 24px;
                       }
                       span{
                           color: #666;
                           font-size: 24px;
                       }
                   }
               }
           }
       }
       img {
           width: 100%;
       }
           .van-tabs {
               width: 100%;
               margin-top: 10px;
               .van-tab {
                   width: 122px !important;
                   padding: 0 !important;
                   height: 60px !important;
                   font-size: 28px !important;
                   color: $base-font-color !important;
                   margin-right: 30px;

                   .van-tab__text--ellipsis {
                       overflow: inherit !important;
                       margin-bottom: 15px !important;
                   }

                   &.van-tab--active {
                       color: $color-main !important;
                   }
               }

               .van-tabs__line {
                   width: 100px !important;
                   height: 4px !important;
                   margin-top: 10px !important;
               }
           }

           .van-tabs__content {
               margin-top: 20px;
           }
   }

</style>
