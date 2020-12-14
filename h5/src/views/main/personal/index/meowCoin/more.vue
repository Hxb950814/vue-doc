<template>
    <div class="hbb-meowCoin-page">
        <div class="imgTop">
            <img width='100%' src="@assets/images/shopbg.png" alt="">
            <div>
                <h2>积分商城</h2>
                <p>我的积分：<b>{{pointBalance}}</b></p>
            </div>
            <div class="b" @click="goOrder">
                <h3><b class="tu"></b>兑换订单</h3>
            </div>
        </div>

        <div class="hbb-con">
             <!--   轮播图部分     -->
            <div class="hbb-swiper-box" v-if="bannerList.length > 0">
                <BannerSlide
                        :dataList="bannerList"
                        class="slider"
                        mode="1"
                        :pagination="true"
                ></BannerSlide>
            </div>
            <h2>优惠券</h2>
            <ul v-if="listxn.length > 0">
                <template v-for="(item, index) in listxn" >
                   <li :key='index' @click="goPage(item)" class="yhq">
                        <div class="t" v-if="item.goodsImage">
                            <img :src="item.goodsImage" alt="">
                        </div>
                       <div class="t" v-else>
                           <p><span>{{item.amount}}</span>元</p>
                           <p style="display: flex;align-items: center">
                               <span class="line"></span>
                               <b>优惠券</b>
                               <span class="line"></span>
                           </p>
                       </div>
                        <div class="b">
                            <p>{{item.goodsName}}</p>
                            <div class="b-b">
                                <div class="b-b-l">
                                    <b></b>
                                    <span>{{item.goodsScore}}</span>
                                </div>
                                <div :class="item.goodsRemain === 0  ? 'b-b-r  b-b-r1' : 'b-b-r'">
                                    兑换
                                </div>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
            <div class="hbb-noData" v-else>
                暂无优惠券
            </div>
            <h2>实物</h2>
            <ul v-if="listsw.length > 0">
                <template v-for="(item, index) in listsw" >
                    <li :key='index' @click="goPage(item)" :class="{
                       kecW: !item.goodsImage,

                   }">
                        <div class="t">
                            <img v-if="item.goodsImage" :src="item.goodsImage" alt="">
                        </div>
                        <div class="b">
                            <p>{{item.goodsName}}</p>
                            <div class="b-b">
                                <div class="b-b-l">
                                    <b></b>
                                    <span>{{item.goodsScore}}</span>
                                </div>
                                <div :class="item.goodsRemain === 0  ? 'b-b-r  b-b-r1' : 'b-b-r'">
                                    兑换
                                </div>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
            <div class="hbb-noData"  v-else>
                暂无实物
            </div>
        </div>
    </div>
</template>

<script lang="ts">
   import {Component, Vue} from 'vue-property-decorator';
   import BannerSlide from "@components/banner/banner-slide.vue";
   import { PersonalModule } from '@/store/modules/user/personal.ts';

    @Component({
        components:{
            BannerSlide
        }
    })
    export default class extends Vue {
        pointBalance:number = 0; // 我的积分
        bannerList: any = []; // 轮播图的数据源

        listxn:any[] = []; // 兑换的实物
        listsw:any[] = []; // 兑换的虚拟


        mounted() {
            this.getPointBalance();
            this.getShopGoodSlist();
            this.getShopBannerList();
        }

        getPointBalance() {
            // 获取我的积分
            PersonalModule.getScoreByUserId().then((res:any) => {
                this.pointBalance = res?.data?.pointBalance || 0;
            })
        }

        getShopGoodSlist() {
            // 获取商场商品信息
            PersonalModule.getShopGoodSlist().then((res:any) => {
                console.log(res)
                this.listsw = res?.data?.listsw || [];
                this.listxn = res?.data?.listxn || [];
            })
        }

        getShopBannerList() {
            // 获取商场banner信息
            PersonalModule.getShopBannerList().then((res:any) => {
                this.bannerList = res?.data || [];
            })
        }

        goPage(item:any) {
            if(item.goodsRemain === 0) {
                return false;
            }
            this.$router.push({
                path: '/personal/exchange',
                query: {
                    id: item.goodsId
                }
            })
        }

        goOrder() {
            this.$router.push({
                path: '/personal/exchangeOrder'
            })
        }


    }
</script>

<style lang="scss" scoped>
.hbb-meowCoin-page{
    .imgTop{
        display: flex;
        width: 100%;
        height:220px;
        position: relative;
        div{
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 5;
            display: flex;
            flex-direction: column;
            padding-left: 30px;
            h2{
                margin-top: 40px;
                font-size: 60px;
                color: #fff;
            }
            &.b{
                display: flex ;
                width: 188px;
                position: fixed;
                height: 56px;
                z-index: 6;
                top: 20px;
                right: 0;
                align-items: center;
                border-radius: 40px 0px 0px 40px;
                h3{
                    width: 100%;
                    margin-top: 10px;
                    font-size: 24px;
                    color: #666;
                }
                background-color: #fff2c6b3;
            }

            p{
                font-size: 30px;
                color: #fff;

                span{
                    &.line{
                        display: flex;
                        width: 24px;
                        height: 2px;
                        background: #844a30;
                        margin-right: 10px;
                        &:nth-of-type(1){
                            margin-right: 10px;
                        }
                        &:nth-of-type(2){
                            margin-left: 10px;
                        }
                    }
                }
            }
            .tu{
                width: 36px;
                height: 36px;
                display: flex;
                float: left;
                margin-right: 10px;
                background-color: #ff2c27;
                -webkit-mask: url(../../../../../assets/images/qjilu.svg) center center / contain no-repeat;
            }
        }
    }
    .hbb-con{
        display: flex;
        width: 100%;
        margin: 40px 0;
        flex-direction: column;
        padding: 0 30px;

        h2{
            display: flex;
            width: 100%;
            margin:20px 0;
        }
        ul{

            width: 100%;
           li{
               width: 330px;
               border: 2px solid #eee;
               float: left;
               margin-bottom: 16px;
               &:nth-child(2n){
                   float: right;
               }
               .t{
                   display: flex;
                   width: 100%;
                   height: 330px;
                   justify-content: center;
                   align-items: center;
                   flex-direction: column;
                   font-size: 22px;
                   background-repeat: no-repeat;
                   background-position: center center;
                   background-size: cover;
                   img{
                       width: 100%;
                       height: 100%;
                   }
                   span{
                       font-weight: bold;
                       font-size: 72px;
                       color: #844a30;
                       &.line{
                           display: flex;
                           width: 24px;
                           height: 2px;
                           background: #844a30;
                       }
                   }
               }
               &.yhq{
                   .t{
                       background-image: url(../../../../../assets/images/shopyhqbg.jpg);
                   }
               }
               &.kec{
                   .t{
                       background-image: url(../../../../../assets/images/shop1.jpg);
                   }
               }
               &.kecW{
                   .t{
                       background-image: url(../../../../../assets/images/shopdefault.png);
                   }
               }
               p{
                   b{
                       letter-spacing: 2px;
                       font-size: 24px;
                       margin:0 5px
                   }
               }

               .b{
                   display: flex;
                   width: 100%;
                   background: #F6F6F6;
                   justify-content: center;
                   font-size: 24px;
                   padding: 15px;
                   color: rgb(102, 102, 102);
                   flex-direction: column;
                   p{
                       color:#333;
                       font-size: 28px;
                   }
                   .b-b{
                       display: flex;
                       justify-content: space-between;
                       align-items: center;
                       margin-top: 10px;
                       .b-b-l{
                           display: flex;
                           color: #ff2c27;
                           font-size: 26px;
                           b{
                               display: flex;
                               width: 24px;
                               margin-right: 10px;
                               height: 24px;
                               background-color: #ff2c27;
                               -webkit-mask: url(../../../../../assets/images/shopv.svg) center center / contain no-repeat;
                           }

                       }
                       .b-b-r{
                           width: 100px;
                           height: 40px;
                           font-size: 24px;
                           line-height: 42px;
                           text-align: center;
                           color: #fff;
                           background: linear-gradient(to right, #ff7a8a 0%, #ff5a62 100%);
                           border-radius: 30px;
                           &.b-b-r1{
                               background: linear-gradient(to right, #ddd 0%, #bbb 100%);
                           }
                       }
                   }
               }
               &:nth-of-type(3n){
                   margin-right: 0
               }
           }
        }
        .more{
            display: flex;
            width: 100%;
            margin-top: 30px;
            justify-content: center;
            font-size: 26px;
            color: #666;
        }
    }
    .hbb-swiper-box {
        display: flex;
        width: 100%;
        height: 140px;

        .slider {
            height: 100%;
              border-radius: 10px;
            overflow: hidden;
            width: 100%;
        }
    }
}
</style>
