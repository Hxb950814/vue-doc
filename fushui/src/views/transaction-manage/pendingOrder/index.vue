<template>
    <div>
        <div class="page-cap-title">
            挂单订单
        </div>
        <div class="page-cap-content" style="margin-top: 10px">
            <div class="hbb-page-top">
                <SearchView ref="SearchView" mode="1" @submit="onSubmit" @download="clickDownload"></SearchView>
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
                        prop="orderNumber"
                        label="订单号"
                        align="center"
                        width="190"
                    />
                    <el-table-column
                        prop="createTime"
                        align="center"
                        label="挂单时间"
                        width="180"
                    />
                    <el-table-column
                        prop="sourceName"
                        align="center"
                        label="交易所"
                        width="180"
                    />
                    <el-table-column
                        prop="contractName"
                        align="center"
                        label="合约名称"
                        width="180"
                    />
                    <el-table-column
                        prop="code"
                        align="center"
                        label="合约代码"
                        width="180"
                    />
                    <el-table-column
                        prop="sideName"
                        align="center"
                        label="操作方向"
                        width="100"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        width="140"
                        align="center"
                        label="挂单价格/元"
                    >
                        <template slot-scope="scope">
                            <span>{{Number(scope.row.price).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="挂单手数"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span>{{parseInt(Number(scope.row.amount))}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="委托手数"
                        align="center"
                        width="140"
                    />
                    <el-table-column
                        prop="futureAccountNumber"
                        label="期货账户"
                        align="center"
                        width="130"
                    />
                    <el-table-column
                        prop="futureCompanyName"
                        label="期货公司"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="orderType"
                        label="订单来源"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.orderType === 1">手动下单</span>
                            <span v-if="scope.row.orderType === 2">云策略单</span>
                            <span v-if="scope.row.orderType === 3">云条件单</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="操作用户"
                        align="center"
                        width="180"
                    />
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
    import SearchView from '../components/searchHeader.vue';
    import {downloadFileFromBlob, getDownloadFileName} from "@/utils/url";
    @Component({
        components: {
            SearchView
        }
    })

    export default class extends Mixins(commonTable) {
        search = {};

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
            this.search = (this.$refs.SearchView as any).search
            const search = (this.search as any);
            const [err, resp] = await this.$postAsync('/userOrder/getGuaOrderListPage', {
                page: this.tableData.currentPage,
                orderNumber: search.orderNumber,
                endTime: search.endTime,
                startTime: search.startTime,
                code: search.code,
                contractName: search.contractName,
                side: search.side,
                orderType: search.orderType,
                mobile: search.mobile
            }, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                const list: any = [];
                this.tableData.data = resp.data.result;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
            this.$closeLoading();
        }


        handleCurrentChange() {
            this.getDataList();
        }

        clickDownload() {
            this.$showLoading();
            this.search = (this.$refs.SearchView as any).search
            const search = (this.search as any);
            this.$post('/userOrder/guaOrderListExcel', {
                orderNumber: search.orderNumber,
                endTime: search.endTime,
                startTime: search.startTime,
                code: search.code,
                contractName: search.contractName,
                side: search.side,
                orderType: search.orderType,
                mobile: search.mobile
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
