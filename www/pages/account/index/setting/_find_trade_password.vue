<!-- 找回密码 -->
<template>
    <div class="modify-form">
        <div>
            <label class="label">手机号：</label>
            {{ mobile | mobileMask }}
        </div>
        <div>
            <label class="label">图形验证码：</label>
            <el-input v-model.trim="picCode" type="text" value="" placeholder="请输入"
                      maxlength="4" style="width: 145px"
            />
            <img :src="codeImgSrc" alt="" class="msgcode" @click="getMsgCode">
        </div>
        <div>
            <label class="label">手机验证码：</label>
            <el-input v-model.trim="phoneCode" type="text" value=""
                      placeholder="请输入" maxlength="4" style="width: 145px"
            />
            <el-button type="default" style="width: 100px" @click="getPhoneCode" :disabled="codeBtnStatus !== 0">
                {{ codeBtnStatus === 0 ? '获取' : codeBtnStatus === 1 ? '获取中' : timesCount + 's' }}
            </el-button>
        </div>
        <div>
            <label class="label">设置新密码：</label>
            <el-input v-model.trim="newpass" type="password" value=""
                      placeholder="请输入6位数字" maxlength="6" style="width: 250px"
            />
        </div>
        <div>
            <label class="label">确认密码：</label>
            <el-input v-model.trim="newpass2" type="password" value=""
                      placeholder="请再次输入您的密码" maxlength="6" style="width: 250px"
            />
        </div>
        <div style="padding-left: 105px">
            <el-button style="width: 120px" type="primary" @click="sureModifyInfo">
                确定
            </el-button>
            <el-button style="width: 120px;margin-left: 5px" type="default" @click="clickCancel">
                取消
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import { isIdNumber, isInteger } from '@common/src/utils/validate';
    import {Getter} from 'vuex-class';
    import { getAsync, postAsync } from '@/utils/request';

    @Component({
        components: {
        }
    })
    export default class ModifyTradePassword extends Vue {
        @Prop({type: String})
        mobile!: string;

        picCode = ''; // 图片验证码
        phoneCode = ''; // 手机验证码
        newpass = ''; // 新密码
        newpass2 = ''; // 确认密码

        randomKey = '';
        codeImgSrc = '';
        codeTimeHandle = -1;

        codeBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中  2=请求成功，短信已发送
        loginBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中 2=请求成功，登录结果已返回

        msgCodeText = '获取'; //

        @Getter('userPhone')
        userPhone!: string;

        inTimeCount = false;
        timesCount = 0;
        timeHandle = -1;

        mounted() {
            // console.log(this.phone);
            this.getMsgCode();
        }

        beforeDestroy() {
            clearInterval(this.codeTimeHandle);
            this.codeTimeHandle = -1;
        }

        async getMsgCode() {
            if (this.codeTimeHandle) {
                clearInterval(this.codeTimeHandle);
            }
            const [_, resp] = await getAsync('/user/randomCode', {}, {responseType: 'arraybuffer'});
            if (resp) {
                // @ts-ignore
                this.randomKey = resp?.headers?.randomrandkey;
                this.codeImgSrc = 'data:image/png;base64,' + btoa(
                    new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
            }
            // this.codeTimeHandle = window.setTimeout(() => {
            //     this.getMsgCode();
            // }, 1000 * 10);
        }

        async getPhoneCode() {
            if (!this.picCode) {
                this.$showToast('请输入图形验证码');
                return;
            }
            // 登录 注册
            this.codeBtnStatus = 1; // 变成获取中
            const [_, resp] = await postAsync('/systemInstall/sendCodeFindPwd', {
                mobileNum: this.mobile,
                randomRandKey: this.randomKey,
                imgCode: this.picCode
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

        async sureModifyInfo() {
            if (!this.picCode) {
                this.$showToast('请输入图形验证码');
                return;
            }
            if (!isInteger(this.picCode)) {
                this.$showToast('图形验证码必须是数字格式');
                return;
            }
            if (!this.phoneCode) {
                this.$showToast('请输入手机验证码');
                return;
            }
            if (!this.newpass) {
                this.$showToast('请输入6位数字密码');
                return;
            }
            if (!isInteger(this.newpass)) {
                this.$showToast('新密码必须是数字格式');
                return;
            }
            if (!this.newpass2) {
                this.$showToast('请再次输入6位数字密码');
                return;
            }
            if (!isInteger(this.newpass)) {
                this.$showToast('确认密码必须是数字格式');
                return;
            }
            if (this.newpass !== this.newpass2) {
                this.$showToast('两次密码输入不一致');
                return;
            }
            this.$showLoading();
            const [err, resp] = await postAsync('/systemInstall/findPassword', {
                confirmPassword: this.newpass,
                newPassword: this.newpass2,
                randomRandKey: this.randomKey,
                imgCode: this.picCode,
                code: this.phoneCode,
                type: 2
            });
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                this.$emit('hide');
            } else {
                this.$showToast(resp?.message || '修改失败');
            }
            this.$closeLoading();
        }

        clickCancel() {
            this.$emit('hide');
        }
    }
</script>

<style lang="scss" scoped>
    .modify-form{
        .label{
            display: inline-block;
            width: 100px;
            text-align: right;
        }
    }
    .link-btn{
        display: inline-block;
        width: 50px;
        margin-left: 10px;
        text-align: center;
        line-height: 40px;
    }
    .modify-form{
        >div{
            margin-bottom: 10px;
        }
    }
    .msgcode{
        cursor: pointer;
        border: 1px solid #eaeaea;
        display: inline-block;
        width: 100px;
        height: 40px;
        border-radius: 4px;
    }
</style>
