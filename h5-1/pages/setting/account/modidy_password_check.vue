<!--修改交易密码/登录密码 手机号验证检测-->
<template>
    <div>
        <tk-nav-bar>修改{{ typeStr }}密码</tk-nav-bar>

        <div class="container">
            <div class="tips">
                为了您的账号安全，您需要验证手机后才能修改密码，点击获取验证码，您将收到一条附有验证码的短信。
            </div>
            <div class="normal-input-filed">
                <van-field v-model="phoneMask" label="手机号" placeholder="请输入手机号" maxlength="11" type="text" disabled />
                <van-field v-model="code" label="验证码" placeholder="请输入验证码" maxlength="4" type="digit">
                    <template #button>
                        <div class="send-button" :class="'status' + codeBtnStatus" @click="clickSendCode">
                            <van-loading type="spinner" color="#999" />
                            <span class="text">
                                {{ codeBtnStatus === 0 ? '发送验证码' : timesCount + 's' }}
                            </span>
                        </div>
                    </template>
                </van-field>
            </div>
            <div class="theme-button-wrap">
                <div class="theme-button" @click="clickSure">
                    下一步
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import { formatPhone } from '@common/src/utils/format';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        components: {},
        asyncData(context) {
        }
    })
    export default class extends Vue {
        type='';
        typeStr='';
        phone='';
        phoneMask='';
        code = '';

        codeBtnStatus= 0; // 0 1 2 // 0=初始状态 1=请求中  2=请求成功，短信已发送
        inTimeCount = false;
        timesCount = 0;
        timeHandle = -1;

        mounted() {
            this.type = this.$route.query.type + '';
            if (this.type === 'login') {
                this.typeStr = '登录';
            } else if (this.type === 'trade') {
                this.typeStr = '交易';
            } else {
                this.$showToast('type 参数不正确,type:' + this.type);
            }
           this.getData();
        }

        async getData() {
            // console.log(+new Date());
            const [_, resp] = await postAsync('/user/queryUserMobileByUserId', {});

            if (resp?.code === '000000') {
                this.phone = resp?.data || '';
                this.phoneMask = formatPhone(resp?.data || '');
            }
        }

        async clickSendCode() {
            this.codeBtnStatus = 1;
            const [_, resp] = await postAsync('/user/sendCode', {
                mobileNum: this.phone
            });
            if (resp?.code === '000000') {
                this.$showToast('验证码已发送');
                this.codeBtnStatus = 2;

                this.inTimeCount = true;
                this.timesCount = 60 - 1;

                this.timeHandle = window.setInterval(() => {
                    this.timesCount--;
                    if (this.timesCount < 0) {
                        clearInterval(this.timeHandle);
                        this.inTimeCount = false;
                        this.codeBtnStatus = 0;
                    }
                }, 1000);
                // return;
            } else {
                this.codeBtnStatus = 0;
            }
        }

        async clickSure() {
            if (this.code === '') {
                this.$showToast('请输入验证码');
                return;
            }
            this.$showLoading('请求中...');
            const [_, resp] = await postAsync('/systemInstall/validateVerifyCode', {
                verifyCode: this.code
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                // this.$showToast(this.type === 'login' ? '' : '登录密码修改成功');
                if (this.type === 'login') {
                    this.$router.push('/setting/account/login_password?mode=set');
                } else if (this.type === 'trade') {
                    this.$router.push('/setting/account/trade_password?mode=modify');
                } else {
                    this.$closeLoading();
                    this.$showToast('type不正确');
                }
            } else {
                this.$showToast(resp?.message || '验证码错误');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .theme-button-wrap{
        padding-top: 30px;
        .theme-button{
            margin-top: 10px;
        }
    }
    .tips{
        color: #666;
        font-size: 28px;
        line-height: 1.6;
        padding: 30px 35px;
    }
    .send-button{
        line-height: 40px;
        width: 180px;
        padding: 5px 0;
        .text{
            font-size: 28px;
            color: #999;
        }
        .van-loading__spinner {
            height: 40px;
            width: 40px;
        }

        text-align: center;
        @include thinBorder('left');
        &.status0 {
            .van-loading__spinner {
                display: none;
            }

            .text {
                display: inline-block;
            }
        }

        &.status1 {
            pointer-events: none;

            .van-loading__spinner {
                display: inline-block;
            }

            .text {
                display: none;
            }
        }

        &.status2 {
            border-color: #bbb;
            cursor: not-allowed;
            pointer-events: none;

            .van-loading__spinner {
                display: none;
            }

            .text {
                color: #bbb;
                display: inline-block;
            }
        }
    }
</style>
