<template>
    <div class="conatiner">
        <div class="login-window">
            <img src="https://rs.tanxingk.com/images/logo.png" alt="logo" class="logo">
            <div class="login-input-form">
                <ol>
                    <li class="input-line">
                        <div class="bg">
                            <label class="input-label" for="phone">手机号</label>
                            <input id="phone" v-model.trim="phone" type="tel" placeholder="请输入" autocomplete="off"
                                   maxlength="11"
                            >
                        </div>
                    </li>
                    <li v-if="loginType === 1" class="input-line">
                        <div class="bg">
                            <label class="input-label" for="password">密码</label>
                            <input id="password" v-model.trim="password" type="password" placeholder="请输入"
                                   autocomplete="off" maxlength="12"
                            >
                        </div>
                    </li>
                    <li v-if="loginType === 2" class="input-line code-line">
                        <div class="bg">
                            <label class="input-label" for="code">验证码 </label>
                            <input id="code" v-model.trim="code" type="tel" placeholder="请输入" maxlength="4">
                        </div>
                        <button type="button" class="msg-code-btn" :class="'status' + codeBtnStatus" value="获取"
                                autocomplete="off" @click="getCode"
                        >
                            <van-loading type="spinner" color="#ff4338" />
                            <span class="text">
                                {{ codeBtnStatus === 0 ? '获取' : timesCount + 's' }}
                            </span>
                        </button>
                    </li>
                </ol>

                <van-button type="primary" @click.stop="login">
                    {{ loginBtnStatus === 0 ? (loginType === 1 ? '登录' : '登录/注册') : '登录中' }}
                </van-button>

                <div class="switch-line">
                    <a v-if="loginType === 1" class="switch" @click="changeLoginType(2)">切换为<span>验证码登录</span></a>
                    <a v-else class="switch" @click="changeLoginType(1)">切换为<span>密码登录</span></a>
                </div>
            </div>

            <div class="rules-line">
                <nuxt-link class="rule" to="/agreement/user">
                    《弹性K线APP软件许可及服务协议》
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Cookie from 'js-cookie';
    import {isMobile} from '@common/src/utils/validate';
    import {postAsync} from '@/utils/request';

    @Component({
        components: {}
    })
    export default class extends Vue {
        phone = ''; // 手机号
        password = ''; // 密码
        code = ''; // 验证码
        loginType = 2; // 登录方式 1=密码登录 2=验证码登录 默认验证码登录
        inTimeCount = false;
        timesCount = 0;
        timeHandle = -1;

        codeBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中  2=请求成功，短信已发送
        loginBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中 2=请求成功，登录结果已返回

        mounted() {
            // 参数列表：
            /*
            *   delkey 有值表示删除cookie里面的token
            *   phone 有值表示填充phone字段
            *   to 有值登录成功跳转到指定页面
            * */
            if (this.$route.query.delkey) { // 1是服务端跳转  2是客户端跳转
                // 删除token(强制退出)
                Cookie.remove('token', {
                    path: '/'
                });
            }
        }

        beforeDestroyed() {
            if (this.timeHandle >= 0) {
                clearInterval(this.timeHandle);
            }
        }

        clickLogin() {
            if (this.phone === '') {
                this.$showToast('请输入手机号');
                return -1;
            }
            if (!isMobile(this.phone)) {
                this.$showToast('请输入正确手机号');
                return -1;
            }
            if (this.loginType === 1) {
                if (this.password === '') {
                    this.$showToast('请输入密码');
                    return -1;
                }
            } else if (this.code === '') {
                this.$showToast('请输入验证码');
                return -1;
            }
            return 1;
        }

        /* 登录 */
        async login() {
            if (this.clickLogin() < 0) {
                return;
            }
            const data: any = {
                mobileNum: this.phone,
                type: 0
            };
            if (this.loginType === 1) { // 密码登录
                data.password = this.password;
            } else { // 验证码登录
                data.verifyCode = this.code;
            }
            this.loginBtnStatus = 1;
            const [_, resp] = await postAsync('/user/userRegister', data);
            this.loginBtnStatus = 0;
            if (resp?.code === '000000') {
                this.$showToast('登录成功');
                // 保存下token和phone
                Cookie.set('token', resp.data, {
                    expires: 30,
                    path: '/'
                });
                // 2秒后跳转到新页面
                window.setTimeout(() => {
                    if (this.$route.query.to) {
                        this.$router.replace(this.$route.query.to + ''); // 回调
                    } else {
                        this.$router.replace('/my');
                    }
                }, 200);
            } else {
                this.$showToast(resp?.message || '登录失败');
            }
        }

        async changeLoginType(num: number) {
            if (num === 1) { // 切换密码登录模式
                if (this.phone === '') {
                    this.$showToast('请输入手机号');
                    return;
                }
                if (!isMobile(this.phone)) {
                    this.$showToast('请输入正确的手机号');
                    return;
                }
                const [_, resp] = await postAsync('/user/userPasswordLogin', {
                    mobileNum: this.phone
                });
                if (resp?.code === '000000') {
                    this.loginType = num;
                } else {
                    this.$showToast(resp?.message || '切换失败');
                }
            }
            this.loginType = num;
        }

        async getCode() {
            if (!this.phone) {
                this.$showToast('请输入手机号');
                return;
            }
            if (!isMobile(this.phone)) {
                this.$showToast('请输入正确的手机号');
                return;
            }
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
                this.$showToast(resp?.message || '发送失败');
                this.codeBtnStatus = 0;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .conatiner {
        min-height: 100vh;
        background-color: #fff;
        padding: 1PX 0;
    }

    .login-window {
        text-align: center;
        margin: 0 55px;
    }

    .login-input-form {
        .input-line {
            width: 100%;

            .bg {
                width: 100%;
                background-color: #F2F2F2;
                text-align: left;
                padding: 22px 30px;
                border-radius: 6px;
            }

            margin: 20px 0;
            display: flex;
            justify-content: space-between;

            &.code-line {
                .bg {
                    width: auto;
                    margin-right: 50px;

                    input {
                        width: 180px;
                    }
                }
            }
        }

        .input-label {
            display: inline-block;
            font-size: 32px;
            width: 100px;
            color: #666;
            margin-right: 60px;
        }

        input[type=text],
        input[type=tel],
        input[type=password] {
            appearance: none;
            background-color: #F2F2F2;
            border: none;
            color: #666;
            padding: 0;
            width: 300px;
            line-height: 34px;
            font-size: 32px;
        }

        .msg-code-btn {
            width: 160px;
            appearance: none;
            background-color: #fff;
            border: 1PX solid #FF4338;
            color: #ff4338;
            border-radius: 6px;
            font-size: 32px;

            .van-loading__spinner {
                height: 40px;
                width: 40px;
            }

            .text {
                font-size: 32px;
                color: #ff4338;
            }

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
    }

    .logo {
        width: 260px;
        height: 260px;
        margin-top: 100px;
        margin-bottom: 70px;
    }

    .login-btn {
        appearance: none;
        border: none;
        width: 100%;
        height: 90px;
        line-height: 90px;
        color: #fff;
        background-color: #FF4338;
        border-radius: 6px;
        margin-top: 80px;
        font-size: 32px;
    }

    .switch-line {
        display: flex;
        justify-content: flex-end;

        .switch {
            color: #666;
            margin-top: 32px;
            font-size: 26px;
            padding: 10px;

            > span {
                color: #FF4338;
                font-size: 26px;
            }
        }
    }

    .rules-line {
        display: flex;
        justify-content: center;
        margin-top: 150px;
        margin-bottom: 100px;

        .rule {
            font-size: 26px;
            color: #FF4338;
            padding: 10px; // 扩大点击面积
        }
    }
</style>
