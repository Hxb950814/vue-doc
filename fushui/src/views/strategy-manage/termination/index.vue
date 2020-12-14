<template>
    <div>
        <div class="page-cap-title">
            策略终止
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <el-form :inline="true" :model="search" class="demo-form-inline">
                    <el-form-item label="终止方式">
                        <el-select v-model="search.status" placeholder="请选择终止方式">
                            <el-option label="全部" value="" />
                            <el-option label="止损" value="1" />
                            <el-option label="止盈" value="2" />
                            <el-option label="到期" value="3" />
                            <el-option label="手动" value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="策略名称">
                        <el-input v-model="search.strategyName" placeholder="请输入策略名称" />
                    </el-form-item>
                    <el-form-item label="订阅用户">
                        <el-input v-model="search.user" placeholder="订阅人的联系方式" />
                    </el-form-item>
                    <el-form-item label="终止时间" class="hbb">
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
                    </el-form-item>
                </el-form>
            </div>

            <div class="hbb-page-table">
                <el-table
                    :data="tableData.data"
                    border
                    style="width: 100%"
                >
                    <el-table-column
                        prop="date"
                        label="序号"
                        align="center"
                        width="50"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>>
                    </el-table-column>
                    <el-table-column
                        prop="orderNo"
                        label="订单编号"
                        align="center"
                        width="180"
                    />
                    <el-table-column
                        prop="time"
                        align="center"
                        label="终止时间"
                        width="180"
                    />
                    <el-table-column
                        prop="status"
                        align="center"
                        label="终止方式"
                        width="180"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.status === 1">止损</span>
                            <span v-if="scope.row.status === 2">止盈</span>
                            <span v-if="scope.row.status === 3">到期</span>
                            <span v-if="scope.row.status === 4">手动</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="strategyName"
                        width="140"
                        align="center"
                        label="策略名称"
                    />
                    <el-table-column
                        prop="speciesName"
                        label="合约种类"
                        align="center"
                        width="120"
                    />
                    <el-table-column
                        prop="contractName"
                        label="合约名称"
                        align="center"
                        width="140"
                    />
                    <el-table-column
                        prop="operateFund"
                        label="操作资金/元"
                        align="center"
                        width="130"
                    />
                    <el-table-column
                        prop="lossRate"
                        label="最大止损/%"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.lossRate > 0">-</span>{{scope.row.lossRate}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="profitRate"
                        label="最大止盈/%"
                        align="center"
                        width="100"
                    />
                    <el-table-column
                        prop="validTime"
                        label="有效期至"
                        align="center"
                        width="180"
                    />
                    <el-table-column
                        prop="frozenBean"
                        label="冻结K豆"
                        align="center"
                        width="100"
                    />
                    <el-table-column
                        prop="mobile"
                        label="订阅用户"
                        align="center"
                        width="120"
                    />
                    <el-table-column
                        prop="futureCompany"
                        label="期货公司"
                        width="160"
                        align="center"
                    />
                    <el-table-column
                        prop="futureAccountNumber"
                        label="期货账号"
                        align="center"
                        width="140"
                    />
                    <el-table-column
                        prop="dealCount"
                        label="交易次数/次"
                        align="center"
                        width="100"
                    />
                    <el-table-column
                        prop="profitLossDrop"
                        label="最大回撤"
                        align="center"
                        width="100"
                    />
                    <el-table-column
                        prop="profitLossTotal"
                        label="当前盈亏/%"
                        align="center"
                        width="100"
                    />
                    <el-table-column
                        prop="payBean"
                        label="支出K豆"
                        align="center"
                        width="100"
                    />
                    <el-table-column
                        prop="date"
                        label="操作"
                        fixed="right"
                        width=""
                    >
                        <template slot-scope="scope">
                            <span v-permission="'08030101'" style="cursor: pointer;color: #1a7ef8" @click="lookDetail(scope.row)">查看</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="my-pagination-wrap">
                <my-pagination
                    :page-size="tableData.pageSize"
                    :total="tableData.count"
                    :current-page.sync="tableData.currentPage"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import commonTable from '@/mixins/commonTable';
    @Component({
        components: {}
    })

    export default class extends Mixins(commonTable) {
        time:string = ''; // 选择时间的占位
        search: any = {
            executeStatus: '1', // 策略列表 0=执行策略，1=终止策略
            endTime: '', // 结束时间
            startTime: '', // 开始时间
            status: '', // 终止方式，1=止损，2=止盈，3=到期，4=手动
            user: '', // 订阅用户
            strategyName: '' // 策略名称
        };

        mounted() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        onSubmit() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();

            const [err, resp] = await this.$postAsync('/strategy/queryStrategyExecuteStatusListPage', {
                page: this.tableData.currentPage,
                executeStatus: this.search.executeStatus,
                endTime: this.search.endTime,
                startTime: this.search.startTime,
                status: this.search.status,
                user: this.search.user,
                strategyName: this.search.strategyName
            }, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                const list: any = [];
                resp.data.result.forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.strategyOrderId), // 策略订单id
                        orderNo: item.orderNo, // 策略订单编号
                        time: item.time, // 订单时间/终止时间
                        strategyName: item.strategyName, // 策略名称
                        speciesName: item.speciesName, // 合约种类
                        contractName: item.contractName, // 合约名称
                        operateFund: item.operateFund || 0, // 操作资金
                        lossRate: item.lossRate || 0, // 最大止损
                        profitRate: item.profitRate || 0, // 最大止盈
                        validTime: item.validTime, // 有效期至
                        frozenBean: item.frozenBean || 0, // 冻结K豆
                        mobile: item.mobile, // 订阅用户
                        futureCompany: item.futureCompany, // 期货公司
                        futureAccountNumber: item.futureAccountNumber, // 期货账号
                        dealCount: item.dealCount || 0, // 交易次数
                        profitLossDrop: item.profitLossDrop || 0, // 最大回撤
                        profitLossTotal: item.profitLossTotal || 0, // 最终盈亏
                        status: item.status, // 终止方式
                        payBean: item.payBean || 0 // 支出K豆
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
            this.$closeLoading();
        }

        timeChange(val:any) {
            // 判断是否有值
            if (val) {
                this.search.startTime = dayjs(val[0]).format('YYYY-MM-DD');
                this.search.endTime = dayjs(val[1]).format('YYYY-MM-DD');
            } else {
                this.search.startTime = '';
                this.search.endTime = '';
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        lookDetail(row:any) {
            // 查看详情
            this.$router.push({
                path: '/strategy_manage/termination/detail',
                query: {
                    id: row.id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-page-top{
        display: flex;
        width: 100%;
        margin: 10px 0;
    }
</style>
