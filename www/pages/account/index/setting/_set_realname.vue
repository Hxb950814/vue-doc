<!-- 实名信息 -->
<template>
    <div class="modify-form">
        <div>
            <el-input v-model.trim="name" type="text" value="2" placeholder="您的姓名"
                      maxlength="4" style="width: 250px"
            />
        </div>
        <div>
            <el-input v-model.trim="idcard" type="text" value="2" placeholder="您的身份证号" maxlength="18"
                      style="width: 250px" />
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
    import {isIdNumber} from '@common/src/utils/validate';
    import {postAsync} from '@/utils/request';

    @Component({
        components: {}
    })
    export default class SetRealName extends Vue {
        name = '';
        idcard = '';

        mounted() {
        }

        async sureModifyInfo() {
            if (!this.name) {
                this.$showToast('请输入您的姓名');
                return;
            }
            if (!this.idcard) {
                this.$showToast('请输入身份证号');
                return;
            }
            if (!isIdNumber(this.idcard)) {
                this.$showToast('请输入正确的身份证号');
                return;
            }
            const [err, resp] = await postAsync('/systemInstall/addOrUpdateRealNameInfo', {
                idNumber: this.idcard,
                realName: this.name
            });
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                this.$emit('set');
            } else {
                this.$showToast('修改失败');
            }
        }

        clickCancel() {
            this.$emit('hide');
        }
    }
</script>

<style lang="scss" scoped>
    .modify-line {
    }

    .link-btn {
        display: inline-block;
        width: 50px;
        margin-left: 10px;
        text-align: center;
        line-height: 40px;
    }

    .modify-form {
        > div {
            margin-bottom: 10px;
        }
    }

    .msgcode {
        cursor: pointer;
        border: 1px solid #eaeaea;
        display: inline-block;
        width: 100px;
        height: 40px;
        border-radius: 4px;
        background-color: #ff0;
    }
</style>
