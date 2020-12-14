<!-- 修改电话 -->
<template>
    <div class="modify-form">
        <div>原手机号：{{ phone }}</div>
        <div>
            <el-input v-model.trim="picCode1" type="text" value="2" placeholder="图形验证码 "
                      maxlength="4" style="width: 200px" />
            <img class="msgcode">
        </div>
        <div>
            <el-input v-model.trim="msgCode1" type="text" value="2" placeholder="短信验证码 " maxlength="4" style="width: 200px" />
            <button style="width: 100px" @click="getMsg1">
                获取
            </button>
        </div>
        <div>新手机号</div>
        <div>
            <el-input v-model.trim="newPhone" type="text" value="2"
                      style="width: 200px" placeholder="请输入新手机号 " maxlength="11" />
        </div>
        <div>
            <el-input v-model.trim="picCode2" type="text" value="2" placeholder="图形验证码 " maxlength="4" style="width: 200px" />
            <img class="msgcode">
        </div>
        <div>
            <el-input v-model.trim="msgCode2" type="text" value="2" placeholder="短信验证码 " style="width: 200px" maxlength="4" />
            <el-button style="width: 100px" @click="getMsg2">
                获取
            </el-button>
        </div>
        <div>
            <el-button style="width: 140px" type="primary">
                确定
            </el-button>
            <el-button style="width: 140px;margin-left: 20px" type="default" @click="clickCancel">
                取消
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import { postAsync } from '@/utils/request';

    @Component({
        components: {
        }
    })
    export default class ModifyPhone extends Vue {
        @Prop({type: String, default: '', required: false})
        value!: string;

        phone = '';
        picCode1 = '';
        msgCode1 = '';
        newPhone = '';
        picCode2 = '';
        msgCode2 = '';

        mounted() {
            this.phone = this.value;
        }

        getMsg1() {

        }

        getMsg2() {

        }

        sureModifyNick() {
            if (!this.phone) {
                this.$showToast('请输入昵称');
                return;
            }
            this.$emit('save', 'newnmae');
        }

        clickCancel() {
            // 隐藏
            this.$emit('cancel');
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
