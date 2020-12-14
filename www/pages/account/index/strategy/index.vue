<!--策略-->
<template>
    <div>
        <div class="account-section-title">
            我的策略<span class="tips">(数据信息可能存在误差，需要登录期货账号进行获取)</span>
            <a class="back-btn" @click="goBack">返回</a>
        </div>
        <div class="account-section-content">
            <el-table
                :data="strategyData"
                border
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    align="center"
                    width="50px"
                >
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="strategyName"
                    align="center"
                    width="120px"
                    label="策略名称"
                >
                    <template slot-scope="scope">
                        <span class="strategyName" @click="goDetail(scope.row)">{{scope.row.strategyName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="speciesName"
                    label="交易品种"
                    align="center"
                    width="120px"
                />
                <el-table-column
                    prop="operateType"
                    label="类型"
                    align="center"
                    width="60px"
                />
                <el-table-column
                    prop="positionNum"
                    label="持仓手数"
                />
                <el-table-column
                    prop="positionAvg"
                    label="持仓均价"
                />
                <el-table-column
                    prop="positionProfitAndLoss"
                    label="持仓盈亏"
                />
                <el-table-column
                    prop="closePositionProfitAndLoss"
                    label="平仓盈亏"
                />
                <el-table-column
                    label="期货账号"
                    align="center"
                    width="120px"
                >
                    <template slot-scope="scope">
                        <p>{{ scope.row.futureCompanyName }}</p>
                        <span>{{ scope.row.futureAccountNumber }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="frozenBean"
                    align="center"
                    label="冻结K豆"
                />
                <el-table-column
                    prop="payBean"
                    align="center"
                    label="支出K豆"
                />
                <el-table-column
                    prop="dealNum"
                    align="center"
                    label="交易次数"
                />
                <el-table-column
                    prop="status"
                    align="center"
                    label="当前状态"
                    width="120"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.orderStatus === 0">
                            <span>创建中</span>
                        </div>
                        <div v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 4 || scope.row.orderStatus === 5">
                            <span>{{ ['运行中', '已结束(止损)', '已结束(止盈)', '已结束(到期)', '已结束(手动)'][scope.row.status] }}</span>
                        </div>
                        <div v-if="scope.row.orderStatus === 2">
                            <span>订单回冲</span>
                        </div>
                        <div v-if="scope.row.orderStatus === 3">
                            <span>撤单等待</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <tk-pagination
                :page-size="tableData.pageSize"
                :total="tableData.count"
                :current-page.sync="tableData.currentPage"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TkPagination from '@/components/ui/TkPagination.vue';
    import { postAsync } from '~/utils/request';

    @Component({
        components: {
            TkPagination
        }
    })
    export default class Strategy extends Vue {
        tableData = {
            pageSize: 10,
            count: 1,
            currentPage: 1
        };

        strategyData:any[] = []; // 我的策略

        mounted() {
            this.getStrategyData();
        }

        async getStrategyData() {
            const requestData = {
                page: this.tableData.currentPage
            };
            const [err, resp] = await postAsync('/strategy/queryMyStrategyListPage', requestData);
            if (resp?.code === '000000') {
                if (resp?.data?.result.length > 0) {
                    this.strategyData = resp?.data?.result;
                    this.tableData.count = resp?.data?.totalCount;
                }
            }
        }

        handleCurrentChange() {
            this.getStrategyData();
        }

        goDetail(item:any) {
            // 去详情页
            this.$router.push({
                path: '/strategy/strategyDetail',
                query: {
                    id: item.strategyOrderId
                }
            });
        }

        goBack() {
            // 返回
            this.$router.push({
                path: '/account/deal'
            });
        }
    }
</script>

<style lang="scss" scoped>
    .account-section-title{
        .back-btn{
            margin-left: auto;
            margin-right: 15px;
            line-height: 30px;
            font-size: 14px;
            background-color:  #f2f2f2;
            color: $color-main;
            padding: 0 10px;
            cursor: pointer;
            font-weight: normal;
        }
    }
    .account-section-content{
        background-color: #fff;
        padding: 10px 15px;
    }
    .strategyName{
        color: #0ca2ff;
        cursor: pointer;
    }
</style>
