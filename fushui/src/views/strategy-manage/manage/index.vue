<template>
    <div>
        <div class="page-cap-title">
            策略管理
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <el-form :inline="true" :model="search" class="demo-form-inline">
                    <el-form-item label="策略状态">
                        <el-select v-model="search.status" placeholder="活动区域">
                            <el-option label="全部" value="" />
                            <el-option label="不展示" value="0" />
                            <el-option label="展示" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="策略名称">
                        <el-input v-model="search.strategyName" placeholder="请输入策略名称" />
                    </el-form-item>
                    <el-form-item label="策略ID">
                        <el-input v-model="search.strategyIdString" placeholder="请输入策略ID" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="page-table-btn" @click="onSubmit">
                            查询
                        </el-button>
                        <el-button v-permission="'08010101'" type="danger" class="page-table-btn" @click="addManage">
                            添加
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
                        prop="strategyName"
                        label="策略名称"
                        align="center"
                        width=""
                    />
                    <el-table-column
                        prop="strategyIdString"
                        label="策略ID"
                        align="center"
                        width=""
                    />
                    <el-table-column
                        prop="name"
                        label="品种数/合约数"
                        align="center"
                        width=""
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.speciesNum }}/</span>
                            <span style="cursor: pointer;color:#1a7ef8" @click="contractsClick(scope.row)">{{ scope.row.contractNum }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        label="费用模式">
                        <template slot-scope="scope">
                            <span>{{scope.row.serviceType === 0 ? '比例模式': '订阅模式'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fundTopLimit"
                        label="资金上限/万"
                        align="center"
                        width=""
                    />
                    <el-table-column
                        prop="date"
                        label="手动关闭"
                        align="center"
                        width=""
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.isHandClose ? '支持': '不支持' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="validDay"
                        label="有效天数/天"
                        align="center"
                        width=""
                    />
                    <el-table-column
                        prop="status"
                        label="当前状态"
                        align="center"
                        width=""
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.status ? '展示': '不展示' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="useNum"
                        label="使用次数"
                        align="center"
                        width=""
                    >
                        <template slot-scope="scope">
                            <span style="cursor: pointer;color:#1a7ef8" @click="usageClick(scope.row)">{{ scope.row.useNum }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="profitTotalMoney"
                        label="操作盈亏/万"
                        align="center"
                        width=""
                    />
                    <el-table-column
                        prop="frozenBean"
                        label="冻结K豆"
                        align="center"
                        width=""
                    />
                    <el-table-column
                        prop="consumeBean"
                        label="消费K豆"
                        align="center"
                        width=""
                    />
                    <el-table-column
                        prop="date"
                        label="操作"
                        width=""
                    >
                        <template slot-scope="scope">
                            <span v-permission="'08010102'" style="cursor: pointer;color: #1a7ef8" @click="lookDetail(scope.row)">查看</span>
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

        <!-- 点击合约数启动弹层 -->
        <contractsView ref="contractsView" />
        <!-- 使用数启动弹层 -->
        <usageView ref="usageView" />
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import contractsView from './modalView/contractsModal.vue';
    import usageView from './modalView/usageModal.vue';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {contractsView, usageView}
    })

    export default class extends Mixins(commonTable) {
        search: any = {
            status: '', // 策略状态
            strategyIdString: '', // 策略ID
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
            const [err, resp] = await this.$postAsync('/strategy/queryStrategyListPage', {
                page: this.tableData.currentPage,
                status: this.search.status,
                strategyIdString: this.search.strategyIdString,
                strategyName: this.search.strategyName
            }, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                const list: any = [];
                resp.data.result.forEach((item: any, idx: number) => {
                    list.push({
                        id: String(item.strategyId),
                        speciesNum: item.speciesNum, // 支持品种数
                        serviceType: item.serviceType || 0, // 服务模式
                        profitTotalMoney: item.profitTotalMoney || 0, // 操作盈亏/万
                        isHandClose: item.isHandClose ? 1 : 0, // 手动关闭 0=不支持，1=支持
                        fundTopLimit: item.fundTopLimit || 0, // 资金上限/万
                        frozenBean: item.frozenBean || 0, // 冻结K豆
                        contractNum: item.contractNum || 0, // 支持品种数
                        consumeBean: item.consumeBean || 0, // 消费K豆
                        status: item.status ? 1 : 0, // 状态
                        strategyIdString: item.strategyIdString, // 策略ID
                        strategyName: item.strategyName, // 策略名称
                        useNum: item.useNum || 0, // 使用次数
                        validDay: item.validDay || 0 // 有效天数/天
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

        getChannelStr(code: string) {
            const codeArr = code.split(',');
            const map = new Map();
            map.set('0', 'Android');
            map.set('1', 'IOS');
            map.set('2', 'H5');
            map.set('3', '小程序');
            map.set('4', 'PC');
            return codeArr.sort().map((item: string) => {
                return map.get(item) || '';
            }).filter((item: string) => {
                return item !== '';
            }).join(',') || '-';
        }

        handleCurrentChange() {
            this.getDataList();
        }

        contractsClick(row:any) {
            // 点击合约数启动弹层
            (this.$refs.contractsView as any).active(row);
        }

        usageClick(row:any) {
            // 策略使用情况
            (this.$refs.usageView as any).active(row);
        }

        addManage() {
            // 添加策略页面
            this.$router.push({
                path: '/strategy_manage/manage/add'
            });
        }

        lookDetail(row:any) {
            // 添加策略页面
            this.$router.push({
                path: '/strategy_manage/manage/detail',
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
