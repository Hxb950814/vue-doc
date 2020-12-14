<template>
    <div class="pageBox">
        <div class="hbb-setting-top hbb-phone">
            <div class="title">
                绑定手机号
            </div>
            <div>
                <van-field type="number" style="width: 100%" v-model="mobileNum" placeholder="手机号" />
            </div>
            <div style="margin-top: 20px">
                <van-field style="width: 55%" maxlength="4" v-model="verifyCode" placeholder="请输入验证码" />
                <span>丨</span>
                <span @click="sendCode">{{code === 60 ? '获取验证码' : code + 's'}}</span>
            </div>
        </div>
        <div class="hbb-vanbutton" @click="sureClick">
            确定
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal";
    @Component({})
    export default class extends Vue {
        mobileNum = ''; // 手机号码
        verifyCode = ''; // 验证码
        code = 60; // 验证码倒计时
        timer = 0;// 定时器对象
        timeSet = 0; // 防抖函数

        sendCode() {
            if(this.code < 60) return false;
            let requestObj = {
                mobileNum: this.mobileNum
            }
            clearTimeout(this.timeSet);
            this.timeSet = setTimeout(() => {

                PersonalModule.sendCode(requestObj).then((res:any) => {
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

        sureClick() {
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
                mobileNum: this.mobileNum,
                verifyCode: this.verifyCode
            }
            PersonalModule.bindMobile(requestObj).then((res:any) => {
                this.$toast({
                    type: 'success',
                    message: '绑定成功'
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

    .hbb-setting-top{
        display: flex;
        width: 80%;
        margin: 60px auto;
        margin-top: 120px;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        .title{
            display: flex;
            width: 100%;
            font-size: 40px;
            color: #333;
            background: none;
            font-weight: bold;
            margin-bottom: 40px;
            padding: 0;
        }
        div {
            display: flex;
            width: 100%;
            height: 100px;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            border-radius: 50px;

            background-color: #f6f6f6;

            span {
                font-size: 30px;
                color: #333;
                display: flex;
                align-items: center;
                color: #999;
                &:nth-of-type(2){
                    margin-left: 40px;
                    color: #0a8dff;
                }
            }
        }
    }
    .hbb-tip{
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        color: $color-ff9600;
        margin-top: 40px;
        font-weight: bold;
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

</style>
