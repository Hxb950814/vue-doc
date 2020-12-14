<!-- 行情指数 -->
<template>
    <div>
        <div class="page-cap-title">
            行情指数
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">指数名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.name"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入名称"
                            maxlength="10"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union">
                    <span class="words">展示状态:</span>
                    <div class="input-text">
                        <el-select
                            v-model.trim="search.status"
                            style="width: 160px"
                            placeholder="全部"
                            clearable
                        >
                            <el-option value="" label="全部" />
                            <el-option value="1" label="已上架" />
                            <el-option value="0" label="已下架" />
                        </el-select>
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                    <el-button v-permission="'06040101'" type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="indexName" label="指数名称" />
                <el-table-column prop="telephone" label="指数数据" width="220px">
                    <template slot="header">
                        <div style="padding: 8px 0">
                            <div style="padding-bottom: 10px">
                                指数数据
                            </div>
                            <div class="title-flex">
                                <span>价格</span>
                                <span>涨跌</span>
                                <span>涨幅%</span>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <div class="title-flex" :class="scope.row.changeValue >= 0 ? 'up' : 'down'">
                            <span>{{ scope.row.price }}</span>
                            <span>{{ scope.row.changeValue }}</span>
                            <span>{{ scope.row.changeRate }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sortby" label="展示顺序" />
                <el-table-column prop="status" label="展示状态">
                    <template slot-scope="scope">
                        <a v-if="scope.row.status === 1" class="list-status  normal">已上架</a>
                        <a v-if="scope.row.status === 0" class="list-status red">已下架</a>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <div v-if="!checkPermissionNotExist('06040102')">
                            <div v-if="!scope.row.isErased">
                                <a
                                    class="link-btn color normal"
                                    style="margin: 0 5px"
                                    @click="clickEdit(scope.row.id)"
                                >查看</a>
                            </div>
                            <div v-else>
                                --
                            </div>
                        </div>
                        <div v-else>
                            --
                        </div>
                    </template>
                </el-table-column>
            </el-table>
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
    import {ContractDataSocket, EnumContractDataKey, TypeContractData} from '@common/src/future';
    import commonTable from '@/mixins/commonTable';

    let dataSocketInstance: any = null;
    let keepIncomeData: any[] = [];
    let keepCoedsData: string[] = [];
    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            name: '', // 种类名称
            exchangeId: '', // 交易所id
            status: '' // 展示状态
        };

        sourceList: any = [];

        async mounted() {
            this.getDataList();
            await this.initDataSocket();
        }

        beforeDestroy() {
            // this.destroyDataSocket();
        }

        async initDataSocket() {
            /* 开启socket */
            dataSocketInstance = ContractDataSocket.getIdleDataSocket(this);
            dataSocketInstance.addListener((errCode: number, incomeData: any) => {
                keepIncomeData = incomeData;
                // console.log('数据:', incomeData);
                if (errCode === 0) {
                    this.handleSocketData(incomeData);
                }
            });
            // console.log('ss', dataSocketInstance2);
            /* 链接 */
            const results = await dataSocketInstance.connect();
        }

        handleSocketData(incomeData: any) {
            // console.log('ss', incomeData);
            if (Array.isArray(incomeData)) {
                this.tableData.data.forEach((item: any, idx: number) => {
                    const find = incomeData.find((unit: TypeContractData) => {
                        return item.apiCode && unit.code === item.apiCode;
                    });
                    if (find) {
                        item.price = find[EnumContractDataKey.price] || '--';
                        item.changeValue = find[EnumContractDataKey.changeValue] >= 0 ? '+' + find[EnumContractDataKey.changeValue] : '--';
                        item.changeRate = find[EnumContractDataKey.changeValue] >= 0 ? '+' + find[EnumContractDataKey.changeRate] + '%' : '--';
                    }
                });
            }
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();

            // 需要停止请求socket
            if (keepCoedsData && keepCoedsData.length > 0) {
                dataSocketInstance && dataSocketInstance.sendCancelContractTickGroupMessage(keepCoedsData);
            }

            const [err, resp] = await this.$getAsync('/quotation/selectQuotationIndexListPage', {
                page: this.tableData.currentPage,
                indexName: this.search.name,
                status: this.search.status
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.quotationIndexId),
                        indexName: item.indexName, // 系统账号
                        apiCode: item.apiCode,
                        price: '--',
                        changeValue: '--',
                        changeRate: '--',
                        contractNumber: item.contractNumber,
                        speciesName: item.speciesName,
                        sortby: item.sortby,
                        status: Number(item.status)
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;

                keepCoedsData = list.filter((item: any) => !!item.apiCode).map((item: any) => item.apiCode);
                keepCoedsData = Array.from(new Set(keepCoedsData)); // 去除重複
                if (keepCoedsData.length > 0) {
                    dataSocketInstance.sendContractTickGroupMessage(keepCoedsData); // 发送数据
                }
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
                path: '/situation_manage/index/add',
                query: {
                    id
                }
            });
        }

        clickEdit(id: string) {
            this.$router.push({
                path: '/situation_manage/index/detail',
                query: {
                    id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .title-flex {
        display: flex;
        &.up > span {
            color: #ff1a02
        }

        &.down > span {
            color: #03b602;
        }
        > span {
            flex: 1;
        }
    }
</style>
