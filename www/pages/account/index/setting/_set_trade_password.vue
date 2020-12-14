<!-- 设置交易密码 -->
<template>
    <div class="modify-form">
        <div>
            <el-input v-model.trim="newpass" type="password" value=""
                      placeholder="请输入6位数字密码" maxlength="6" style="width: 250px"
            />
        </div>
        <div>
            <el-input v-model.trim="newpass2" type="password" value=""
                      placeholder="请再次输入" maxlength="6" style="width: 250px"
            />
        </div>
        <div>
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
    import { postAsync } from '@/utils/request';

    @Component({
        components: {
        }
    })
    export default class SetTradePassword extends Vue {
        newpass = '';
        newpass2 = '';

        mounted() {
        }

        async getData() {
        }

        async sureModifyInfo() {
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
            const [err, resp] = await postAsync('/systemInstall/addOrUpdatePassword', {
                confirmPassword: this.newpass,
                newPassword: this.newpass2,
                type: 2
            });
            if (resp?.code === '000000') {
                this.$showToast('设置成功');
                this.$emit('set');
            } else {
                this.$showToast(resp?.message || '设置失败');
                // this.$showToast(this.mode === '1' ? '修改失败' : '保存失败');
            }
            this.$closeLoading();
        }

        clickCancel() {
            this.$emit('hide');
        }
    }
</script>

<style lang="scss" scoped>
    .modify-line{
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
        background-color: #ff0;
    }
</style>
