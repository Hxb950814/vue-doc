<!-- 登录页面 -->
<template>
    <div class="login-bg">
        <div class="login-section">
            <p class="logo-title">
                求知财堂管理系统
            </p>
            <div class="login-block">
                <div class="show-pic">
                    <img src="@assets/images/login_func.png" alt="">
                </div>
                <div class="input-section">
                    <div class="title">
                        用户登录
                    </div>
                    <el-form ref="dataForm" class="" :model="editData" :rules="dataRules">
                        <div class="input-line">
                            <span class="label">账号</span>
                            <el-form-item prop="username">
                                <el-input
                                    v-model.trim="editData.username"
                                    type="text"
                                    placeholder="请输入账号"
                                    class="input-text"
                                    autocomplete="false"
                                    maxlength="10"
                                    @keyup.enter.native="login"
                                />
                            </el-form-item>
                        </div>
                        <div class="input-line">
                            <span class="label">密码</span>
                            <el-form-item prop="password">
                                <el-input
                                    v-model.trim="editData.password"
                                    type="password"
                                    placeholder="请输入密码"
                                    class="input-password"
                                    autocomplete="false"
                                    maxlength="12"
                                    @keyup.enter.native="login"
                                />
                            </el-form-item>
                        </div>
                        <div class="input-line">
                            <span class="label">验证码</span>
                            <el-form-item prop="code">
                                <el-input
                                    v-model.trim="editData.code"
                                    placeholder="请输入验证码"
                                    type="text"
                                    class="input-code"
                                    maxlength="4"
                                    autocomplete="false"
                                    @keyup.enter.native="login"
                                />
                            </el-form-item>
                            <img class="code-img" :src="codeImgSrc || ''">
                            <a class="refresh-btn" @click="getCode">刷新</a>
                        </div>
                        <div
                            class="input-line"
                            style="margin-top: 10px
"
                        >
                            <span class="label" />
                            <a class="forget-password" @click="clickForgetPassword">忘记密码？</a>
                        </div>
                        <div>
                            <el-button class="login-btn" type="primary" :loading="isLogin" @click="login">
                                {{ isLogin? '登录中' : '登录' }}
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';

    let codeTimeHandle = -1;

    @Component({})
    export default class Login extends Vue {
        editData = {
            username: '', // 用户名
            password: '', // 验证码
            code: '' // code
        };

        codeImgSrc = ''; // 图片验证码地址
        randomKey = ''; // code的key
        isLogin = false; // 是否登录中

        dataRules: any = {
            username: [{required: true, message: '请输入账号', trigger: 'blur'}],
            password: [{required: true, message: '请输入密码', trigger: 'blur'}],
            code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
        };

        mounted() {
           this.timeForGetCode();
        }

        beforeDestroy() {
            clearInterval(codeTimeHandle);
            codeTimeHandle = -1;
        }

        timeForGetCode() {
            if (codeTimeHandle) {
                clearInterval(codeTimeHandle);
            }
            codeTimeHandle = setInterval(() => {
                this.getCode();
            }, 1000 * 60);
            this.getCode();
        }

        /* 获取图片验证码 */
        async getCode() {
            const [_, resp] = await this.$getAsync('/admin/randomCode', {}, {responseType: 'arraybuffer'});
            if (resp) {
                // @ts-ignore
                this.randomKey = resp?.headers?.randomrandkey;
                this.codeImgSrc = 'data:image/png;base64,' + btoa(
                    new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
            }
        }

        login() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.doLogin();
                }
            });
        }

        async doLogin() {
            this.isLogin = true;
            const startTime = Date.now();
            // 1.登录
            const [err, resp] = await this.$postAsync('/admin/login', {
                name: this.editData.username,
                password: this.editData.password,
                randomCode: this.editData.code,
                randomRandKey: this.randomKey
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.$store.dispatch('setToken', {token: resp.data.token});
                this.$store.dispatch('setUserName', {userName: resp.data.showName});
                this.$store.dispatch('setAccount', {account: this.editData.username});
            } else if (resp?.message) {
                this.$showToast(resp.message);
                this.loginFailed(startTime);
                return;
            } else {
                this.$showToast('请求失败');
                this.loginFailed(startTime);
                return;
            }
            //
            // 2.请求权限接口
            const [err2, resp2] = await this.$postAsync('/menu/getAllAuthCode', {});
            if (resp2?.code === '000000') {
                // 获取权限列表成功, 保存权限列表
                let list = resp2.data;
                if (!list) {
                    list = [];
                }
                const permissionList = list.map((item: any) => {
                    return String(item);
                });
                this.$store.dispatch('setPermissionList', {permissionList});
                this.loginSuccess(startTime);
            } else if (resp2?.message) {
                this.loginFailed(startTime);
                this.$showToast(resp2.message);
            } else {
                this.loginFailed(startTime);
                this.$showToast('权限请求失败');
            }
        }

        loginFailed(startTime: number) {
            const now = Date.now();
            setTimeout(() => {
                this.isLogin = false;
                // 刷新code
                this.timeForGetCode();
            }, Math.max(300, 300 - (now - startTime)));
        }

        loginSuccess(startTime: number) {
            this.$showToast('登录成功');
            setTimeout(() => {
                this.isLogin = false;
                this.$router.push({
                    path: '/welcome'
                });
            }, 200);
        }

        clickForgetPassword() {
            this.$showToast('请联系管理员重置密码');
        }
    }
</script>

<style lang="scss" scoped>
    .login-bg {
        width: 100%;
        height: 100%;
        background: #4e9fe1 url($img-path + 'images/login_bg.png') center top no-repeat;
        overflow: hidden;
    }

    .login-section {
        padding-top: 160px;

        .logo-title {
            text-align: center;
            color: #005ccb;
            font-size: 34px;
            font-weight: bold;
        }
    }

    .login-block {
        width: 1100px;
        background: #fff;
        border-radius: 5px;
        margin: 30px auto 0;
        display: flex;
        padding: 80px 40px;

        .el-form-item {
            display: inline-block;
        }

        .show-pic {
            margin-right: 120px;
            margin-left: 80px;
            padding-top: 35px;

            img {
                width: 360px;
                height: 320px;
            }
        }

        .input-section {
            box-shadow: rgb(203, 203, 203) 0 0 6px;
            padding: 0 25px 30px;
            border-radius: 5px;
            width: 370px;

            .title {
                text-align: center;
                font-size: 16px;
                line-height: 50px;
                border-bottom: 1px solid #ccc;
            }

            .input-line {
                margin-top: 20px;

                &:nth-child(1) {
                    margin-top: 30px;
                }

                .label {
                    width: 50px;
                    display: inline-block;
                    margin-right: 10px;
                    text-align: right;
                    font-size: 14px;
                }

                .forget-password{
                    font-size: 14px;
                    color: $theme-font-color;
                    cursor: pointer;
                    user-select: none;
                }

                .input-text,
                .input-password {
                    width: 260px;
                }

                .input-code {
                    width: 140px;
                }

                .code-img {
                    width: 70px;
                    height: 42px;
                    display: inline-block;
                    margin: 0 10px;
                }

                .refresh-btn {
                    display: inline-block;
                    color: #1a7ef8;
                    font-size: 14px;
                    line-height: 42px;
                    cursor: pointer;
                    user-select: none;
                }
            }
        }

        .login-btn {
            width: 220px;
            height: 44px;
            margin-left: 60px;
            margin-top: 20px;
        }
    }

    /deep/ .input-password.el-input,
    /deep/ .input-code.el-input,
    /deep/ .input-text.el-input {
        height: 42px;

        .el-input__inner {
            border-color: #ccc;
            line-height: 42px;
            height: 42px;
            border-radius: 4px;
            padding-left: 14px;
            padding-right: 14px;
            font-size: 15px;
        }
    }
</style>
