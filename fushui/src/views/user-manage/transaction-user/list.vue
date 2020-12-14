<!-- 交易用户 -->
<template>
    <div>
        <div class="page-cap-title">
            交易用户
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">期货公司:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.company"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
                            maxlength="11"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">联系方式:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.phone"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入联系方式"
                            maxlength="11"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">账号状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.accountStatus"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="-1" label="全部" />
                            <el-option value="0" label="待审核" />
                            <el-option value="1" label="已通过" />
                            <el-option value="2" label="已解绑" />
                            <el-option value="3" label="未通过" />
                            <el-option value="4" label="已删除" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">策略状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.strategyStatus"
                            style="width: 160px"
                            placeholder="全部"
                        >
                            <el-option value="-1" label="全部" />
                            <el-option value="0" label="进行中" />
                            <el-option value="1" label="已结束" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'05030101'" type="primary" @click="clickDownload">
                        <i class="el-icon-download" />
                        下载
                    </el-button>
                </div>
            </div>
            <div class="search-line" style="margin-top: 20px">
                <div class="search-union">
                    <span class="words">排序:</span>
                    <el-radio-group v-model="search.order">
                        <el-radio-button label="0">
                            注册时间
                        </el-radio-button>
                        <el-radio-button label="1">
                            可用资金
                        </el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="mobile" label="联系方式" />
                <el-table-column prop="futureCompanyName" label="期货公司" />
                <el-table-column prop="futureAccountNumber" label="期货账号" />
                <el-table-column prop="ableUseMoney" label="-">
                    <template slot="header">
                        可用资金/元
                        <el-tooltip popper-class="poshytips" content="数据根据用户在平台上登录期货账号的最后一次时间获取" placement="top">
                            <i class="el-icon-warning-outline" />
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.ableUseMoney | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="holdProfitLoss" label="持仓盈亏">
                    <template slot="header">
                        持仓盈亏/元
                        <el-tooltip popper-class="poshytips" content="数据根据用户在平台上登录期货账号的最后一次时间获取" placement="top">
                            <i class="el-icon-warning-outline" />
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        <a v-if="scope.row.holdProfitLoss >= 0" class="list-status red nodot">+{{ scope.row.holdProfitLoss | money }}</a>
                        <a v-else class="list-status normal nodot">{{ scope.row.holdProfitLoss | money }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="tradeMoney" label="交易资金/元">
                    <template slot-scope="scope">
                        {{ scope.row.tradeMoney | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="telephone" label="策略交易资金/元">
                    <template slot-scope="scope">
                        {{ scope.row.strategyTradeMoney | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="telephone" label="策略状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.strategyStatus === 0" class="list-status normal">进行中</a>
                        <a v-if="scope.row.strategyStatus === 1" class="list-status red">已结束</a>
                    </template>
                </el-table-column>
                <el-table-column prop="telephone" label="策略盈亏/元">
                    <template slot-scope="scope">
                        <a v-if="scope.row.strategyProfitLoss >= 0" class="list-status red nodot">+{{ scope.row.strategyProfitLoss | money }}</a>
                        <a v-else class="list-status normal nodot">{{ scope.row.strategyProfitLoss | money }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="accountStatus" label="账号状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.accountStatus === 0" class="list-status normal">正常</a>
                        <a v-else-if="scope.row.accountStatus === 1" class="list-status red">解绑</a>
                        <a v-else class="list-status disabled">--</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="form-under-text">
                可用资金：{{ remainMoney | money }}元
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
    import commonTable from '@/mixins/commonTable';
    import {downloadFileFromBlob, getDownloadFileName} from '@/utils/url';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            company: '', // 公司
            phone: '', // 联系方式
            accountStatus: '-1', // 账号状态
            strategyStatus: '-1', // 策略状态
            order: '0'
        };

        remainMoney = 0;

        @Watch('search.order')
        onOrderTypeChange(val: string) {
            this.searchData();
        }

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/futureAccount/queryFutureAccountListPage', {
                isTrade: 1,
                page: this.tableData.currentPage,
                futureCompanyName: this.search.company,
                mobile: this.search.phone,
                strategyStatus: this.search.strategyStatus,
                accountStatus: this.search.accountStatus,
                orderType: this.search.order
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.futureAccountId),
                        mobile: item.mobile,
                        futureAccountNumber: item.futureAccountNumber,
                        futureCompanyName: item.futureCompanyName,
                        holdProfitLoss: Number(item.holdProfitLoss),
                        strategyProfitLoss: item.strategyProfitLoss,
                        strategyStatus: item.strategyStatus,
                        strategyTradeMoney: item.strategyTradeMoney,
                        tradeMoney: item.tradeMoney,
                        accountStatus: Number(item.accountStatus),
                        ableUseMoney: Number(item.ableUseMoney)
                    });
                });
                this.remainMoney = resp?.data?.otherData?.totalAbleUseMoney || 0;
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickAdd(id: string) {
            this.$router.push({
                path: '/permission_manage/accounts/add',
                query: {
                    id
                }
            });
        }

        clickEdit(id: string, status: string) {
            this.$router.push({
                path: '/permission_manage/accounts/edit',
                query: {
                    id
                }
            });
        }

        clickDownload() {
            this.$showLoading();
            this.$post('/futureAccount/futureAccountListExcel', {
                isTrade: 1,
                futureCompanyName: this.search.company,
                mobile: this.search.phone,
                strategyStatus: this.search.strategyStatus,
                accountStatus: this.search.accountStatus,
                orderType: this.search.order
            }, {
                paramType: 'form',
                responseType: 'blob'
            }).then((resp: any) => {
                this.$closeLoading();
                if (resp?.data?.type === 'application/json') {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const content = reader.result;// 内容就在这里
                        try {
                            const re = JSON.parse(content as string);
                            this.$showToast(re?.message || '下载失败');
                        } catch (e) {
                            this.$showToast('下载失败');
                        }
                    };
                    reader.readAsText(resp.data, 'utf-8');
                } else {
                    downloadFileFromBlob(resp.data, getDownloadFileName(resp?.headers?.['content-disposition'] || '')); // 下载这个文件
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
