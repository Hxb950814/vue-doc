<template>
    <div>
        <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="订单号：" :label-width="labelWidth">
                <el-input v-model="search.orderNo" placeholder="请输入订单号" />
            </el-form-item>
            <el-form-item label="合约名称：" :label-width="labelWidth">
                <el-input v-model="search.contractName" placeholder="请输入合约名称" />
            </el-form-item>

            <el-form-item label="合约代码：" :label-width="labelWidth">
                <el-input v-model="search.code" placeholder="请输入合约代码" />
            </el-form-item>
            <el-form-item label="操作用户：" :label-width="labelWidth">
                <el-input v-model="search.mobile" placeholder="订阅人的联系方式" />
            </el-form-item>
            <el-form-item v-if="mode === '1'" label="运行状态：" :label-width="labelWidth">
                <el-select v-model="search.status" placeholder="请选择运行状态">
                    <el-option label="全部" value="" />
                    <el-option label="运行中" value="0" />
                    <el-option label="暂停" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="多空：" :label-width="labelWidth">
                <el-select v-model="search.operateOne" placeholder="请选择操作方向">
                    <el-option label="全部" value="" />
                    <el-option label="买多" value="1" />
                    <el-option label="卖空" value="2" />
                    <el-option label="买平" value="3" />
                    <el-option label="卖平" value="4" />
                </el-select>
            </el-form-item>
            <el-form-item label="类型：" :label-width="labelWidth">
                <el-select v-model="search.orderType" placeholder="请选择订单来源">
                    <el-option label="全部" value="" />
                    <el-option label="价格条件单" value="0" />
                    <el-option label="时间条件单" value="1" />
                </el-select>
            </el-form-item>
<!--            <el-form-item label="止损方式：" :label-width="labelWidth" class="hbb">-->
<!--                <el-select v-model="search.orderStatus" placeholder="请选择当前状态">-->
<!--                    <el-option label="全部" value="" />-->
<!--                    <el-option label="限价止损" value="1" />-->
<!--                    <el-option label="限价止盈" value="2" />-->
<!--                    <el-option label="限价止损盈" value="3" />-->
<!--                    <el-option label="动态追踪" value="4" />-->
<!--                    <el-option label="指定止损盈" value="5" />-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <el-form-item :label-width="labelWidth" label="创建时间：" class="hbb">
                <el-date-picker
                    v-model="search.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    @change="timeChange"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">
                    查询
                </el-button>
                <el-button type="primary" @click="clickDownload">
                    下载
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import dayjs from 'dayjs';

    @Component({})
    export default class extends Vue {
        @Prop({type: String, default: '1', required: false})
        mode!:string;

        time: string = ''; // 选择时间的占位
        search: any = {
            orderNo: '', // 订单号
            code: '', // 合约代码
            contractName: '', // 合约名称
            status: '', // 运行状态
            endTime: '', // 结束时间
            startTime: '', // 开始时间
            orderType: '', // '云条件单类型 0=价格条件单 1=时间条件单',
            operateOne: '', // 操作方向 全部、买多、卖空、买平、卖平
            mobile: '' // 操作用户
            // orderStatus: ''
        };

        labelWidth:string = '90px';

        timeChange(val: any) {
            // 判断是否有值
            if (val) {
                this.search.startTime = dayjs(val[0]).format('YYYY-MM-DD');
                this.search.endTime = dayjs(val[1]).format('YYYY-MM-DD');
            } else {
                this.search.startTime = '';
                this.search.endTime = '';
            }
        }

        onSubmit() {
            this.$emit('submit');
        }

        clickDownload() {
            this.$emit('download');
        }
    }
</script>

<style lang="scss" scoped>

</style>
