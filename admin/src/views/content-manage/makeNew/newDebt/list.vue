<template>
    <div>
        <div class="page-cap-title">
            新债申购
        </div>
        <div class="nav-common-search">
            <div class="search-line">
                <div class="search-union">
                    <span class="words">新债名称:</span>
                    <div class="input-text">
                        <el-input
                            v-model.trim="search.title"
                            style="width: 160px"
                            type="text"
                            clearable
                            placeholder="请输入新债名称"
                            maxlength="50"
                            autocomplete="off"
                        />
                    </div>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="searchData">
                        查询
                    </el-button>
                </div>
                <div class="search-union right">
                    <el-button type="primary" @click="clickAddNotice">
                        <i class="el-icon-plus" />
                        新股
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="newDebtName" width="160" label="新债名称" />
                <el-table-column prop="stockType" width="80" label="新债类型" />
                <el-table-column prop="regularStockName" width="160" label="正股名称" />
                <el-table-column prop="regularStockPrice" width="80" label="正股价格">
                    <template slot-scope="scope">
                        {{ scope.row.regularStockPrice | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="issuePrice" label="发行价格">
                    <template slot-scope="scope">
                        {{ scope.row.issuePrice | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="applyLimit" label="申购上限" width="150" />
                <el-table-column prop="applyDate" label="申购日期" width="150" />
                <el-table-column prop="allotmentNumberDate" label="配号日期" width="150" />
                <el-table-column prop="winResultDate" label="中签结果" width="150" />
                <el-table-column prop="listDate" label="上市日期" width="150" />
                <el-table-column prop="paymentBySign" label="一签缴款" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.paymentBySign | money }}
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作">
                    <template slot-scope="scope">
                        <a class="link-btn color normal" style="margin: 0 5px" @click="clickEdit(scope.row.newDebtId)">查看</a>
                        <a class="link-btn normal" style="margin: 0 5px;color:#F85E5E" @click="clickDelete(scope.row.newDebtId)">删除</a>
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
            title: '' // 新股名称
        };

        mounted() {
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/newDebt/queryNewDebtListPage', {
                page: this.tableData.currentPage,
                newDebtName: this.search.title
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                this.tableData.data = resp?.data?.result;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickAddNotice() {
            this.$router.push({
                path: '/content_manage/makeNew/newDebt/add'
            });
        }

        clickEdit(id: number) {
            this.$router.push({
                path: '/content_manage/makeNew/newDebt/edit',
                query: {
                    id: String(id)
                }
            });
        }

        async clickDelete(id: number) {
            // 删除
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/newDebt/deleteNewDebtInfoById', {
                        newDebtId: id
                    }, {
                        paramType: 'form'
                    });
                    this.searchData();
                })();
            }).catch(() => {
            });
        }
    }
</script>

<style lang="scss" scoped>
</style>
