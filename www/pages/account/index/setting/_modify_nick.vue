<!-- 修改昵称 -->
<template>
    <div class="modify-line">
        <el-input v-model.trim="value" type="text" value="2" placeholder="请设置昵称" maxlength="12"
                  style="width: 200px"
        />
        <a class="link-btn" style="margin-left: 10px" @click="sureModifyNick">确定</a>
        <a class="link-btn" @click="cancelModifyNick">取消</a>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import { postAsync } from '@/utils/request';

    @Component({
        components: {
        }
    })
    export default class ModifyNick extends Vue {
        @Prop({type: String, default: '', required: false})
        value!: string;

        nickNameModify = '';

        mounted() {
            this.nickNameModify = this.value;
        }

        sureModifyNick() {
            if (!this.nickNameModify) {
                this.$showToast('请输入昵称');
                return;
            }
            this.$showToast('暂时不支持修改昵称');
            // return;
            // this.$emit('save', 'newnmae');
        }

        cancelModifyNick() {
            // 隐藏
            this.$emit('cancel');
        }
    }
</script>

<style lang="scss" scoped>
    .modify-line{
        display: flex;
    }
    .link-btn{
        display: inline-block;
        width: 50px;
        margin-left: 10px;
        text-align: center;
        line-height: 40px;
    }
</style>
