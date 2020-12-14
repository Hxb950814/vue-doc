<!-- 银行管理 -->
<template>
    <div>
        <div class="page-cap-title">
            银行管理
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">银行名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.bankName"
                            style="width: 200px"
                            type="text"
                            clearable
                            placeholder="请输入银行名称"
                            maxlength="15"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div v-permission="'05070102'" class="search-union right">
                    <el-button type="primary" @click="clickAdd">
                        <i class="el-icon-plus" />
                        添加
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="bankName" label="银行名称" />
                <el-table-column prop="bankShortName" label="BankID" />
                <el-table-column prop="queryCondition" label="查询条件" />
                <el-table-column prop="inGoldCondition" label="入金条件" />
                <el-table-column prop="outGoldCondition" label="出金条件" />
                <el-table-column prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === '0'" class="list-status normal">正常</span>
                        <span v-if="scope.row.status === '1'" class="list-status red">维护</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" @click="clickDetail(scope.row.id)">查看</a>
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
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        search: any = {
            bankName: '' // 联系方式
        };

        // changeDataList: any[] = [];
        // changeDataPageSize= 10;
        // changeDataCount = 0;
        // changeDataCurrentPage= 1;

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        clickAdd() {
            this.$router.push({
                path: '/user_manage/bank_manage/add',
                query: {

                }
            });
        }

        clickDetail(id: string) {
            this.$router.push({
                path: '/user_manage/bank_manage/detail',
                query: {
                    id
                }
            });
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/bank/queryBankListPage', {
                page: this.tableData.currentPage,
                bankName: this.search.bankName
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.bankId),
                        bankName: item.bankName,
                        bankShortName: item.bankShortName,
                        queryCondition: item.queryCondition,
                        inGoldCondition: item.inGoldCondition,
                        outGoldCondition: item.outGoldCondition,
                        status: String(item.status) // 当前状态
                    });
                });
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
    }
</script>

<style lang="scss" scoped>
</style>
