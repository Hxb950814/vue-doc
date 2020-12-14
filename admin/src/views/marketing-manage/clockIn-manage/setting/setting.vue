
<template>
    <div>
        <div class="page-cap-title">
            打卡规则
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <div class="group">
                    <div class="title">
                        打卡随机奖励
                    </div>
                    <div class="one one1">
                        <span class="b">积分</span>
                        <p style="display: flex;align-items: center;">
                            <el-input style="width: 100px;margin-right: 20px" type="number" v-model="pageData.minScore" />
                            <span style="width: 15px;height:1px;background: #ddd"></span>
                            <el-input style="width: 100px;margin-left: 20px" type="number" v-model="pageData.maxScore" />
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        连续打卡额外奖励
                        <el-switch
                            v-model="isExtraState"
                            inactive-text="       "
                        />
                    </div>
                    <div class="hbb-daka-group" v-for="(item,index) in pageData.list" :key="index">
                        <div class="one one1  one2">
                            <h2> 连续打卡<el-input :disabled="!isExtraState" style="width: 60px;margin:0 10px" type="number" v-model="item.continuityDay" />天，额外赠送</h2>
                        </div>
                        <div class="one one1  one2">
                            <span class="b">积分</span>
                            <p style="display: flex;align-items: center;">
                                <el-input :disabled="!isExtraState" style="width: 100px;margin-right: 20px" type="number" v-model="item.minScore" />
                                <span style="width: 15px;height:1px;background: #ddd"></span>
                                <el-input :disabled="!isExtraState" style="width: 100px;margin-left: 20px" type="number" v-model="item.maxScore" />
                            </p>
                        </div>
                        <!--                        <div class="one one1  one2">-->
                        <!--                            <span class="b">优惠券</span>-->
                        <!--                            <p>-->
                        <!--                                100元优惠券，面值100元，仅限基金课程，有效期30天-->
                        <!--                            </p>-->
                        <!--                        </div>-->

                        <div class="btn">
                            <el-button v-if="index === pageData.list.length-1 && index !== 0" type="primary" @click="deleteRow(item, index)">删除</el-button>
                            <span v-else></span>
                        </div>
                    </div>
                    <div class="hbb-add-daka">
                        <el-button type="primary" @click="addList">添加连续打卡天数奖励</el-button>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        连续打卡周期天数
                    </div>
                    <div class="one one1">
                        <p style="width: 100%;display: flex;align-items: center">
                            连续打卡周期 <el-input style="width: 200px;margin-left: 20px" type="number" v-model="pageData.clockInPeriod" />
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        活动规则
                    </div>

                    <div class="one one1">
                        <el-input style="width: 100%;" type="textarea" rows="10"  v-model="pageData.description" />
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

    import MyImageUpload from '@/components/MyImageUpload.vue';

    @Component({
        components: {MyImageUpload}
    })

    export default class extends Mixins(commonTable) {
        pageData:any = {
            list: [], // 连续打卡奖励
            maxScore: 0, // 最大积分
            minScore: 0, // 最小积分
            isExtra: 0, // 是否开启额外奖励
            createTime: '', // 打卡启用时间
            updateTime: '', // 打卡启用时间
            description: '', // 活动规则
            clockInPeriod: 0, // 连续打卡周期
            status: true // 是否开启邀请奖励
        }
        isExtraState = true;

        mounted() {
            this.getClockInInfo();
        }

        async getClockInInfo() {
            // 取得详情
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/clockIn/getClockInInfo', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.pageData.list = resp?.data.list || [];
                this.pageData.status = resp?.data.status;
                this.pageData.maxScore = resp?.data.maxScore;
                this.pageData.minScore = resp?.data.minScore;
                this.pageData.createTime = resp?.data.createTime;
                this.pageData.updateTime = resp?.data.updateTime;
                this.pageData.isExtra = resp?.data.isExtra;
                this.isExtraState = resp?.data.isExtra === 1 ? true : false;
                this.pageData.description = resp?.data.description;
                this.pageData.clockInPeriod = resp?.data.clockInPeriod;
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        addList() {
            let obj = {
                continuityDay: 0,
                minScore: 0,
                maxScore: 0
            }
            this.pageData.list.push(obj)
        }

        deleteRow(item:any,index:number) {
            this.pageData.list.splice(index, 1)
        }


        async clickSave() {
            // 取得详情
            this.$showLoading();
            let requestArr = JSON.stringify(this.pageData.list);
            const requestData = {
                isExtra: this.isExtraState ? 1 : 0,
                clockInPeriod: this.pageData.clockInPeriod,
                description: this.pageData.description,
                clockInExtraSetting: requestArr,
                maxScore: this.pageData.maxScore,
                minScore: this.pageData.minScore,
            };
            const [err, resp] = await this.$postAsync('/clockIn/updateClockInInfo', requestData);
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
            .demo-input-suffix{
                display: flex;
                width: 100%;
                align-items: center;
                margin-bottom: 20px;
            }
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
                &.one3{
                    background: #fff;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    justify-content: flex-start !important;
                    align-items: normal;
                    h3{
                        margin-top: 20px;
                    }
                    .l{
                        padding-left: 20px;
                        margin-top: 20px;
                    }
                }
                &.one2{
                    background: #fff;
                    padding: 10px 30px;
                    color: #bbb;
                }
                p{
                    margin-left: 20px;
                    color: #666;
                    display: flex;
                    .a{
                        margin-right: 5px;
                        display: flex;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        font-size: 12px;
                        justify-content: center;
                        text-align: center;
                        align-items: center;
                        color: #fff;
                        background: #999;
                    }

                }
                .time{
                    border: none;
                    background: none;
                    color: #bbb;
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
            }
        }
    }
    .hbb-add-daka{
        display: flex;
        width: 100%;
        height: 60px;
        border-top: 1px solid #ddd;
        align-items: center;
        background: #fff;
        justify-content: flex-end;
        padding-right: 20px;
    }
    .hbb-daka-group{
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 15px 0;
        background: #fff;
        position: relative;
        .btn{
            position: absolute;
            right: 20px;
        }
    }
</style>
