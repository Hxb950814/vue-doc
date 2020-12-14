<template>
    <div>
        <div class="page-cap-title">
            奖励设置
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <div class="group">
                    <div class="title">
                        注册奖励
                    </div>
                    <div class="one one1">
                        <span class="b">积分</span>
                        <p>
                            <el-input v-model="minVal" placeholder="请输入积分范围" />
                            <span class="c" />
                            <el-input v-model="maxVal" placeholder="请输入积分范围" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-submit-line">
            <el-button @click="clickCancel">
                关闭
            </el-button>
            <el-button type="primary" @click="clickSave">
                保存
            </el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })

    export default class extends Mixins(commonTable) {
        minVal = ''; // 最小值
        maxVal = ''; // 最大值

        mounted() {

        }

        async clickSave() {
            // 取得详情
            this.$showLoading();
            const requestData = {
                maxScore: this.maxVal,
                minScore: this.minVal
            };
            const [err, resp] = await this.$postAsync('/registerSetting/updateRegisterSetting', requestData);
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '设置成功'
                });
                setTimeout(() => {
                    this.$router.back();
                }, 1000);
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        clickCancel() {
            this.$router.back();
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-page-top{
        display: flex;
        width: 100%;
        margin: 10px 0;
        flex-direction: column;
        .group{
            display: flex;
            width: 100%;
            flex-direction: column;
            padding: 40px;
            background: #F2F2F6;
            margin-bottom: 20px;
            .title{
                display: flex;
                width: 100%;
                margin-bottom: 20px;
                margin-top: -20px;
                font-size: 18px;
                color:#333;
                font-weight: bold;
                margin-left: -20px;

            }
            .one{
                display: flex;
                width: 100%;
                align-items: center;
                &.one1{
                    background: #fff;
                    padding: 30px;
                }
                p{
                    margin-left: 20px;
                    color: #666;
                    display: flex;
                    align-items: center;
                    .c{
                       display: flex;
                        width: 40px;
                        height: 1px;
                        background: #666;
                        margin: 0 10px;
                    }

                }
                .b{
                    display: flex;
                    width: 120px;
                }
                b{
                    display: flex;
                    margin-left: 10px;
                    padding: 3px 15px;
                    color: #43B3FF;
                    border: 1px solid #43B3FF;
                    border-radius: 10px;
                    background: #fff;
                }
               &:nth-of-type(1){
                   margin-bottom: 20px;
               }
            }
        }
    }
</style>
