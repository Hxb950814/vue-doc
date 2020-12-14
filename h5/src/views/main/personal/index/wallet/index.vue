<template>
    <div class="hbb-wallet-page">
        <div class="top">
            <h2><b @click="goRecord"></b>可用余额(元)</h2>
            <p>{{pageData && pageData.balance | money}}</p>
            <span @click="goWithdraw">提现</span>
        </div>
        <div class="hbb-setting-top">
            <div>
                <span><img src="@assets/images/dj.png" alt="" />冻结金额</span>
                <p style="padding-right: 15px">
                    <b>{{pageData && pageData.freeze | money}}</b>
                </p>

            </div>
            <div @click="goWalletRecord">
                <span><img src="@assets/images/tixian.png" alt="" />提现金额</span>
                <p>
                    <b>{{pageData && pageData.withdraw | money}}</b>
                    <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
                </p>

            </div>
            <div>
                <span><img src="@assets/images/xiaofei.png" alt="" />消费金额</span>
                <p>
                    <b>{{pageData && pageData.consume | money}}</b>
                    <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
                </p>

            </div>
        </div>
        <!--   轮播图部分     -->
            <div class="hbb-swiper-box" v-if="bannerList.length > 0">
                <BannerSlide
                        :dataList="bannerList"
                        class="slider"
                        mode="1"
                        :pagination="true"
                ></BannerSlide>
            </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import BannerSlide from "@components/banner/banner-slide.vue";
    import {PersonalModule} from "@/store/modules/user/personal";
    import {showToast} from "@/utils/ui";

    @Component({
        components:{
            BannerSlide
        }
    })
    export default class extends Vue {
        bannerList: any = []; // 轮播图的数据源

        pageData:any = {
            balance: 0, // 可用余额.
            consume: 0, // 消费金额.
            withdraw: 0, // 提现金额.
            freeze: 0, // 冻结余额.
        }

        mounted() {
            this.getDetail();
            PersonalModule.getWalletIcon().then((res:any) => {
                this.bannerList = res?.data?.iconAD || [];
            })
        }

        getDetail() {
            PersonalModule.getUserDetail().then((res:any) => {
                this.pageData.balance = res?.data?.user?.balance;
                this.pageData.consume = res?.data?.consume;
                this.pageData.withdraw = res?.data?.withdraw;
                this.pageData.freeze = res?.data?.user?.freeze;
            })
        }


        goWithdraw() {
            // 用户完善了信息  前往提现界面   则  前往填写个人信息的页面
            PersonalModule.isCanWithdraw().then((res:any) => {
                console.log(res)
                if (res?.code === '000000') {
                    this.$router.push({
                        path: '/personal/withdraw'
                    })
                }else if (res?.code === '300005'){
                    this.$toast('请完善个人信息');
                    setTimeout(() => {
                        this.$router.push({
                            path: '/personal/info'
                        })
                    }, 1000);
                } else {
                    showToast(res?.message)
                }
            })

        }
        goRecord() {
            this.$router.push({
                path: '/personal/wallet/record'
            })
        }
        goWalletRecord() {
            this.$router.push({
                path: '/personal/wallet/recording'
            })
        }
    }
</script>

<style lang="scss" scoped>
.hbb-wallet-page{
    .top{
        display: flex;
        width: 100%;
        height: 280px;
        justify-content: center;
        align-items: center;
        position: relative;
        flex-direction: column;
        background: linear-gradient(to right, rgb(0, 133, 255) 0%, rgb(0, 175, 255) 100%);
        h2{
            color: #fff;
            font-size: 26px;
            font-weight: normal;
            display: flex;
            b{
                width: 36px;
                height: 36px;
                display: flex;
                margin-right: 10px;
                background-color: #fff;
                -webkit-mask: url(../../../../../assets/images/qjilu.svg) center center / contain no-repeat;
            }
        }
        p{
            color: #fff;
            font-size: 72px;
            font-weight: bold;
            margin-top: 10px;
        }
        span{
            display: flex;
            border-radius: 8px;
            border: 2px solid #fff;
            width: 100px;
            height: 48px;
            font-size: 24px;
            color: #fff;
            position: absolute;
            top: 30px;
            align-items: center;
            justify-content: center;
            right: 30px;
        }
    }
    .hbb-setting-top{
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        div{
            display: flex;
            width: 100%;
            height: 110px;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            border-bottom: 2px solid #eee;
            span{
                font-size: 30px;
                color:#333;
                display: flex;
                align-items: center;
                img{
                    width: 44px;
                    height: 44px;
                    margin-right: 20px;
                }
            }
            p{
                display: flex;
                align-items: center;
            }

            b{
                color: $color-gray;
                font-size: 26px;
            }
        }
    }
    .hbb-swiper-box {
        display: flex;
        padding: 0 30px;
        margin-top: 30px;

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
