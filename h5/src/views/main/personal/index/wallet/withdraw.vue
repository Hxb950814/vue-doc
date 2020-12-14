<template>
    <div class="pageBox">
        <div class="hbb-wallet-page">
            <div class="top">
                <h2>{{bankNo}}</h2>
                <p>{{bankName}}</p>
            </div>
            <div class="hbb-ti">
                可提金额：{{balance | money}}
            </div>
            <div class="hbb-setting-top">
                <div style="margin-bottom: 10px">
                    <span style="width: 80px">提现金额</span>
                    <van-field style="width: 52%" maxlength="4" v-model="amount" placeholder="请输入" />
                    <span>丨</span>
                    <span :style="{color: '#0a8dff'}" style="width: 75px;justify-content: center;font-size: 12px" @click="allTi">全提</span>
                </div>
                <div>
                    <span style="width: 80px">手机号</span>
                    <van-field type="number" style="width:  calc(100% - 80px)" v-model="mobileNum" placeholder="手机号" />

                </div>
                <div>
                    <span style="width: 80px">验证码</span>
                    <van-field style="width: 50%" maxlength="4" v-model="verifyCode" placeholder="请输入验证码" />
                    <span>丨</span>
                    <span style="width: 75px;justify-content: center;font-size: 12px" :style="{color: code === 60 ? '#0a8dff' : '#666'}" @click="sendCode">{{code === 60 ? '获取验证码' : code + 's'}}</span>
                </div>
            </div>
            <div :class="amount > 0 ? 'hbb-vanbutton' : 'hbb-vanbutton hbb-vanbutton1'" @click="sureClick">
                确定
            </div>
            <div class="rule-box">
                <h2>
                    <span></span>
                    提现规则
                    <span></span>
                </h2>
                <div class="con">
                    <pre>{{description}}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import BannerSlide from "@components/banner/banner-slide.vue";
    import {PersonalModule} from "@/store/modules/user/personal";

    @Component({
        components:{
            BannerSlide
        }
    })
    export default class extends Vue {
        amount = ''; // 提现金额
        balance = ''; // 提现金额
        bankName = ''; // 银行名称
        bankNo = ''; // 银行号码
        mobileNum = ''; // 手机号码
        verifyCode = ''; // 验证码
        code = 60; // 验证码倒计时
        timer = 0;// 定时器对象
        description = ''; // 提现规则
        timeSet = 0; // 防抖函数


        mounted() {
            this.getDetail();
        }

        getDetail() {
            PersonalModule.getUserDetail().then((res:any) => {
                this.balance = res?.data?.user?.balance;
                this.mobileNum = res?.data?.user?.mobile;
                this.bankName = res?.data?.userDetail?.bankName;
                this.bankNo = res?.data?.userDetail?.bankNo;
                this.description = res?.data?.tip || '';
            })
        }

        sendCode() {
            if(!this.amount || this.amount === '0') {
                this.$toast('提现金额不足')
                return false;
            }
            if(!this.mobileNum) {
                this.$toast('手机号有误')
                return false;
            }
            if(this.code < 60) return false;
            let requestObj = {
                mobileNum: this.mobileNum
            }
            clearTimeout(this.timeSet);
            this.timeSet = setTimeout(() => {
                PersonalModule.sendSendCode(requestObj).then((res:any) => {
                    this.timer = setInterval(() => {
                        if(this.code <= 0) {
                            this.code = 60;
                            clearInterval(this.timer);
                            return false;
                        }
                        this.code--;
                    }, 1000)
                })
            }, 500)

        }

        allTi() {
            // 点击全部提现
            this.amount = this.balance;
        }

        sureClick() {
            if(!this.amount || this.amount === '0') {
                return false;
            }
            if(!this.mobileNum) {
                this.$toast('手机号有误')
                return false;
            }
            if(!this.verifyCode) {
                this.$toast('验证码有误')
                return false;
            }
            this.$toast({
                forbidClick: true,
                message: '提交中...'
            })
            let requestObj = {
                amount: this.amount,
                code: this.verifyCode
            }
            PersonalModule.toWithdraw(requestObj).then((res:any) => {
                this.$toast({
                    type: 'success',
                    message: '提现成功'
                });
                this.$router.back();
            }).catch((err:any) => {
                console.log(err)
                this.$toast(err)
            })
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background: #efefef;

    }
    .hbb-wallet-page{
        .top{
            display: flex;
            width: calc(100% - 60px);
            height: 200px;
            margin-left: 30px;
            margin-top: 30px;
            justify-content: flex-start;
            flex-direction: column;
            padding: 30px;
            border-radius: 12px;
            background: linear-gradient(to right, #0085ff 0%, #00afff 100%);
            h2{
                color: #fff;
                font-size: 48px;
                font-weight: normal;
                display: flex;
            }
            p{
                color: #fff;
                font-size: 28px;
                font-weight: bold;
                margin-top: 20px;
            }
        }
        .hbb-ti{
            display: flex;
            width: 100%;
            height: 80px;
            align-items: center;
            padding-left: 30px;
            font-size: 26px;
            color: #999;
        }
        .hbb-vanbutton{
            display: flex;
            width: 80% !important;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            color: #fff;
            margin: 40px auto;
        }
        .rule-box{
            display: flex;
            width: 100%;
            margin-top: 20px;
            flex-direction: column;
            h2{
                display: flex;
                width: 100%;
                margin: 10px 0;
                align-items: center;
                justify-content: center;
                span{
                    width: 60px;
                    height: 2px;
                    background: #ccc;
                    &:nth-of-type(1){
                        margin-right: 20px;
                    }
                    &:nth-of-type(2){
                        margin-left: 20px;
                    }
                }
            }
            .con{
                margin-top: 30px;
                display: flex;
                width: 100%;
                font-size: 28px;
                color: #666;
                padding: 0 30px;
                pre{
                    white-space:pre-wrap;
                    white-space:-moz-pre-wrap;
                    white-space:-o-pre-wrap;
                    word-wrap:break-word;
                    color: #666;
                }
            }
        }
        .hbb-setting-top{
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;
            div{
                display: flex;
                width: 100%;
                height: 110px;
                align-items: center;

                background-color: #fff;
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
    }
</style>
